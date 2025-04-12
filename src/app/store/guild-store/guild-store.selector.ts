import { createSelector } from '@ngrx/store';
import {IGuildStoreState,} from './guild-store.reducer';

export const selectGuildStorState = (state: any) => state.guildStorState;

export const getGoldCount = createSelector(
  selectGuildStorState,
  (state:IGuildStoreState) => state.gold
);

export const getMaterialsCount = createSelector(
  selectGuildStorState,
  (state: IGuildStoreState) => state.store.materials
);

export const selectEquipment = createSelector(
  selectGuildStorState,
  (state: IGuildStoreState) => state.store.equipment
);

export const selectPlacesInBarrack = createSelector(
  selectGuildStorState,
  (state: IGuildStoreState) => state.baraks.placesInBarrack
);

export const selectOccupiedSeats = createSelector(
  selectGuildStorState,
  (state: IGuildStoreState) => state.baraks.occupiedSeats
);

export const selectAllFromGuildStor = createSelector(
  selectGuildStorState,
  (state: IGuildStoreState) => state
);
