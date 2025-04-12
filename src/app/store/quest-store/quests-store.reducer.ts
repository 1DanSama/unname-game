import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { QuestsStoreActions } from './quests-store.actions';
import { IBaseQuest } from '../../locations/city/city-locations/guild/task-board/models/quest-interface';
import {GuildStoreActions} from '../guild-store/guild-store.actions';


export interface IQuestsStoresState {
  activeQuests: IBaseQuest[]
}

export const adapter: EntityAdapter<IQuestsStoresState> = createEntityAdapter<IQuestsStoresState>();

export const initialState: IQuestsStoresState = adapter.getInitialState({
  activeQuests: []
});
export const questsStoresFeatureKey = 'questsStores';


export const reducer = createReducer(
  initialState,
  on(QuestsStoreActions.addToQuestsStore, (state, { quest }) =>({
    ...state,
    activeQuests: [...state.activeQuests, quest]
  })),
  on(QuestsStoreActions.dropQuestFromQuestsStore, (state, { questId }) =>{
    const filtredQuestions = state.activeQuests?.filter((quest: IBaseQuest) => quest?.id !== questId)
    return{
      ...state,
      activeQuests: filtredQuestions
    }
  }),
  on(QuestsStoreActions.updateQuestStatusInQuestsStores, (state, { questId, status, count }) =>{
    const filtredQuestions = state.activeQuests?.filter((quest: IBaseQuest) => {
      if (quest?.id !== questId) {
        return {
          ...quest,
          status,
          currentCount: quest.currentCount + count
        }
      }
      return quest
    })

    return {
      ...state,
      activeQuests: filtredQuestions
    }
    }),
  on(QuestsStoreActions.successfulQuestComplete, (state, { questId }) =>{
    const filtredQuestions = state.activeQuests?.filter((quest: IBaseQuest) => quest?.id !== questId)
    return{
      ...state,
      activeQuests: filtredQuestions
    }
  }),
  on(QuestsStoreActions.hardSetFromUserLoad, (state, {loadedState}) => loadedState),
);

export const questStoreReducer = reducer;
