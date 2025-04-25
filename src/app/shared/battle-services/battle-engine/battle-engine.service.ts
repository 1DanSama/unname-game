import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {BattleActionService, IPerformAutoActionResult} from '../battle-action.service';
import {QuestManagerService} from '../../quest-manager.service';
import { IBattleCharacter } from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {BattleState, BattleStateService} from './battle-engine-support-services/battle-state.service';
import {TargetSelectionService} from '../target-select-services/target-selection.service';
import {MovementHandlerService} from './battle-engine-support-services/movement-handler.service';
import {LogService} from './battle-engine-support-services/log.service';

@Injectable({providedIn: 'root'})
export class BattleEngineService implements OnDestroy {
  private turnDelay = 2000;
  private roundDelay = 4000;

  private destroy$ = new Subject<void>();

  constructor(
    private stateService: BattleStateService,
    private targetService: TargetSelectionService,
    private questManager: QuestManagerService,
    private actionService: BattleActionService,
    private movementHandler: MovementHandlerService,
    private logService: LogService,
  ) {}

  public getSortedParticipants(allies: IBattleCharacter[], enemies: IBattleCharacter[]): IBattleCharacter[] {
    return [...allies, ...enemies]
      .filter(p => p?.currentHealth > 0)
      .sort((a, b) => b.initiative - a.initiative);
  }

  public processBattleTurns(index = 0) {
    if (index >= this.stateService.currentState.participants.length) {
      this.handleRoundCompletion();
      return;
    }

    setTimeout(() => {
      const curentState = this.stateService.currentState
      this.executeParticipantAction(curentState.participants[index], curentState);
      this.processBattleTurns(index + 1);
    }, this.turnDelay);
  }

  private handleRoundCompletion() {
    if (!this.stateService.currentState.isBattleInProgress) {
      this.checkBattleEnd();
      return
    }

    const currentRound = this.stateService.currentState.currentRound + 1
    this.stateService.updateStateByKey([{key:'currentRound', value: currentRound}])

    this.logService.addToLog(`--- Round ${currentRound} Starts ---`);

    this.processBattleTurns();
  }

  private updateParticipants(updatedAllies: IBattleCharacter[], updatedEnemies: IBattleCharacter[]) {
    this.stateService.updateStateByKey([{key:'participants', value: this.getSortedParticipants(updatedAllies, updatedEnemies)}])
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
    const updatedAllies = this.stateService.currentState.allies.map(a => {
      const updated = result.updatedTargets.find(t => t.id === a.id);
      return updated ? {
        ...a,
        ...updated,
        hasUpdatedActionStatus: true,
        activeActionStatus: {...updated.activeActionStatus}
      } : a;
    });

    const updatedEnemies = this.stateService.currentState.enemies.map(e => {
      const updated = result.updatedTargets.find(t => t.id === e.id);
      return updated ? {
        ...e,
        ...updated,
        hasUpdatedActionStatus: true,
        activeActionStatus: {...updated.activeActionStatus}
      } : e;
    });


    this.stateService.updateStateByKey([{key:'enemies', value: updatedEnemies}, {key:'allies', value: updatedAllies}])

    this.updateParticipants(updatedAllies, updatedEnemies)

    this.checkBattleEnd();
    this.movementHandler.updateBattleRows();
  }

  private checkBattleEnd(): boolean {
    const {allies, enemies} = this.stateService.currentState;
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

      this.stateService.endBattle();
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
