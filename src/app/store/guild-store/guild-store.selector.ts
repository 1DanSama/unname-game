import { createSelector } from '@ngrx/store';
import {IGuildStoreState,} from './guild-store.reducer';

export const selectRecruitedAdventuresState = (state: any) => state.guildStorState;

export const getGoldCount = createSelector(
  selectRecruitedAdventuresState,
  (state:IGuildStoreState) => state.gold
);

export const getMaterialsCount = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.materials
);

export const selectEquipment = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.equipment
);
