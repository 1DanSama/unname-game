import { createReducer, on } from '@ngrx/store';
import {BattleStoreActions} from './battle-store.actions';
import {BattleState} from '../../shared/battle-services/battle-engine/battle-engine.service';
import {EEnemyTypes, TEnemyPowerSettings} from '../../battle-field/dattle-field.model';


export const battleStoreFeatureKey = 'battleStore';

export interface IBattleStoreState {
  battleState: BattleState | null;
  isBattleActive: boolean;
  backgroundImg: string;
  enemyType: EEnemyTypes | null;
}

export const initialState: IBattleStoreState = {
  battleState: null,
  isBattleActive: false,
  backgroundImg: '',
  enemyType: null
};

export const reducer = createReducer(
  initialState,
  on(BattleStoreActions.initializeBattle, (state,  { state: battleState }) => ({
    ...state,
    battleState,
    isBattleActive: true
  })),
  on(BattleStoreActions.startBattle, (state, {backgroundImg, enemyType}) => ({
    ...state,
    isBattleActive: true,
    backgroundImg,
    enemyType
  })),
  on(BattleStoreActions.updateBattleState, (state, { state: battleState }) => ({
    ...state,
    battleState
  })),
  on(BattleStoreActions.endBattle, () => initialState)
);

export const battleStoreReducer = reducer;

