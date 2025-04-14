import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {selectEquipment} from '../../../../../../../store/guild-store/guild-store.selector';
import {EquipmentSlot, ItemForEquip} from '../../../../../../../store/guild-store/models/item.model';
import {Store} from '@ngrx/store';
import {IGuildStoreState} from '../../../../../../../store/guild-store/guild-store.reducer';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  RecruitedAdventures
} from '../../../guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {GuildStoreActions} from '../../../../../../../store/guild-store/guild-store.actions';
import {RecruitedAdventuresActions} from '../../../../../../../store/recruted-adventures/recruited-adventures.actions';
import {IRecruitedAdventuresState} from '../../../../../../../store/recruted-adventures/recruited-adventures.reducer';

@Component({
  selector: 'app-change-equip',
  imports: [
    FormsModule
  ],
  templateUrl: './change-equip.component.html',
  styleUrl: './change-equip.component.scss'
})
export class ChangeEquipComponent {
  selectedSlot!: EquipmentSlot;
  itemsForSlot: ItemForEquip[] = [];
  selectedItem!: ItemForEquip | undefined;

  @Output() confirm = new EventEmitter<{ selectedEquipment: ItemForEquip }>();

  constructor(
    private readonly guildStore: Store<IGuildStoreState>,
    private charactersStore: Store<IRecruitedAdventuresState>,
    public dialogRef: MatDialogRef<ChangeEquipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { slot: string, character: RecruitedAdventures }
  ) {
    this.onSlotChange()
  }


  onSlotChange(): void {
    this.guildStore.select(selectEquipment).subscribe(items => {
      this.itemsForSlot = items[this.data.slot] || []
    });
  }

  selectItem(item: ItemForEquip): void {
    this.selectedItem = item;
  }


  updateEquipment(selectedItem: ItemForEquip, character: RecruitedAdventures): void {
    if (selectedItem) {
      this.removeTargetItemFromStore(selectedItem)
      this.setCurrentItemInStore(selectedItem, character)

      const updatedAdventures = {
        ...character,
        equipment: {
          ...character.equipment,
          [selectedItem.slot as EquipmentSlot]: selectedItem
        }
      };

      this.charactersStore.dispatch(RecruitedAdventuresActions.updateRecruitedAdventures({updatedAdventures}));
    }
  }


  onConfirm(): void {
    if (this.selectedItem && this.data.character) {
      this.updateEquipment(this.selectedItem, this.data.character);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private removeTargetItemFromStore(selectedItem: ItemForEquip) {
    this.guildStore.dispatch(GuildStoreActions.removeEquipmentToStore({
      slot: selectedItem.slot,
      itemId: selectedItem.id
    }));
  }

  private setCurrentItemInStore(selectedItem: ItemForEquip, character: RecruitedAdventures) {
    if (character.equipment && character.equipment[selectedItem.slot]) {
      this.guildStore.dispatch(GuildStoreActions.setEquipmentToStore({
        equipment: character.equipment[selectedItem.slot] as ItemForEquip
      }));
    }
  }
}
