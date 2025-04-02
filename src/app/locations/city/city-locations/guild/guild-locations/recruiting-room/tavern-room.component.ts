import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AdventureCreatorService} from './recrutes-sandbox/adventures-creator.service';
import {RecruitedAdventures} from './recrutes-sandbox/character-creator.interface';
import {RecruitedAdventuresActions} from '../../../../../../store/recruted-adventures/recruited-adventures.actions';
import {
  selecCanRefreshAdventures,
  selectTemporaryRecruited
} from '../../../../../../store/recruted-adventures/recruited-adventures.selector';
import {IRecruitedAdventuresState} from '../../../../../../store/recruted-adventures/recruited-adventures.reducer';
import {IGuildStoreState} from '../../../../../../store/guild-store/guild-store.reducer';
import {getGoldCount} from '../../../../../../store/guild-store/guild-store.selector';
import {GuildStoreActions} from '../../../../../../store/guild-store/guild-store.actions';
import {CharacterCardComponent} from '../../../../../../shared/character-card/character-card.component';

@Component({
  selector: 'app-recruiting-room',
  templateUrl: './tavern-room.component.html',
  imports: [
    CharacterCardComponent
  ],
  styleUrls: ['./tavern-room.component.scss']
})
export class TavernRoomComponent implements OnInit {
  public charactersData: RecruitedAdventures[] = [];
  private canRefreshAdventures: boolean = false;
  private goldCount: number = 0;
  private recrutePrise: number = 10;

  constructor(
    private store: Store<IRecruitedAdventuresState>,
    private adventureCreator: AdventureCreatorService,
    private readonly guildStore: Store<IGuildStoreState>
  ) {
    this.store.select(selectTemporaryRecruited).subscribe(data => {
      this.charactersData = data;
    });
    this.store.select(selecCanRefreshAdventures).subscribe(boolean => {
      this.canRefreshAdventures = boolean;
    });
    this.guildStore.select(getGoldCount).pipe().subscribe((gold) => this.goldCount = gold)
  }

  ngOnInit(): void {
    if (this.canRefreshAdventures) {
      this.generateRandomAdventures(9, true);
      this.store.dispatch(RecruitedAdventuresActions.canRefreshAdventures({
        canRefreshAdventures: false
      }));
    }
  }

  private generateRandomAdventures(count: number, withEquipment: boolean = false): void {
    for (let i = 0; i < count; i++) {
      const character = this.adventureCreator.generateRandomClass(1, withEquipment);
      if (character) {
        this.store.dispatch(RecruitedAdventuresActions.addRecruitedAdventures({
          temporaryRecruitedAdventures: character
        }));
      }
    }
  }

  public onHire(character: RecruitedAdventures) {
    if (this.goldCount > this.recrutePrise) {
      this.store.dispatch(GuildStoreActions.decreaseGold({
        gold: this.recrutePrise
      }));

      this.store.dispatch(RecruitedAdventuresActions.addHiredAdventures({
        hiredAdventure: character
      }));
    } else {
      // TODO set notific
    }


  }
}
