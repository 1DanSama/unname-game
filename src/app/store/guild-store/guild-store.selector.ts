import { createSelector } from '@ngrx/store';
import {IGuildStoreState,} from './guild-store.reducer';

export const selectRecruitedAdventuresState = (state: any) => state.guildStorState;

export const getGoldCount = createSelector(
  selectRecruitedAdventuresState,
  (state:IGuildStoreState) => state.gold
);

export const getMaterialsCount = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.store.materials
);

export const selectEquipment = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.store.equipment
);

export const selectPlacesInBarrack = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.baraks.placesInBarrack
);

export const selectOccupiedSeats = createSelector(
  selectRecruitedAdventuresState,
  (state: IGuildStoreState) => state.baraks.occupiedSeats
);
