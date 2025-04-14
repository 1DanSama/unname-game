import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import {Store} from '@ngrx/store';
import {IGuildStoreState} from '../store/guild-store/guild-store.reducer';
import {IQuestsStoresState} from '../store/quest-store/quests-store.reducer';
import {IBattleStoreState} from '../store/battle-store/battle-store.reducer';
import {IRecruitedAdventuresState} from '../store/recruted-adventures/recruited-adventures.reducer';
import {combineLatest, Observable, of, throwError} from 'rxjs';
import {selectAllFromGuildStor} from '../store/guild-store/guild-store.selector';
import {selectAllFromBattleStore} from '../store/battle-store/battle-store.selectors';
import {getAllFromActiveQuestsStore} from '../store/quest-store/quest-store.selector';
import {selecAllFromRecruitedAdventuresStore} from '../store/recruted-adventures/recruited-adventures.selector';
import {catchError, first, map, switchMap, tap} from 'rxjs/operators';
import {BattleStoreActions} from '../store/battle-store/battle-store.actions';
import {GuildStoreActions} from '../store/guild-store/guild-store.actions';
import {QuestsStoreActions} from '../store/quest-store/quests-store.actions';
import {RecruitedAdventuresActions} from '../store/recruted-adventures/recruited-adventures.actions';

interface ISaveLoadData {
  created: string,
  data: IStoreKey,
  version: number
}

interface IStoreKey {
  guildStore: IGuildStoreState;
  questsStore: IQuestsStoresState;
  battleStore: IBattleStoreState;
  recruitedAdventuresStore: IRecruitedAdventuresState;
}

@Injectable({ providedIn: 'root' })
export class SaveLoadService {
  private currentVersion = 1;

  constructor(
    private readonly guildStore: Store<IGuildStoreState>,
    private readonly questsStore: Store<IQuestsStoresState>,
    private readonly battleStore: Store<IBattleStoreState>,
    private readonly recruitedAdventuresStore: Store<IRecruitedAdventuresState>,
    ) {
  }

  saveGame() {
    this.getAllStoreData()
  }

  private readFile(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = error => observer.error(error);
      reader.readAsText(file);

      return () => reader.abort();
    });
  }

  loadGame(file: File): Observable<void> {
    return this.readFile(file).pipe(
      switchMap(fileContent => {
        const data = JSON.parse(fileContent);

        if (data.version !== this.currentVersion) {
          return throwError(() => new Error('Version mismatch'));
        }

        return of(data);
      }),
    map((gameState: ISaveLoadData) => {
        this.battleStore.dispatch(BattleStoreActions.hardSetFromUserLoad({loadedState: gameState.data.battleStore}))
        this.guildStore.dispatch(GuildStoreActions.hardSetFromUserLoad({loadedState: gameState.data.guildStore}))
        this.questsStore.dispatch(QuestsStoreActions.hardSetFromUserLoad({loadedState: gameState.data.questsStore}))
        this.recruitedAdventuresStore.dispatch(RecruitedAdventuresActions.hardSetFromUserLoad({loadedState: gameState.data.recruitedAdventuresStore}))
      }),
      catchError(error => {
        console.error('Load failed:', error);
        return throwError(() => error);
      })
    );
  }

  // TODO create interface
  getAllStoreData(): void {
    combineLatest([
      this.guildStore.select(selectAllFromGuildStor),
      this.questsStore.select(getAllFromActiveQuestsStore),
      this.battleStore.select(selectAllFromBattleStore),
      this.recruitedAdventuresStore.select(selecAllFromRecruitedAdventuresStore)
    ])
      .pipe(first())
      .subscribe(([guildData, questsData, battleData, adventuresData]) => {
      const gameState: IStoreKey =  {
        guildStore: guildData,
        questsStore: questsData,
        battleStore: battleData,
        recruitedAdventuresStore: adventuresData
      };

      this.downloadStoreData(gameState)
    });
  }

  private downloadStoreData(gameState: unknown) {
    try {
      const blob = new Blob([JSON.stringify({
        version: this.currentVersion,
        created: new Date().toISOString(),
        data: gameState
      })], { type: 'application/json' });
      saveAs(blob, `game-save-${this.currentVersion}.save`);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }
}
