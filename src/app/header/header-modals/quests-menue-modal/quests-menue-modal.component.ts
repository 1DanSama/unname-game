import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {IBaseQuest} from '../../../locations/city/city-locations/guild/task-board/models/quest-interface';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-quests-menue-modal',
  imports: [
    TitleCasePipe,
    MatDialogClose
  ],
  templateUrl: './quests-menue-modal.component.html',
  styleUrl: './quests-menue-modal.component.scss'
})
export class QuestsMenueModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { quests: IBaseQuest[] }) {}

}
