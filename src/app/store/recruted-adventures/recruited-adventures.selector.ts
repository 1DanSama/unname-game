import { createSelector } from '@ngrx/store';
import { IRecruitedAdventuresState } from './recruited-adventures.reducer';

export const selectRecruitedAdventuresState = (state: any) => state.adventuresesState;

export const selectTemporaryRecruited = createSelector(
  selectRecruitedAdventuresState,
  (state:IRecruitedAdventuresState) => {
    return state?.temporaryRecruitedAdventures
  }
);

export const selectRecruited = createSelector(
  selectRecruitedAdventuresState,
  (state:IRecruitedAdventuresState) => state?.recruitedAdventures
);

export const selecCanRefreshAdventures = createSelector(
  selectRecruitedAdventuresState,
  (state:IRecruitedAdventuresState) => state?.canRefreshAdventures
);
