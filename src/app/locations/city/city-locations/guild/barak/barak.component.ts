import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {IRecruitedAdventuresState} from '../../../../../store/recruted-adventures/recruited-adventures.reducer';
import {selectRecruited} from '../../../../../store/recruted-adventures/recruited-adventures.selector';
import {RecruitedAdventures} from '../guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {MatDialog} from '@angular/material/dialog';
import {CheckEquipmentComponent} from './modal/check-equipment/wear-equipment.component';
import {IGuildStoreState} from '../../../../../store/guild-store/guild-store.reducer';
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
    console.log(' this.recruitedCharactersData',  this.recruitedCharactersData)
    const dialogRef = this.dialog.open(CheckEquipmentComponent, {
      minWidth: '60vw',
      maxWidth: '60vw',
      panelClass: 'custom-dialog-container',
      data: {character}
    });

    // dialogRef.componentInstance.confirm.subscribe(({selectedEquipment} ) => {
    //   if (selectedEquipment) {
    //     this.updateEquipment(selectedEquipment, character);
    //   }
    // })
  }
}
