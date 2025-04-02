import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ICharacter, RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';


export const RecruitedAdventuresActions = createActionGroup({
  source: 'RecruitedAdventures/API',
  events: {
    'Add RecruitedAdventures': props<{ temporaryRecruitedAdventures: ICharacter }>(),
    'Add HiredAdventures': props<{ hiredAdventure: RecruitedAdventures }>(),
    'Update RecruitedAdventures': props<{ updatedAdventures: RecruitedAdventures }>(),
    'Delete RecruitedAdventures': props<{ id: string }>(),
    'Can Refresh Adventures': props<{ canRefreshAdventures: boolean }>(),
    'Clear RecruitedAdventuress': emptyProps(),
  }
});
