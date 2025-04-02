import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {IBaseQuest} from '../../models/quest-interface';

@Component({
  selector: 'app-quest-dialog',
  imports: [
    NgClass,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './quest-dialog.component.html',
  styleUrl: './quest-dialog.component.scss'
})
export class QuestDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<QuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBaseQuest
  ) {}

  getRankName(rating: string): string {
    return this.data?.rating;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAccept(): void {
    this.dialogRef.close('accept');
  }
}
