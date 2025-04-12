import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {BattleState} from '../../shared/battle-services/battle-engine/battle-engine.service';
import {EEnemyTypes, TEnemyPowerSettings} from '../../battle-field/dattle-field.model';
import {IBattleStoreState} from './battle-store.reducer';

export const BattleStoreActions = createActionGroup({
  source: 'BattleStore',
  events: {
    'Hard Set From User Load': props<{loadedState: IBattleStoreState}>(),
    'Initialize battle': props<{ state: BattleState }>(),
    'Start battle':  props<{ backgroundImg: string, enemyType: EEnemyTypes }>(),
    'Update battle state': props<{ state: BattleState }>(),
    'End battle': emptyProps()
  }
});
