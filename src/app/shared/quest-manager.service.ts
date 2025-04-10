// quest-manager.service.ts
import {Injectable, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, take} from 'rxjs';
import {getAllActiveQuests} from '../store/quest-store/quest-store.selector';
import {IQuestsStoresState} from '../store/quest-store/quests-store.reducer';
import {QuestsStoreActions} from '../store/quest-store/quests-store.actions';
import {GuildStoreActions} from '../store/guild-store/guild-store.actions';
import {IGuildStoreState} from '../store/guild-store/guild-store.reducer';
import {IBaseQuest} from '../locations/city/city-locations/guild/task-board/models/quest-interface';

@Injectable({providedIn: 'root'})
export class QuestManagerService {

  constructor(private questStore: Store<IQuestsStoresState>, private readonly guildStore: Store<IGuildStoreState>,
  ) {
  }

  updateQuestProgress(controlTags: string, countToAdd: number): void {
    this.questStore.select(getAllActiveQuests).pipe(take(1)).subscribe(activeQuests => {
        const quest = activeQuests.find(quest => {
          return this.getObjectWithAllTags(quest, controlTags)
        })
        // const quest = this.getActiveQuestById(activeQuests, questId)
        //
        // if (!quest) {
        //   console.warn(`Quest not found in active quests`);
        //   return;
        // }

        if (quest) {
          const newCount = quest.currentCount + countToAdd;
          const isCompleted = newCount >= quest.finalizeCount;

          if (isCompleted) {
            this.questStore.dispatch(QuestsStoreActions.successfulQuestComplete({questId: quest.id}));
            this.guildStore.dispatch(GuildStoreActions.increaseGold({gold: quest.goldReward}));
          } else {
            this.questStore.dispatch(QuestsStoreActions.updateQuestStatusInQuestsStores({
              questId: quest?.id,
              status: 'active',
              count: newCount
            }));
          }
        }
      }
    );
  }

  getObjectWithAllTags(obj: IBaseQuest, questTargetKey: string) {
    if (!obj || !obj.type) {
      return null;
    }

    return obj?.questTargetKey === questTargetKey ? obj : null
  }
}
