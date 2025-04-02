import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {IRecruitedAdventuresState} from '../../../../../store/recruted-adventures/recruited-adventures.reducer';
import {selectRecruited} from '../../../../../store/recruted-adventures/recruited-adventures.selector';
import {RecruitedAdventures} from '../guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {MatDialog} from '@angular/material/dialog';
import {EquipmentSlot, ItemForEquip} from '../../../../../store/guild-store/models/item.model';
import {WearEquipmentComponent} from './modal/wear-equipment/wear-equipment.component';
import {GuildStoreActions} from '../../../../../store/guild-store/guild-store.actions';
import {IGuildStoreState} from '../../../../../store/guild-store/guild-store.reducer';
import {RecruitedAdventuresActions} from '../../../../../store/recruted-adventures/recruited-adventures.actions';
import {CharacterCardComponent} from '../../../../../shared/character-card/character-card.component';

@Component({
  selector: 'app-barak',
  imports: [
    CharacterCardComponent
  ],
  templateUrl: './barak.component.html',
  styleUrl: './barak.component.scss'
})
export class BarakComponent {
  public recruitedCharactersData: RecruitedAdventures[] = []

  constructor(
    private store: Store<IRecruitedAdventuresState>,
    private dialog: MatDialog,
    private readonly guildStore: Store<IGuildStoreState>
  ) {
    this.store.select(selectRecruited).subscribe((data: RecruitedAdventures[]) => {
      this.recruitedCharactersData = data;
    });
  }

  openEquipmentModal(character:RecruitedAdventures): void {
    const dialogRef = this.dialog.open(WearEquipmentComponent, {
      minWidth: '62.1vw',
      maxWidth: '62.1vw',
      panelClass: 'custom-dialog-container',
      data: {}
    });

    dialogRef.componentInstance.confirm.subscribe(({selectedEquipment} ) => {
      if (selectedEquipment) {
        this.updateEquipment(selectedEquipment, character);
      }
    })
  }

  updateEquipment(selectedEquipment: ItemForEquip, character: RecruitedAdventures): void {
    this.guildStore.dispatch(GuildStoreActions.removeEquipmentToStore({
      slot: selectedEquipment.slot,
      itemId: selectedEquipment.id
    }));

    const updatedAdventures = {
      ...character,
      equipment: {
        ...character.equipment,
        [selectedEquipment.slot as EquipmentSlot]: selectedEquipment
      }
    };


    this.store.dispatch(RecruitedAdventuresActions.updateRecruitedAdventures({ updatedAdventures }));
  }
}
