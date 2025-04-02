import {createFeatureSelector, createSelector} from '@ngrx/store';
import {battleStoreFeatureKey, IBattleStoreState} from './battle-store.reducer';

// export const selectBattleStoreState = (state: any) => state.battleStoreState;

export const selectBattleStoreState = createFeatureSelector<IBattleStoreState>(battleStoreFeatureKey);


export const selectBattleState = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => {

    return state.battleState ?? {
      isBattleInProgress: false,
      allies: [],
      enemies: [],
      participants: [],
      battleRows: [],
      battleLog: [],
      currentRound: 0,
      currentTurnIndex: -1,
      damageNumbers: [],
      healNumbers: []
    }
  }
);


export const selectIsBattleActive = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => state.isBattleActive
);

export const selectBattleStateBackground = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => {
    return state.backgroundImg
  }
);

export const selectBattleEnemyType = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => {
    return state.enemyType
  }
);
