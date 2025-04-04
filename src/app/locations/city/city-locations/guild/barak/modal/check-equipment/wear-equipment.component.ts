import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EquipmentSlot} from '../../../../../../../store/guild-store/models/item.model';
import {Store} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IGuildStoreState} from '../../../../../../../store/guild-store/guild-store.reducer';
import {
  RecruitedAdventures
} from '../../../guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {NgOptimizedImage} from '@angular/common';
import {ChangeEquipComponent} from '../change-equip/change-equip.component';
import {IRecruitedAdventuresState} from '../../../../../../../store/recruted-adventures/recruited-adventures.reducer';
import {selectRecruited} from '../../../../../../../store/recruted-adventures/recruited-adventures.selector';

@Component({
  selector: 'app-check-equipment',
  imports: [
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './wear-equipment.component.html',
  styleUrls: ['./wear-equipment.component.scss', './equipment-slot.scss']
})
export class CheckEquipmentComponent {
  equipmentSlots = Object.values(EquipmentSlot);
  character: RecruitedAdventures | null;

  constructor(
    private readonly guildStore: Store<IGuildStoreState>,
    private recruitedStore: Store<IRecruitedAdventuresState>,
    public dialogRef: MatDialogRef<CheckEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {character: RecruitedAdventures},
    private dialog: MatDialog
) {
    this.character = data.character;
    this.recruitedStore.select(selectRecruited).subscribe((data: RecruitedAdventures[]) => {
      console.log('data', data)
      this.character = data.find(char => char.id === this.character?.id) || this.character
      console.log('this.character', this.character )
    });
  }

  checkAvailableEquipment(slot: string) {
    const dialogRef = this.dialog.open(ChangeEquipComponent, {
      minWidth: '60vw',
      maxWidth: '70vw',
      panelClass: 'custom-dialog-container',
      data: {slot, character: this.character}
    });

    dialogRef.componentInstance.confirm.subscribe(() => {
    })
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
