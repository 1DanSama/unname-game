import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {EEnemyTypes, TEnemyPowerSettings} from '../../battle-field/dattle-field.model';
import {BattleState, IBattleStoreState} from './battle-store.reducer';
import {
  IActiveActionStatus
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';


export const BattleStoreActions = createActionGroup({
  source: 'BattleStore',
  events: {
    'Hard Set From User Load': props<{loadedState: IBattleStoreState}>(),
    'Initialize battle': props<{ state: BattleState }>(),
    'Start battle':  props<{ backgroundImg: string, enemyType: EEnemyTypes }>(),
    'Update battle state': props<{ state: IBattleStoreState }>(),
    'Update battle state data': props<{ updates: Partial<BattleState> }>(),
    'Update Character Effect State': props<{id: number, effectProperty: Partial<IActiveActionStatus>, isEnemy: boolean}>(),
    'End battle': emptyProps(),
  }
});
