import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {IBaseQuest, TQuestsStatus} from '../../locations/city/city-locations/guild/task-board/models/quest-interface';
import {IQuestsStoresState} from './quests-store.reducer';

export const QuestsStoreActions = createActionGroup({
  source: 'QuestsStore/API',
  events: {
    'Hard Set From User Load': props<{loadedState: IQuestsStoresState}>(),

    'Add to QuestsStore': props<{ quest: IBaseQuest }>(),
    'Drop quest from QuestsStore': props<{ questId: string }>(),
    'Update quest status in QuestsStores': props<{ questId: string, status:TQuestsStatus, count: number }>(),
    'Successful Quest Complete': props<{ questId: string,  }>(),
    'Failure Quest Complete': props<{ questId: string,  }>(),
    'Clear QuestsStores': emptyProps(),
  }
});
