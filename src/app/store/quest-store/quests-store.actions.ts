import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { QuestsStore } from './quests-store.model';
import {IBaseQuest, TQuestsStatus} from '../../locations/city/city-locations/guild/task-board/models/quest-interface';

export const QuestsStoreActions = createActionGroup({
  source: 'QuestsStore/API',
  events: {
    'Add to QuestsStore': props<{ quest: IBaseQuest }>(),
    'Drop quest from QuestsStore': props<{ questId: string }>(),
    'Update quest status in QuestsStores': props<{ questId: string, status:TQuestsStatus, count: number }>(),
    'Successful Quest Complete': props<{ questId: string,  }>(),
    'Failure Quest Complete': props<{ questId: string,  }>(),
    'Clear QuestsStores': emptyProps(),
  }
});
