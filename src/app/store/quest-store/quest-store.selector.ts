import {createSelector} from '@ngrx/store';
import {IQuestsStoresState} from './quests-store.reducer';

export const selectActiveQuestsState = (state: any) => state.questStorState;

export const getAllActiveQuests = createSelector(
  selectActiveQuestsState,
  (state:IQuestsStoresState) => state.activeQuests
);
