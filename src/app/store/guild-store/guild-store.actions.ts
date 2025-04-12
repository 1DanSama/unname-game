import { createActionGroup, props } from '@ngrx/store';
import {ItemForEquip} from './models/item.model';
import {IGuildStoreState} from './guild-store.reducer';


export const GuildStoreActions = createActionGroup({
  source: 'GuildStore/API',
  events: {
    'Hard Set From User Load': props<{loadedState: IGuildStoreState}>(),
    'Increase Gold': props<{ gold: number }>(),
    'Decrease Gold': props<{ gold: number }>(),
    'Add materials': props<{ materialName: string, amount: number }>(),
    'Remove materials': props<{ materialName: string, amount: number }>(),
    'Set equipment to store': props<{ equipment: ItemForEquip }>(),
    'Remove equipment to store': props<{ slot: string, itemId: string  }>(),
    'Occupied places in barrack': props<{ place: number }>(),
  }
});
