import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {QuestDialogComponent} from './modal/quest-dialog/quest-dialog.component';
import {QuestTemplateComponent} from './quest-template/quest-template.component';
import {QuestService} from './services/quest-creator.service';
import {Store} from '@ngrx/store';
import {QuestsStoreActions} from '../../../../../store/quest-store/quests-store.actions';
import {IQuestsStoresState} from '../../../../../store/quest-store/quests-store.reducer';
import {IBaseQuest} from './models/quest-interface';

@Component({
  selector: 'app-task-board',
  imports: [
    QuestTemplateComponent
  ],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent implements OnInit {
  quests: IBaseQuest[] = [];

  constructor(private dialog: MatDialog, private readonly questService: QuestService, private questStore: Store<IQuestsStoresState>) {}

  ngOnInit() {
    this.generateQuests();
  }

  private generateQuests() {
    const count = Math.floor(Math.random() * 6) + 3;
    this.questService.getRandomQuests()
    for (let i = 0; i < count; i++) {
      let result = this.questService.getRandomQuests()
      if (result) {
        this.quests.push(result)
      }
    }
  }

  showQuestDetails(quest: IBaseQuest) {
    const dialogRef = this.dialog.open(QuestDialogComponent, {
      width: '600px',
      data: quest,
      panelClass: 'quest-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'accept') {
        this.acceptQuest(quest);
      }
    });
  }

  acceptQuest(asseptedQuest: IBaseQuest) {
    this.questStore.dispatch(QuestsStoreActions.addToQuestsStore({quest: asseptedQuest}))
    this.quests = this.quests.filter(quest => {
      return  quest?.id !== asseptedQuest?.id
    })
  }
}
