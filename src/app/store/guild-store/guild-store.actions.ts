import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ICharacter, RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {ItemForEquip} from './models/item.model';


export const GuildStoreActions = createActionGroup({
  source: 'GuildStore/API',
  events: {
    'Increase Gold': props<{ gold: number }>(),
    'Decrease Gold': props<{ gold: number }>(),
    'Add materials': props<{ materialName: string, amount: number }>(),
    'Remove materials': props<{ materialName: string, amount: number }>(),
    'Set equipment to store': props<{ equipment: ItemForEquip }>(),
    'Remove equipment to store': props<{ slot: string, itemId: string  }>(),
    'Occupied places in barrack': props<{ place: number }>(),
  }
});
