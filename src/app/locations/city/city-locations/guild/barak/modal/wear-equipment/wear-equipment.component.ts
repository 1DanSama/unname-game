import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EquipmentSlot, ItemForEquip} from '../../../../../../../store/guild-store/models/item.model';
import {Store} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IGuildStoreState, TEquipmentSlots} from '../../../../../../../store/guild-store/guild-store.reducer';
import {selectEquipment} from '../../../../../../../store/guild-store/guild-store.selector';

@Component({
  selector: 'app-wear-equipment',
  imports: [
    FormsModule
  ],
  templateUrl: './wear-equipment.component.html',
  styleUrl: './wear-equipment.component.scss'
})
export class WearEquipmentComponent {
  @Output() confirm = new EventEmitter<{selectedEquipment: ItemForEquip}>();
  equipmentSlots = Object.values(EquipmentSlot);
  selectedSlot!: EquipmentSlot;
  itemsForSlot: ItemForEquip[] = [];
  selectedItem!: ItemForEquip | undefined;

  constructor(
    private readonly guildStore: Store<IGuildStoreState>,
    public dialogRef: MatDialogRef<WearEquipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onSlotChange(): void {
    // Get items for selected slot from store
    this.guildStore.select(selectEquipment).subscribe(items => {
      this.itemsForSlot = items[this.selectedSlot] || []
    });
  }

  selectItem(item: ItemForEquip): void {
    this.selectedItem = item;
  }

  onConfirm(): void {
    if (this.selectedItem) {
      this.confirm.emit({selectedEquipment: this.selectedItem});
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
