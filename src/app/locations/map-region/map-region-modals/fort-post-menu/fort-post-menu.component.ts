import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {IGuildStoreState, IMaterials} from '../../../../store/guild-store/guild-store.reducer';
import {filter, Observable, take} from 'rxjs';
import {IBaseQuest} from '../../../city/city-locations/guild/task-board/models/quest-interface';
import {getAllActiveQuests} from '../../../../store/quest-store/quest-store.selector';
import {AsyncPipe} from '@angular/common';
import {IQuestsStoresState} from '../../../../store/quest-store/quests-store.reducer';
import {QuestManagerService} from '../../../../shared/quest-manager.service';
import {getMaterialsCount} from '../../../../store/guild-store/guild-store.selector';
import {map} from 'rxjs/operators';
import {QuestService} from '../../../city/city-locations/guild/task-board/services/quest-creator.service';
import {GuildStoreActions} from '../../../../store/guild-store/guild-store.actions';

@Component({
  selector: 'app-fort-post-menu',
  imports: [
    MatButton,
    AsyncPipe
  ],
  templateUrl: './fort-post-menu.component.html',
  styleUrl: './fort-post-menu.component.scss'
})
export class FortPostMenuComponent {
  activeTab = 1;
  quests$:Observable<IBaseQuest[]>
  materials$:Observable<IMaterials>

  filteredQuests$!: Observable<IBaseQuest[]>;
  zoneCode!: string;

  tabs = [
    {
      id: 1,
      label: 'Materials',
      title: 'Materials',
      content: 'Transfer the materials'
    },
    {
      id: 2,
      label: 'Quests board',
      title: 'Quests board',
      content: 'You can get quets for this region there. You can get rewards for quests here or in the city.'
    },
    {
      id: 3,
      label: 'Test',
      title: 'Third Option Content',
      content: 'Detailed information and controls for the third option...'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<FortPostMenuComponent>,
    private questStore: Store<IQuestsStoresState>,
    private guildStore: Store<IGuildStoreState>,
    private questManagerService: QuestManagerService,
    private questService: QuestService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { targetZone: string }
  ) {
    this.quests$ = this.questStore.select(getAllActiveQuests).pipe(
      filter(quests => quests.some(quest =>
        quest.type.includes('fort-post')
      )),
      map(quests => quests.filter(quest =>{
        return quest.type.includes('fort-post') && quest.location === this.data.targetZone

        }
      ))
    );

    this.materials$ = this.guildStore.select(getMaterialsCount)
  }

  ngOnInit(): void {
    this.zoneCode = this.questService.getZoneCodeByName(this.data.targetZone) || '';

    this.filteredQuests$ = this.questStore.select(getAllActiveQuests).pipe(
      map(quests => quests.filter(quest =>
          quest.type.includes('fort-post') &&
          this.isQuestInZone(quest.location)
        )
      )
    )
  }

  private isQuestInZone(location: string): boolean {
    if (this.zoneCode === 'E') {
      return location === 'E';
    }
    return location.startsWith(this.zoneCode);
  }

  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  compliteQuest(quest: IBaseQuest) {
    let materials = {};
    this.materials$.pipe(take(1)).subscribe(res => materials = res);

    const key = Object.keys(materials).find(key => key === quest.questTargetKey);

    if (Object.prototype.hasOwnProperty.call(materials, quest.questTargetKey) && key && quest.finalizeCount <= materials[key as keyof typeof materials]) {
      this.guildStore.dispatch(GuildStoreActions.removeMaterials({
        materialName: key,
        amount: quest.finalizeCount
      }));

      this.questManagerService.updateQuestProgress(key, materials[key as keyof typeof materials])
      this.cdr.detectChanges()
    } else {
      console.log('Key not found in materials or ' + materials[key as keyof typeof materials] + 'not enough');
    }
  }
}
