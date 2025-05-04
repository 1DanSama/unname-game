import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {BattleActionService, IPerformAutoActionResult} from '../battle-action.service';
import {QuestManagerService} from '../../quest-manager.service';
import { IBattleCharacter } from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {TargetSelectionService} from '../target-select-services/target-selection.service';
import {MovementHandlerService} from './battle-engine-support-services/movement-handler.service';
import {LogService} from './battle-engine-support-services/log.service';
import {Store} from '@ngrx/store';
import {selectBattleState} from '../../../store/battle-store/battle-store.selectors';
import {BattleState, defaulsBattleState} from '../../../store/battle-store/battle-store.reducer';
import {takeUntil, tap} from 'rxjs/operators';
import {BattleStoreActions} from '../../../store/battle-store/battle-store.actions';

@Injectable({providedIn: 'root'})
export class BattleEngineService implements OnDestroy {
  private turnDelay = 2000;
  private roundDelay = 4000;
  private battleStateStoreSubject= new BehaviorSubject(defaulsBattleState);

  private destroy$ = new Subject<void>();

  constructor(
    private battleStateStore: Store,
    private targetService: TargetSelectionService,
    private questManager: QuestManagerService,
    private actionService: BattleActionService,
    private movementHandler: MovementHandlerService,
    private logService: LogService,
  ) {
    this.battleStateStore.select(selectBattleState).pipe(
      tap(state => this.battleStateStoreSubject.next(state)),
      takeUntil(this.destroy$)
    ).subscribe()
  }


  public getSortedParticipants(allies: IBattleCharacter[], enemies: IBattleCharacter[]): IBattleCharacter[] {
    return [...allies, ...enemies]
      .filter(p => p?.currentHealth > 0)
      .sort((a, b) => b.initiative - a.initiative);
  }

  public processBattleTurns(index = 0) {
    if (index >= this.battleStateStoreSubject.value.participants.length) {
      this.handleRoundCompletion();
      return;
    }

    setTimeout(() => {
      const curentState = this.battleStateStoreSubject.value
      this.executeParticipantAction(curentState.participants[index], curentState);
      this.processBattleTurns(index + 1);
    }, this.turnDelay);
  }

  private handleRoundCompletion() {
     if(this.checkBattleEnd()) {
       return
     }

    const currentRound = this.battleStateStoreSubject.value.currentRound + 1
    this.battleStateStore.dispatch(BattleStoreActions.updateBattleStateData({updates: {currentRound}}))
    // this.stateService.updateStateByKey([{key:'currentRound', value: currentRound}])

    this.logService.addToLog(`--- Round ${currentRound} Starts ---`);

    this.processBattleTurns();
  }

  private updateParticipants(updatedAllies: IBattleCharacter[], updatedEnemies: IBattleCharacter[]) {
    this.battleStateStore.dispatch(BattleStoreActions.updateBattleStateData({updates: {participants: this.getSortedParticipants(updatedAllies, updatedEnemies)}}))

    // this.stateService.updateStateByKey([{key:'participants', value: this.getSortedParticipants(updatedAllies, updatedEnemies)}])
  }

  private executeParticipantAction(participant: IBattleCharacter, currentState: BattleState) {
    if (participant && participant.currentHealth >= 1) {
      const {allies, enemies} = currentState;

      const validTargets = this.targetService.getValidTargets(participant, allies, enemies);

      if (validTargets.length === 0) {
        this.movementHandler.handleNoTargets(participant);
      } else {
        const result = this.actionService.performAutoAction(participant, validTargets);
        this.updateParticipantStates(result);
        this.logService.addToLog(result.logs);
      }
    }
  }

  private updateParticipantStates(result: IPerformAutoActionResult) {
    const updatedAllies = this.battleStateStoreSubject.value.allies.map(a => {
      const updated = result.updatedTargets.find(t => t.id === a.id);
      return updated ? {
        ...a,
        ...updated,
        hasUpdatedActionStatus: true,
        activeActionStatus: {...updated.activeActionStatus}
      } : a;
    });

    const updatedEnemies = this.battleStateStoreSubject.value.enemies.map(e => {
      const updated = result.updatedTargets.find(t => t.id === e.id);
      return updated ? {
        ...e,
        ...updated,
        hasUpdatedActionStatus: true,
        activeActionStatus: {...updated.activeActionStatus}
      } : e;
    });

    this.battleStateStore.dispatch(BattleStoreActions.updateBattleStateData({updates: {enemies: updatedEnemies, allies: updatedAllies}}))

    this.updateParticipants(updatedAllies, updatedEnemies)

    this.checkBattleEnd();
    this.movementHandler.updateBattleRows();
  }

  private checkBattleEnd(): boolean {
    const {allies, enemies} = this.battleStateStoreSubject.value;
    const alliesAlive = allies.some(a => a.currentHealth > 0);
    const enemiesAlive = enemies.some(e => e.currentHealth > 0);

    if (!alliesAlive || !enemiesAlive) {
      if (!enemiesAlive) {
        this.logService.addToLog('You win the battle.');
        this.questManager.updateQuestProgress('arena', 1);
      }

      if (!alliesAlive) {
        this.logService.addToLog('You lost the battle');
      }

      this.battleStateStore.dispatch(BattleStoreActions.endBattle())
      this.destroy$.next();
      this.destroy$.complete();

      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
