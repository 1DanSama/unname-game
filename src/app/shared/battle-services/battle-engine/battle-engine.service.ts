import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CountTotalStatsService} from '../count-total-stats.service';
import {EnemyInitService} from '../enemy-init.service';
import {BattleCharacterMovingService} from '../battle-character-moving.service';
import {BattleActionService} from '../battle-action.service';
import {ButtleGetTargetValueService} from '../buttle-get-target-value.service';
import {PartyPowerCalculatorService} from '../../party-power-calculator.service';
import {CharacterClass} from '../../../store/recruted-adventures/recruted-abventures.model';
import {IEnemyPowerSettings} from '../../../battle-field/dattle-field.model';
import {QuestManagerService} from '../../quest-manager.service';
import {
  IActiveActionStatus,
  IBattleCharacter, RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

export interface BattleState {
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
  participants: IBattleCharacter[];
  battleRows: BattleRow[];
  battleLog: string[];
  isBattleInProgress: boolean;
  currentRound: number;
  currentTurnIndex: number;
  damageNumbers: { id: string; value: number; x: number, y: number }[];
  healNumbers: { id: string; value: number; x: number, y: number }[];
}

interface BattleRow {
  rowNumber: number;
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
}

@Injectable({providedIn: 'root'})
export class BattleEngineService {
  isInitialized = false;

  private state: BattleState = {
    allies: [],
    enemies: [],
    participants: [],
    battleRows: [],
    battleLog: [],
    isBattleInProgress: false,
    currentRound: 1,
    currentTurnIndex: 0,
    damageNumbers: [],
    healNumbers: []
  };

  stateChanged = new BehaviorSubject<BattleState>(this.state);
  private destroy$ = new Subject<void>();
  private battleInterval: any;

  readonly roundDelay = 1500;
  readonly battleSpead = 1000;

  constructor(
    private countTotalStats: CountTotalStatsService,
    private enemyInit: EnemyInitService,
    private battleMoving: BattleCharacterMovingService,
    private battleAction: BattleActionService,
    private targetService: ButtleGetTargetValueService,
    private partyPower: PartyPowerCalculatorService,
    private questManagerService: QuestManagerService,
    private ngZone: NgZone) {
  }

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings) {
    this.isInitialized = true;

    const newState: BattleState = {
      allies: [],
      enemies: [],
      participants: [],
      battleRows: [],
      battleLog: [],
      isBattleInProgress: false,
      currentRound: 1,
      currentTurnIndex: 0,
      damageNumbers: [],
      healNumbers: []
    };

    const partyStats = this.partyPower.calculatePartyStats(recruited);

    const enemies = this.enemyInit.generateBalancedEnemies(
      partyStats.totalPower * enemyPower.enemyPowerMultiplier,
      enemyPower.averageLevel || partyStats.averageLevel * enemyPower.enemyLevelMultiplier,
      enemyPower.enemyPartySize || partyStats.partySize * enemyPower.enemyPartySizeMultiplier
    );

    const allies = recruited.map(char => this.createBattleCharacter(char, false));
    const enemyCharacters = enemies.map(enemy => this.createBattleCharacter(enemy, true));

    newState.allies = allies;
    newState.enemies = enemyCharacters;
    newState.isBattleInProgress = true;
    newState.participants = this.getSortedParticipants(allies, enemyCharacters);
    newState.battleRows = this.createBattleRows(allies, enemyCharacters);

    this.updateState(newState);
    this.processBattleRound();
  }

  private createBattleCharacter(char: RecruitedAdventures, isEnemy: boolean): IBattleCharacter {
    const stats = this.countTotalStats.calculateTotalStats(char.personalStats, char.equipeStats);
    return {
      ...char,
      previousRow: this.getStartPosition(char.className, isEnemy),
      currentRow: this.getStartPosition(char.className, isEnemy),
      characterStats: stats,
      currentHealth: char.maxHealthPoints ?? 0,
      currentMana: char.maxManaPoints ?? 0,
      isEnemy: isEnemy,
      initiative: stats.agility + Math.random() * 10,
      isActive: true,
      armor: char.equipeStats?.physicalArmor || 0,
      maxRow: 6,
      attackRange: this.calculateAttackRange(char.className),
      movementSpeed: this.calculateMovementSpeed(char.className),
      equipment: char.equipment || {},
      isTemporary: false,
      activeActionStatus: {
        isTakingDamage: false,
        isDead: false,
        isHeal: false,
        isEvaded: false,
        isCriticalDamaged: false,
      },
      isActionCompleted: false,
      canMoveForward: true,
      rowPosition: this.getRowPosition(char.className) as rowPosition,
      lastDamage: 0,
      lastHeal: 0
    };
  }

  startBattle() {
    if (this.state.isBattleInProgress) return;
    this.updateState({...this.state, isBattleInProgress: true});
    this.processBattleRound();
  }

  stopBattle() {
    this.isInitialized = false;
    clearTimeout(this.battleInterval);
    this.updateState({
      ...this.state,
      isBattleInProgress: false,
      currentRound: 1,
      currentTurnIndex: 0,
      participants: [],
      battleRows: [],
      damageNumbers: [],
      healNumbers: []
    });
  }

  private processBattleRound() {
    try {
      if (this.checkBattleEnd()) return;

      this.updateParticipants();
      let currentIndex = 0;

      const processNext = () => {
        if (currentIndex >= this.state.participants.length) {
          this.handleRoundEnd();
          return;
        }

        const participant = this.state.participants[currentIndex];

        if (!participant.isActive || participant.currentHealth <= 0) {
          currentIndex++;
          processNext();
          return;
        }

        this.updateState({...this.state, currentTurnIndex: currentIndex});

        this.performAutoAction(participant, () => {
          currentIndex++;
          setTimeout(() => {
            if (this.state.isBattleInProgress) {
              processNext();
            }
          }, this.battleSpead);
        });
      };

      processNext();
    } catch (error) {
      console.error(error);
      this.stopBattle();
    }
  }

  private handleRoundEnd() {
    if (this.checkBattleEnd()) return;

    this.updateState({
      ...this.state,
      currentRound: this.state.currentRound + 1
    });

    this.resetCharacterStates();
    this.updateParticipants();

    if (this.state.isBattleInProgress) {
      this.battleInterval = setTimeout(() => {
        this.processBattleRound();
      }, this.roundDelay);
    }
  }

  private updateCharacterState(char: IBattleCharacter) {
    const isActive = char.currentHealth > 0;
    const updatedChar = {
      ...char,
      isActive,
      activeActionStatus: {
        ...char.activeActionStatus,
        isDead: !isActive
      }
    };

    if (!isActive) {
      console.log('char', char)
    }

    const array = updatedChar.isEnemy ? this.state.enemies : this.state.allies;
    const updatedArray = array.map(c => c.id === updatedChar.id ? updatedChar : c);

    this.updateState({
      ...this.state,
      [updatedChar.isEnemy ? 'enemies' : 'allies']: updatedArray
    });
  }

  private performAutoAction(attacker: IBattleCharacter, onComplete: () => void) {
    try {
      const validTargets = this.getValidTargets(attacker);
      this.updateCharacterState({...attacker, currentAction: 'preparing'});
      this.battleAction.performAutoAction(attacker, validTargets, (result) => {
        result.updatedTargets.forEach(t => this.updateCharacterState(t));
        if (!result.updatedTargets.some(t => t.id === result.updatedAttacker.id)) {
          this.updateCharacterState(result.updatedAttacker);
        }
        this.addToLog(result.logs);
        this.updateParticipants();
        onComplete();
      });
    } catch (error) {
      onComplete();
      console.error( error);
    }
  }

  updateCharacterEffectState(characterId: number, effect: keyof IActiveActionStatus, value: boolean) {
    const updateCharacter = (character: IBattleCharacter) => {
      if (character.id === characterId) {
        return {
          ...character,
          activeActionStatus: {
            ...character.activeActionStatus,
            [effect]: value
          }
        };
      }
      return character;
    };

    const updatedAllies = this.state.allies.map(updateCharacter);
    const updatedEnemies = this.state.enemies.map(updateCharacter);

    this.updateState({
      ...this.state,
      allies: updatedAllies,
      enemies: updatedEnemies
    });
  }

  private updateState(newState: BattleState) {
    if (JSON.stringify(this.state) === JSON.stringify(newState)) {
      console.warn('[BattleEngine] State update skipped (no changes)');
      return;
    }

    this.state = {...newState};
    this.stateChanged.next(this.state);
  }

  private getValidTargets(attacker: IBattleCharacter): IBattleCharacter[] {
    const activeAllies = this.state.allies.filter(a => a.isActive && a.currentHealth > 0);
    const activeEnemies = this.state.enemies.filter(e => e.isActive && e.currentHealth > 0);

    let targets = this.targetService.getValidTargets(
      attacker,
      activeAllies,
      activeEnemies
    );

    if (attacker.className === CharacterClass.Healer) {
      const needsSelfHeal = attacker.currentHealth < (attacker.maxHealthPoints * 0.8);
      const validSelfTarget = attacker.isActive && attacker.currentHealth > 0;

      if (targets.length === 0 && validSelfTarget && needsSelfHeal) {
        targets = [attacker];
      }
    }

    targets = targets.filter(t =>
      t.isActive &&
      t.currentHealth > 0 &&
      this.isInAttackRange(attacker, t)
    );

    if (targets.length === 0) {
      this.handleNoTargets(attacker, attacker?.isEnemy ? activeEnemies:activeAllies);
      return [];
    }

    return targets;
  }

  private isInAttackRange(attacker: IBattleCharacter, target: IBattleCharacter): boolean {
    const rowDifference = Math.abs(attacker.currentRow - target.currentRow);
    return rowDifference <= attacker.attackRange;
  }

  private handleNoTargets(attacker: IBattleCharacter, targets: IBattleCharacter[]) {
    const movement = attacker.movementSpeed;
    let newRow: rowPosition;

    if (attacker.isEnemy) {
      newRow = Math.max(1, attacker.currentRow - movement) as rowPosition;
    } else {
      if (attacker.className === CharacterClass.Healer) {
        const allies = targets.filter(t => !t.isEnemy && t.id !== attacker.id);

        if (allies.length === 0) {
          newRow = attacker.currentRow;
        } else {
          const closestAllyInFront = allies.reduce((closest, ally) => {
            return ally.currentRow > attacker.currentRow && ally.currentRow < closest
              ? ally.currentRow
              : closest;
          }, 6);

          if (closestAllyInFront !== 6) {
            newRow = Math.min(attacker.currentRow + movement, closestAllyInFront) as rowPosition;
          } else {
            const farthestAllyRow = allies.reduce<number>(
              (max: number, ally: IBattleCharacter) => Math.max(max, ally.currentRow),
              attacker.currentRow
            );
            newRow = Math.min(
              Math.min(farthestAllyRow, 6),
              attacker.currentRow + movement
            ) as rowPosition;
          }
        }
      } else {
        newRow = Math.min(6, attacker.currentRow + movement) as rowPosition;
      }
    }

    newRow = Math.min(6, Math.max(1, newRow)) as rowPosition;

    if (newRow !== attacker.currentRow) {
      this.moveCharacter(attacker, newRow);
    } else {
      this.addToLog(`${attacker.name} couldn't find a path!`);
    }
  }
  private moveCharacter(char: IBattleCharacter, newRow: rowPosition) {
    if (newRow === char.currentRow) {
      return;
    }

    const blockingAllies = this.state.allies.filter(a =>
      a.id !== char.id &&
      !a.isEnemy &&
      a.currentRow === newRow
    );

    const movementResult = this.battleMoving.calculateMovement(
      char,
      newRow,
      blockingAllies,
      char.maxRow,
      char.attackRange
    );

    if (!movementResult.canMove) {
      if (movementResult.log) {
        this.addToLog(movementResult.log);
      }
      return;
    }

    const updatedChar: IBattleCharacter = {
      ...char,
      ...movementResult.updatedChar,
      previousRow: char.currentRow,
      currentRow: newRow,
      currentAction: 'move',
      currentHealth: movementResult?.updatedChar?.currentHealth ?? char.currentHealth,
      currentMana: movementResult?.updatedChar?.currentMana ?? char.currentMana
    };

    if (!movementResult?.updatedChar?.currentMana || movementResult?.updatedChar?.currentHealth) {
      console.log('error movementResult', movementResult)
      console.log('error with', movementResult?.updatedChar?.currentHealth)
      console.log('error with',  movementResult?.updatedChar?.currentMana)
    }

    const targetArray = char.isEnemy ? 'enemies' : 'allies';
    const updatedArray = this.state[targetArray].map(c =>
      c.id === char.id ? updatedChar : c
    );

    if (this.isEqual(this.state[targetArray], updatedArray)) {
      return;
    }

    this.ngZone.run(() => {
      this.updateState({
        ...this.state,
        [targetArray]: updatedArray
      });
      this.addToLog(movementResult.log!);
      this.updateBattleRows();
    });

    setTimeout(() => {
      const clearedArray = this.state[targetArray].map(c =>
        c.id === char.id ? {...updatedChar, currentAction: undefined} : c
      );

      if (!this.isEqual(this.state[targetArray], clearedArray)) {
        this.updateState({
          ...this.state,
          [targetArray]: clearedArray
        });
      }

      this.updateParticipants();
    }, 700);
  }

  private checkBattleEnd(): boolean {
    const enemiesActive = this.state.enemies.some(e => e.isActive);
    const alliesActive = this.state.allies.some(a => a.isActive);

    if (!enemiesActive || !alliesActive) {
      this.stopBattle();
      if (!enemiesActive) {
        this.questManagerService.updateQuestProgress('arena', 1);
        this.addToLog('You win the battle.');
      }
      if (!alliesActive) {
        this.addToLog('You lost the battle');
      }
      return true;
    }
    return false;
  }

  private updateParticipants() {
    const participants = [
      ...this.state.allies.filter(p => p.isActive && p?.currentHealth > 0),
      ...this.state.enemies.filter(p => p.isActive && p?.currentHealth > 0)
    ].sort((a, b) => b.initiative - a.initiative);

    if (participants.length === 0) {
      this.stopBattle();
      return;
    }

    this.updateState({...this.state, participants});
    this.updateBattleRows();
  }

  private updateBattleRows() {
    const battleRows = [1, 2, 3, 4, 5, 6].map(row => ({
      rowNumber: row,
      allies: this.state.allies.filter(a => a.currentRow === row && a.isActive),
      enemies: this.state.enemies.filter(e => e.currentRow === row && e.isActive)
    }));

    this.updateState({...this.state, battleRows});
  }

  private addToLog(messages: string | string[]) {
    const newMessages = Array.isArray(messages) ? messages : [messages];
    this.updateState({
      ...this.state,
      battleLog: [...newMessages, ...this.state.battleLog]
    });
  }

  private resetCharacterStates() {
    const resetCharacter = (c: IBattleCharacter) => ({
      ...c,
      currentAction: undefined,
      isActionCompleted: false,
      isActive: c?.currentHealth > 0
    });

    this.updateState({
      ...this.state,
      allies: this.state.allies.map(resetCharacter),
      enemies: this.state.enemies.map(resetCharacter)
    });
  }

  private getStartPosition(className: string, isEnemy: boolean): rowPosition {
    if (isEnemy) {
      return className === CharacterClass.Warrior ? 4 :
        className === CharacterClass.Rogue ? 5 : 6;
    }
    return className === CharacterClass.Warrior ? 3 :
      className === CharacterClass.Rogue ? 2 : 1;
  }

  private calculateAttackRange(className: string): number {
    return className === CharacterClass.Warrior || className === CharacterClass.Rogue ? 1 : 3;
  }

  private calculateMovementSpeed(className: string): number {
    return 1;
  }

  private getRowPosition(className: string): rowPosition {
    switch (className) {
      case CharacterClass.Warrior:
        return 3;
      case CharacterClass.Rogue:
        return 2;
      default:
        return 1;
    }
  }

  private getSortedParticipants(allies: IBattleCharacter[], enemies: IBattleCharacter[]): IBattleCharacter[] {
    return [...allies, ...enemies]
      .filter(p => p.isActive && p?.currentHealth > 0)
      .sort((a, b) => b.initiative - a.initiative);
  }

  private createBattleRows(allies: IBattleCharacter[], enemies: IBattleCharacter[]): BattleRow[] {
    return [1, 2, 3, 4, 5, 6].map(row => ({
      rowNumber: row,
      allies: allies.filter(a => a?.currentRow === row && a.isActive),
      enemies: enemies.filter(e => e?.currentRow === row && e.isActive)
    }));
  }

  private isEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a == null || b == null) return a === b;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      if (aKeys.length !== bKeys.length) return false;

      for (const key of aKeys) {
        if (!b.hasOwnProperty(key)) return false;
        if (!this.isEqual(a[key], b[key])) return false;
      }
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.stopBattle();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
