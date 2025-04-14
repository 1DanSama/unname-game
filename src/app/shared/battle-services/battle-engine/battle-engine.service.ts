import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, delay, delayWhen, EMPTY, from, Observable, Subject, throttleTime, timer} from 'rxjs';
import {BattleActionService, IPerformAutoActionResult} from '../battle-action.service';
import {QuestManagerService} from '../../quest-manager.service';
import {
  IBattleCharacter,
  RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {BattleStateService} from './battle-engine-support-services/battle-state.service';
import {BattleInitializationService} from './battle-engine-support-services/battle-initialization.service';
import {TargetSelectionService} from '../target-select-services/target-selection.service';
import {BattleLoggerService} from '../battle-logger.service';
import {concatMap, finalize, switchMap, take, takeUntil, tap} from 'rxjs/operators';
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
  private turnDelay$ = new BehaviorSubject<number>(600);
  private roundDelay$ = new BehaviorSubject<number>(1000);
  private turnDelay = 600;
  private roundDelay = 1000;

  private destroy$ = new Subject<void>();

  constructor(
    private stateService: BattleStateService,
    private initService: BattleInitializationService,
    private targetService: TargetSelectionService,
    private questManager: QuestManagerService,
    private logger: BattleLoggerService,
    private actionService: BattleActionService,
    private battleMoving: BattleCharacterMovingService,
  ) {}

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings) {

    // console.log('initializeBattle')

    this.stateService.resetState();
    const initialState = this.initService.createInitialState(recruited, enemyPower);

    console.log('initialState', initialState)

    // console.log('initialState', initialState)

    // console.log('this.createBattleRows(initialState.allies, initialState.enemies)', this.createBattleRows(initialState.allies, initialState.enemies))
    // console.log('this.getSortedParticipants(initialState.allies, initialState.enemies)', this.getSortedParticipants(initialState.allies, initialState.enemies))
    console.log('initialState.allies, initialState.enemies', initialState.allies, initialState.enemies)
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
      .filter(p => p.isActive || p?.currentHealth > 0)
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

    this.stateService.state$.pipe(
      take(1),
      takeUntil(this.destroy$),
      switchMap(state => {
        if (!state.isBattleInProgress || this.checkBattleEnd()) return EMPTY;

        return from([...state.participants]).pipe(
          concatMap(participant => {
              return this.processParticipant(participant)
            }
          ),

          concatMap(() => timer(this.roundDelay).pipe(
            takeUntil(this.destroy$),
            switchMap(() => EMPTY)
          )),
          // Handle round completion after delay
          finalize(() => {
            this.handleRoundCompletion();
            // }
          })
        );
      })
    ).subscribe();
  }

  private handleRoundCompletion() {

    this.stateService.updateState(state => ({
      ...state,
      currentRound: state.currentRound + 1
    }));

    this.logger.addLog(`--- Round ${this.stateService.currentState.currentRound + 1} Starts ---`);

    this.updateParticipants();
    this.processBattleTurns();
  }

  private processParticipant(participant: IBattleCharacter) {
    if(!participant.isEnemy) {
    }
    // console.log('processParticipant')
    return new Observable<void>(observer => {
      const currentState = this.stateService.currentState;
      // console.log('currentState', currentState)
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
    // console.log('updateParticipants')
    this.stateService.updateState(state => ({
      ...state,
      participants: this.getSortedParticipants(state.allies, state.enemies)
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
      this.logger.addLog(result.logs);
      onComplete();
    });
  }

  private updateParticipantStates(result: IPerformAutoActionResult) {
    this.stateService.updateState(state => {
      const updatedAllies = state.allies.map(a => {
        // Update the attacker
        if (a.id === result.updatedAttacker.id) {
          return { ...a, ...result.updatedAttacker };
        }

        const updatedTarget = result.updatedTargets.find(t => t.id === a.id);
        if (!updatedTarget) return a;

        return updatedTarget.currentHealth <= 0
          ? { ...updatedTarget, isActive: false }
          : { ...a, ...updatedTarget };
      });

      const updatedEnemies = state.enemies.map(e => {
        const updatedTarget = result.updatedTargets.find(t => t.id === e.id);
        if (!updatedTarget) return e;

        return updatedTarget.currentHealth <= 0
          ? { ...updatedTarget, isActive: false }
          : { ...e, ...updatedTarget };
      });

      return {
        ...state,
        allies: updatedAllies,
        enemies: updatedEnemies,
        participants: this.getSortedParticipants(updatedAllies, updatedEnemies)
      };
    });

    this.checkBattleEnd();
  }

  private handleNoTargets(attacker: IBattleCharacter) {
    const movement = attacker.movementSpeed;
    let newRow: rowPosition;

    if (attacker.isEnemy) {
      // Enemies move backward (towards lower rows)
      newRow = Math.max(1, attacker.currentRow - movement) as rowPosition;
    } else {
      // Allies move forward (towards higher rows)
      newRow = Math.min(6, attacker.currentRow + movement) as rowPosition;
      console.log('isEnemy newRow', newRow)

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
      currentAction: 'move' // Встановлюємо стан анімації
    };

    // Оновлюємо стан
    const updatedArray = char.isEnemy
      ? enemies.map(c => c.id === char.id ? updatedChar : c)
      : allies.map(c => c.id === char.id ? updatedChar : c);

    this.stateService.updateState(state => ({
      ...state,
      [char.isEnemy ? 'enemies' : 'allies']: updatedArray
    }));

    this.addToLog(movementResult.log!);
    this.updateBattleRows();

    // Скидаємо анімацію через 500мс
    // setTimeout(() => {
      const clearedChar = {...updatedChar, currentAction: undefined};
      const clearedArray = char.isEnemy
        ? enemies.map(c => c.id === char.id ? clearedChar : c)
        : allies.map(c => c.id === char.id ? clearedChar : c);

      this.stateService.updateState(state => ({
        ...state,
        [char.isEnemy ? 'enemies' : 'allies']: clearedArray
      }));
    // }, 500);
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
      // console.log('allies', allies)
      // console.log('enemies', enemies)
      // console.log('Ending battle!');
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
