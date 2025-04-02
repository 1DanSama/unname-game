import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';
import {IMaterials} from '../../../store/guild-store/guild-store.reducer';
import {DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-guild-resources-menue-modal',
  imports: [
    MatDialogClose
  ],
  templateUrl: './guild-resources-menue-modal.component.html',
  styleUrl: './guild-resources-menue-modal.component.scss'
})
export class GuildResourcesMenueModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { gold: number, materials: IMaterials }) {}
}
