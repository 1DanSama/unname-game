import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ICharacter, RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {IRecruitedAdventuresState} from './recruited-adventures.reducer';


export const RecruitedAdventuresActions = createActionGroup({
  source: 'RecruitedAdventures/API',
  events: {
    'Hard Set From User Load': props<{loadedState: IRecruitedAdventuresState}>(),

    'Add RecruitedAdventures': props<{ temporaryRecruitedAdventures: ICharacter }>(),
    'Add HiredAdventures': props<{ hiredAdventure: RecruitedAdventures }>(),
    'Update RecruitedAdventures': props<{ updatedAdventures: RecruitedAdventures }>(),
    'Delete RecruitedAdventures': props<{ id: string }>(),
    'Can Refresh Adventures': props<{ canRefreshAdventures: boolean }>(),
    'Clear RecruitedAdventuress': emptyProps(),
  }
});
