import {Injectable, OnDestroy} from '@angular/core';
import {
  BattleRow,
  IBattleCharacter,
  RecruitedAdventures, rowPosition
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {EEnemyTypes, IEnemyPowerSettings} from '../../../battle-field/dattle-field.model';
import {BattleInitializationService} from './battle-engine-support-services/battle-initialization.service';
import {BattleEngineService} from './battle-engine.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {defaulsBattleState} from '../../../store/battle-store/battle-store.reducer';
import {Store} from '@ngrx/store';
import {selectBattleState} from '../../../store/battle-store/battle-store.selectors';
import {takeUntil, tap} from 'rxjs/operators';
import {BattleStoreActions} from '../../../store/battle-store/battle-store.actions';

@Injectable({
  providedIn: 'root'
})
export class FasadEngineService implements OnDestroy{
  private battleStateStoreSubject= new BehaviorSubject(defaulsBattleState);

  private destroy$ = new Subject<void>();

  constructor(
    private battleStateStore: Store,
    private initService: BattleInitializationService,
    private battleEngine: BattleEngineService,
  ) {
    this.battleStateStore.select(selectBattleState).pipe(
    tap(state => this.battleStateStoreSubject.next(state)),
    takeUntil(this.destroy$)
  ).subscribe()
  }

  initializeBattle(recruited: RecruitedAdventures[], enemyPower: IEnemyPowerSettings, backgroundImg: string, enemyType: EEnemyTypes) {
    this.battleStateStore.dispatch(BattleStoreActions.endBattle())
    const initialState = this.initService.createInitialState(recruited, enemyPower);
    this.battleStateStore.dispatch(BattleStoreActions.updateBattleStateData(
      { updates:
          {
            enemies: initialState.enemies,
            allies: initialState.allies,
            battleRows: this.createBattleRows(initialState.allies, initialState.enemies),
            participants: this.battleEngine.getSortedParticipants(initialState.allies, initialState.enemies)
          }
      })
    )

    this.startBattle(backgroundImg, enemyType);
  }

  startBattle(backgroundImg: string, enemyType: EEnemyTypes) {
    this.battleStateStore.dispatch(BattleStoreActions.startBattle({backgroundImg, enemyType}))
    //
    // this.stateService.updateStateByKey([{key:'isBattleInProgress', value: true}])
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
    this.battleStateStore.dispatch(BattleStoreActions.endBattle())
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
