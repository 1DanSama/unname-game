import { createReducer, on } from '@ngrx/store';
import {BattleStoreActions} from './battle-store.actions';
import {EEnemyTypes} from '../../battle-field/dattle-field.model';
import {
  BattleRow,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

export interface BattleState {
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
  participants: IBattleCharacter[];
  battleRows: BattleRow[];
  battleLog: string[];
  currentRound: number;
  currentTurnIndex: number;
  damageNumbers: { id: string; value: number; x: number; y: number }[];
  healNumbers: { id: string; value: number; x: number; y: number }[];
}

export const defaulsBattleState: BattleState = {
  allies: [],
  enemies: [],
  participants: [],
  battleRows: [],
  battleLog: [],
  currentRound: 1,
  currentTurnIndex: 0,
  damageNumbers: [],
  healNumbers: []
}

export const battleStoreFeatureKey = 'battleStore';

export interface IBattleStoreState {
  battleState: BattleState;
  isBattleActive: boolean;
  backgroundImg: string;
  enemyType: EEnemyTypes | null;
}

export const initialState: IBattleStoreState = {
  battleState: defaulsBattleState,
  isBattleActive: false,
  backgroundImg: '',
  enemyType: null
};

export const reducer = createReducer(
  initialState,
  on(BattleStoreActions.initializeBattle, (state,  { state: battleState }) => ({
    ...state,
    battleState,
  })),
  on(BattleStoreActions.startBattle, (state, {backgroundImg, enemyType}) => {
    console.log('start')
    return {
      ...state,
      isBattleActive: true,
      backgroundImg,
      enemyType
    }
  }),
  // on(BattleStoreActions.updateBattleState, (state, { state: battleState }) => ({
  //   ...state,
  // })),
  on(BattleStoreActions.updateBattleStateData, (state, { updates }) => ({
    ...state,
    battleState: {
      ...state.battleState,
      ...updates
    }
  })),
  on(BattleStoreActions.updateCharacterEffectState, (state, {id, effectProperty, isEnemy}) => {
    console.log('id', id, 'effectProperty', effectProperty, 'isEnemy', isEnemy)
    return {
      ...state,
      battleState: {
        ...state.battleState,
      }
    }
  }),
  on(BattleStoreActions.hardSetFromUserLoad, (state, {loadedState}) => loadedState),
  on(BattleStoreActions.endBattle, () => initialState),
);

export const battleStoreReducer = reducer;

