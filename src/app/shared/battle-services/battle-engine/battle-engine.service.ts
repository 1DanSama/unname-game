import {
  IActiveActionStatus,
  IBattleCharacter, RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {Injectable} from '@angular/core';
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
    private questManagerService: QuestManagerService) {
  }

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings) {
    this.isInitialized = true;

    this.state = {
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

    // Генерація ворогів
    const enemies = this.enemyInit.generateBalancedEnemies(
      partyStats.totalPower * enemyPower.enemyPowerMultiplier,
      enemyPower.averageLevel || partyStats.averageLevel * enemyPower.enemyLevelMultiplier,
      enemyPower.enemyPartySize || partyStats.partySize * enemyPower.enemyPartySizeMultiplier
    );

    // Створення бойових персонажів
    const allies = recruited.map(char => this.createBattleCharacter(char, false));
    const enemyCharacters = enemies.map(enemy => this.createBattleCharacter(enemy, true));

    // Оновлення учасників і рядів битви
    this.updateParticipants();
    this.updateBattleRows();

    // Примусовий запуск битви
    this.processBattleRound();
    // Синхронне оновлення стану
    this.updateState({
      ...this.state,
      allies: allies,
      enemies: enemyCharacters,
      isBattleInProgress: true
    });
  }

  private createBattleCharacter(char: RecruitedAdventures, isEnemy: boolean): IBattleCharacter {
    const stats = this.countTotalStats.calculateTotalStats(char.personalStats, char.equipeStats);
    return {
      ...char,
      previousRow: this.getStartPosition(char.className, isEnemy),
      currentRow: this.getStartPosition(char.className, isEnemy),
      characterStats: stats,
      currentHealth: char.maxHealthPoints || 0,
      currentMana: char?.maxManaPoints || 0,
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
      // 1. Перевірка стану битви
      if (this.checkBattleEnd()) {
        return;
      }

      // 2. Оновлення учасників
      this.updateParticipants();

      let currentIndex = 0;
      const processNext = () => {
        // 3. Перевірка завершення раунду
        if (currentIndex >= this.state.participants.length) {
          this.handleRoundEnd();
          return;
        }

        // 4. Отримання поточного учасника
        const participant = this.state.participants[currentIndex];

        // 5. Перевірка активності учасника
        if (!participant.isActive || participant.currentHealth <= 0) {
          currentIndex++;
          processNext();
          return;
        }

        // 6. Оновлення індексу ходу
        this.updateState({
          ...this.state,
          currentTurnIndex: currentIndex
        });

        // 7. Виконання дії з затримкою
        this.performAutoAction(participant, () => {
          currentIndex++;

          // 8. Запуск наступного ходу через таймер
          setTimeout(() => {
            if (this.state.isBattleInProgress) {
              processNext();
            }

            // TODO update for encreas battle spead
          }, this.battleSpead);
        });
      };

      // 9. Старт процесу
      processNext();

    } catch (error) {
      console.error(error);
      this.stopBattle();
    } finally {
      console.groupEnd();
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

    const array = updatedChar.isEnemy ? this.state.enemies : this.state.allies;
    const updatedArray = array.map(c => c.id === updatedChar.id ? updatedChar : c);

    this.updateState({
      ...this.state,
      [updatedChar.isEnemy ? 'enemies' : 'allies']: updatedArray
    });
  }

  private performAutoAction(
    attacker: IBattleCharacter,
    onComplete: () => void
  ) {
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
      console.log('error')
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
      console.warn('[BattleEngine] 🚨 State update skipped (no changes)');
      return;
    }

    this.state = {...newState};
    this.stateChanged.next(this.state);
  }

  private getValidTargets(attacker: IBattleCharacter): IBattleCharacter[] {
    let targets = this.targetService.getValidTargets(
      attacker,
      this.state.allies,
      this.state.enemies
    );

    if (attacker.className === CharacterClass.Healer && targets.length === 0) {
      targets = [attacker];
    }

    if (!targets.length) this.handleNoTargets(attacker);
    return targets;
  }

  private handleNoTargets(attacker: IBattleCharacter) {
    const movement = attacker.movementSpeed;
    let newRow: rowPosition;

    if (attacker.isEnemy) {
      newRow = Math.max(1, attacker.currentRow - movement) as rowPosition;
    } else {
      newRow = Math.min(6, attacker.currentRow + movement) as rowPosition;
    }

    if (newRow !== attacker.currentRow) {
      this.moveCharacter(attacker, newRow);
    } else {
      this.addToLog(`${attacker.name} couldn't move!`);
    }
  }

  private moveCharacter(char: IBattleCharacter, newRow: rowPosition) {
    const otherAllies = this.state.allies.filter(a =>
      a.id !== char.id &&
      !a.isEnemy &&
      a.className !== CharacterClass.Healer
    );

    const movementResult = this.battleMoving.calculateMovement(
      char,
      newRow,
      otherAllies,
      char.maxRow,
      char.attackRange
    );

    if (!movementResult.canMove) {
      if (movementResult.log) this.addToLog(movementResult.log);
      return;
    }

    const updatedChar = {
      ...movementResult.updatedChar,
      previousRow: char.currentRow,
      currentRow: newRow,
      currentAction: 'move'
    };

    const updatedArray = char.isEnemy
      ? this.state.enemies.map(c => c.id === char.id ? updatedChar : c)
      : this.state.allies.map(c => c.id === char.id ? updatedChar : c);

    this.updateState({
      ...this.state,
      [char.isEnemy ? 'enemies' : 'allies']: updatedArray
    });

    this.addToLog(movementResult.log!);
    this.updateBattleRows();

    setTimeout(() => {
      const clearedChar = {...updatedChar, currentAction: undefined};
      const clearedArray = char.isEnemy
        ? this.state.enemies.map(c => c.id === char.id ? clearedChar : c)
        : this.state.allies.map(c => c.id === char.id ? clearedChar : c);

      this.updateState({
        ...this.state,
        [char.isEnemy ? 'enemies' : 'allies']: clearedArray
      });
    }, 700);
  }

  private checkBattleEnd(): boolean {
    const enemiesActive = this.state.enemies.some(e => e.isActive);
    const alliesActive = this.state.allies.some(a => a.isActive);

    if (!enemiesActive || !alliesActive) {
      this.stopBattle();
      if (!enemiesActive) {
        this.questManagerService.updateQuestProgress('arena', 1)
        this.addToLog('You win the battle.')
      }

      if (!alliesActive) {
        this.addToLog('You lost the battle')

      }
      return true;
    }
    return false;
  }

  private updateParticipants() {
    const participants = [
      ...this.state.allies.filter(p => p.isActive && p.currentHealth > 0),
      ...this.state.enemies.filter(p => p.isActive && p.currentHealth > 0)
    ].sort((a, b) => b.initiative - a.initiative);

    if (participants.length === 0) {
      this.stopBattle();
      return;
    }

    this.updateState({...this.state, participants});
    this.updateBattleRows();
  }

  private updateBattleRows() {
    // TODO fix bug with row color after death
    const battleRows = [1, 2, 3, 4, 5, 6].map(row => ({
      rowNumber: row,
      allies: this.state.allies.filter(a => a.currentRow === row),
      enemies: this.state.enemies.filter(e => e.currentRow === row)
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
      isActive: c.currentHealth > 0
    });

    this.updateState({
      ...this.state,
      allies: this.state.allies.map(resetCharacter),
      enemies: this.state.enemies.map(resetCharacter)
    });
  }

  private getStartPosition(className: string, isEnemy: boolean): rowPosition {
    if (isEnemy) {
      if (className.includes('Warrior')) return 4;
      if (className.includes('Rogue')) return 5;
      return 6;
    }
    if (className.includes(CharacterClass.Warrior)) return 3;
    if (className.includes(CharacterClass.Rogue)) return 2;
    return 1;
  }

  private calculateAttackRange(className: string): number {
    return className.includes('Warrior') || className.includes('Rogue') ? 1 : 3;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
