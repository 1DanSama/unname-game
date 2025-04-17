import {Injectable, OnDestroy} from '@angular/core';
import {
  BehaviorSubject, concatWith,
  EMPTY,
  from,
  ignoreElements,
  Observable,
  Subject,
  timer
} from 'rxjs';
import {BattleActionService, IPerformAutoActionResult} from '../battle-action.service';
import {QuestManagerService} from '../../quest-manager.service';
import {
  IBattleCharacter,
  RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {BattleStateService} from './battle-engine-support-services/battle-state.service';
import {BattleInitializationService} from './battle-engine-support-services/battle-initialization.service';
import {TargetSelectionService} from '../target-select-services/target-selection.service';
import {concatMap, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {IEnemyPowerSettings} from '../../../battle-field/dattle-field.model';
import {CharacterClass} from '../../../store/recruted-adventures/recruted-abventures.model';
import {BattleCharacterMovingService} from '../battle-character-moving.service';

export interface BattleState {
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
  participants: IBattleCharacter[];
  battleRows: BattleRow[];
  battleLog: string[];
  isBattleInProgress: boolean;
  currentRound: number;
  currentTurnIndex: number;
  damageNumbers: { id: string; value: number; x: number; y: number }[];
  healNumbers: { id: string; value: number; x: number; y: number }[];
}

interface BattleRow {
  rowNumber: number;
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
}

@Injectable({ providedIn: 'root' })
export class BattleEngineService implements OnDestroy {
  private turnDelay$ = new BehaviorSubject<number>(3000);
  private roundDelay$ = new BehaviorSubject<number>(5000);

  private destroy$ = new Subject<void>();

  constructor(
    private stateService: BattleStateService,
    private initService: BattleInitializationService,
    private targetService: TargetSelectionService,
    private questManager: QuestManagerService,
    private actionService: BattleActionService,
    private battleMoving: BattleCharacterMovingService,
  ) {}

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings) {
    this.stateService.resetState();
    const initialState = this.initService.createInitialState(recruited, enemyPower);

    this.stateService.updateState(() => ({
      ...initialState,
      battleRows: this.createBattleRows(initialState.allies, initialState.enemies),
      participants: this.getSortedParticipants(initialState.allies, initialState.enemies)
    }));

    this.startBattle();
  }

  private createBattleRows(allies: IBattleCharacter[], enemies: IBattleCharacter[]): BattleRow[] {
    return [1,2,3,4,5,6].map(row => ({
      rowNumber: row,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));
  }

  private getSortedParticipants(allies: IBattleCharacter[], enemies: IBattleCharacter[]): IBattleCharacter[] {
    return [...allies, ...enemies]
      .filter(p => p?.currentHealth > 0)
      .sort((a, b) => b.initiative - a.initiative);
  }

  startBattle() {
    this.stateService.updateState(state => ({
      ...state,
      isBattleInProgress: true,
      currentRound: 1
    }));
    this.processBattleTurns();
  }

  private processBattleTurns() {
    if (!this.stateService.currentState.isBattleInProgress) return;

    this.stateService.state$
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        switchMap(state => {
          if (!state.isBattleInProgress || this.checkBattleEnd()) {
            return EMPTY;
          }

          return from(state.participants).pipe(
            concatMap(participant =>
              this.processParticipant(participant).pipe(
                concatWith(timer(this.turnDelay$.value))
              )
            ),
            ignoreElements(),
            concatWith(timer(this.roundDelay$.value)),
            tap(() => this.handleRoundCompletion())
          );
        })
      )
      .subscribe();
  }

  private handleRoundCompletion() {
    if (!this.stateService.currentState.isBattleInProgress) return

    this.stateService.updateState(state => ({
      ...state,
      currentRound: state.currentRound + 1
    }));

    this.addToLog(`--- Round ${this.stateService.currentState.currentRound + 1} Starts ---`);

    this.updateParticipants();
    this.processBattleTurns();
  }

  private processParticipant(participant: IBattleCharacter) {
    if(!participant.isEnemy) {
    }
    return new Observable<void>(observer => {
      const currentState = this.stateService.currentState;
      const isAlive = currentState.participants.some(p =>
        p.id === participant.id && p.currentHealth > 0
      );

      if (!isAlive || !currentState.isBattleInProgress) {
        observer.complete();
        return;
      }

      this.executeParticipantAction(participant, () => {
        observer.next();
        observer.complete();
      });
    });
  }

  private updateParticipants() {
    this.stateService.updateState(state => ({
      ...state,
      participants: this.getSortedParticipants(state.allies, state.enemies),
      allies: state.allies,
      enemies: state.enemies
    }));
  }

  private executeParticipantAction(participant: IBattleCharacter, onComplete: () => void) {
    const { allies, enemies } = this.stateService.currentState;

    const validTargets = this.targetService.getValidTargets(participant, allies, enemies);

    if (validTargets.length === 0) {
      this.handleNoTargets(participant);
      onComplete();
      return;
    }

    this.actionService.performAutoAction(participant, validTargets, result => {
      this.updateParticipantStates(result);
      this.addToLog(result.logs);
      onComplete();
    });
  }

  private updateParticipantStates(result: IPerformAutoActionResult) {
    this.stateService.updateState(state => {
      const updatedAllies = [...state.allies.map(a => {
        const updated = result.updatedTargets.find(t => t.id === a.id);
        return updated ? {
          ...a,
          ...updated,
          hasUpdatedActionStatus: true,
          activeActionStatus: {...updated.activeActionStatus}
        } : a;
      })];

      const updatedEnemies = [...state.enemies.map(e => {
        const updated = result.updatedTargets.find(t => t.id === e.id);
        return updated ? {
          ...e,
          ...updated,
          hasUpdatedActionStatus: true,
          activeActionStatus: {...updated.activeActionStatus}
        } : e;
      })];

      return {
        ...state,
        allies: updatedAllies,
        enemies: updatedEnemies,
        participants: this.getSortedParticipants(updatedAllies, updatedEnemies)
      };
    });


    this.checkBattleEnd();
    this.updateBattleRows();
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
    const { allies, enemies } = this.stateService.currentState;
    const otherAllies = allies.filter(a =>
      a.id !== char.id &&
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
      currentAction: 'move',
      activeActionStatus: { ...char.activeActionStatus } // Copy existing statuses
    };

    const updatedArray = char.isEnemy
      ? enemies.map(c => c.id === char.id ? updatedChar : {...c})
      : allies.map(c => c.id === char.id ? updatedChar : {...c});

    this.stateService.updateState(state => ({
      ...state,
      [char.isEnemy ? 'enemies' : 'allies']: updatedArray
    }));

    this.addToLog(movementResult.log!);
    this.updateBattleRows();
  }

  private updateBattleRows() {
    const { allies, enemies } = this.stateService.currentState;

    const battleRows = [1, 2, 3, 4, 5, 6].map(row => ({
      rowNumber: row,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));

    this.stateService.updateState(state => ({
      ...state,
      battleRows
    }));
  }

  private addToLog(messages: string | string[]) {
    const newMessages = Array.isArray(messages) ? messages : [messages];

    this.stateService.updateState(state => ({
      ...state,
      battleLog: [...newMessages, ...state.battleLog]
    }));
  }

  private checkBattleEnd(): boolean {
    const { allies, enemies } = this.stateService.currentState;
    const alliesAlive = allies.some(a => a.currentHealth > 0);
    const enemiesAlive = enemies.some(e => e.currentHealth > 0);

    if (!alliesAlive || !enemiesAlive) {
      if (!enemiesAlive) {
        this.addToLog('You win the battle.');
        this.questManager.updateQuestProgress('arena', 1);
      }

      if (!alliesAlive) {
        this.addToLog('You lost the battle');
      }

      this.endBattle();
      this.destroy$.next();
      this.destroy$.complete();
      return true;
    }
    return false;
  }

  private endBattle() {
    this.stateService.updateState(state => ({
      ...state,
      isBattleInProgress: false
    }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  stopBattle() {
    console.log('stopBattle')
    // todo realize pause
    this.stateService.updateState(state => ({
      ...state,
      isBattleInProgress: false,
      participants: [],
      battleRows: [],
      damageNumbers: [],
      healNumbers: []
    }));
  }
}
