import { Injectable } from '@angular/core';
import {
  BattleRow,
  IBattleCharacter,
  RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {IEnemyPowerSettings} from '../../../battle-field/dattle-field.model';
import {BattleStateService} from './battle-engine-support-services/battle-state.service';
import {BattleInitializationService} from './battle-engine-support-services/battle-initialization.service';
import {BattleEngineService} from './battle-engine.service';

@Injectable({
  providedIn: 'root'
})
export class FasadEngineService {
  constructor(
    private stateService: BattleStateService,
    private initService: BattleInitializationService,
    private battleEngine: BattleEngineService,
  ) { }

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings) {
    this.stateService.resetState();
    const initialState = this.initService.createInitialState(recruited, enemyPower);
    this.stateService.updateStateByKey([
      {key: 'allies', value: initialState.allies},
      {key: 'enemies', value: initialState.enemies},
      {key: 'battleRows', value: this.createBattleRows(initialState.allies, initialState.enemies)},
      {key: 'participants', value: this.battleEngine.getSortedParticipants(initialState.allies, initialState.enemies)}
    ])

    this.startBattle();
  }

  startBattle() {
    this.stateService.updateStateByKey([{key:'isBattleInProgress', value: true}])
    this.battleEngine.processBattleTurns(0)
  }

  private createBattleRows(allies: IBattleCharacter[], enemies: IBattleCharacter[]): BattleRow[] {
    return [1,2,3,4,5,6].map(row => ({
      row: row as rowPosition,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));
  }

  stopBattle() {
    // todo realize pause
    this.stateService.resetState()
  }
}
