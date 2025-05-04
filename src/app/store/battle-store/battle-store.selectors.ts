import {createFeatureSelector, createSelector} from '@ngrx/store';
import {battleStoreFeatureKey, IBattleStoreState} from './battle-store.reducer';

export const selectBattleStoreState = createFeatureSelector<IBattleStoreState>(battleStoreFeatureKey);

export const selectBattleState = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => {
    return state.battleState
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

export const selectAllFromBattleStore = createSelector(
  selectBattleStoreState,
  (state: IBattleStoreState) => {
    return state
  }
);
