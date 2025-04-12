import {createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {RecruitedAdventuresActions} from './recruited-adventures.actions';
import {
  RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {QuestsStoreActions} from '../quest-store/quests-store.actions';

export interface IRecruitedAdventuresState extends EntityState<RecruitedAdventures> {
  temporaryRecruitedAdventures: RecruitedAdventures[];
  recruitedAdventures: RecruitedAdventures[];
  latestId: number;
  canRefreshAdventures: boolean;
}

export const adapter: EntityAdapter<RecruitedAdventures> = createEntityAdapter<RecruitedAdventures>();

export const initialState: IRecruitedAdventuresState = adapter.getInitialState({
  temporaryRecruitedAdventures: [],
  recruitedAdventures: [],
  latestId: 0,
  canRefreshAdventures: true,
});

export const reducer = createReducer(
  initialState,
  on(RecruitedAdventuresActions.addRecruitedAdventures,
    (state, {temporaryRecruitedAdventures}) => {
      const newId = state.latestId + 1;
      const newTemporaryRecruitedAdventure: RecruitedAdventures = {
        ...temporaryRecruitedAdventures,
        id: newId,
      };
      return {
        ...state,
        temporaryRecruitedAdventures: [...state.temporaryRecruitedAdventures, newTemporaryRecruitedAdventure],
        latestId: newId,
      };
    }
  ),
  on(RecruitedAdventuresActions.addHiredAdventures,
    (state, {hiredAdventure}) => {
      const newRecruitedAdventures = {
        ...hiredAdventure,
        isTemporary: false
      }
      return {
        ...state,
        recruitedAdventures: [...state.recruitedAdventures, newRecruitedAdventures],
        temporaryRecruitedAdventures: state.temporaryRecruitedAdventures.filter((el) => {
          if ( el.id !== newRecruitedAdventures.id) {
            return el
          }
          return null
        }),
      };
    }
  ),
  on(RecruitedAdventuresActions.updateRecruitedAdventures,
    (state, {updatedAdventures}) => {
      return {
        ...state,
        recruitedAdventures: state.recruitedAdventures.map((advanture) => {
          if (advanture?.id === updatedAdventures?.id) {
            return updatedAdventures
          } else {
            return advanture
          }
        })
      }
    }
  ),
  on(RecruitedAdventuresActions.canRefreshAdventures,
    (state, {canRefreshAdventures}) => {
      return {
        ...state,
        canRefreshAdventures: canRefreshAdventures
      };
    }
  ),
  on(RecruitedAdventuresActions.hardSetFromUserLoad, (state, {loadedState}) => loadedState),
);


export const recruitedAdventuresReducer = reducer;
