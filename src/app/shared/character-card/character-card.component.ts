import {Component, Input, Output, EventEmitter} from '@angular/core';
import {
  IEquipStats,
  IPersonalStats,
  RecruitedAdventures, Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  imports: [
    NgOptimizedImage,
    MatTooltip,
  ],
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent {
  @Input() character: RecruitedAdventures | undefined;
  @Input() buttonName: string = '';
  @Output() onAction = new EventEmitter<RecruitedAdventures>();

  getStatTotal(statKey: string): string {
  if (Object.keys(this.character?.personalStats || {}).includes(statKey))  {

  const personal = this.character?.personalStats[(statKey as  keyof IPersonalStats)] ?? 0;
  const equipment = this.character?.equipeStats[(statKey as  keyof IPersonalStats)] ?? 0;

  return `(Base) + ${personal} (Items) + ${equipment}`;
  }
  return ''
}

getStatusCont(statKey: string): number {
  if (Object.keys(this.character?.personalStats || {}).includes(statKey))  {

    const personal = this.character?.personalStats[(statKey as  keyof IPersonalStats)] ?? 0;
    const equipment = this.character?.equipeStats[(statKey as  keyof IPersonalStats)] ?? 0;

    return personal + equipment;
  }
  return 0;
}

  openEquipmentModal(character: RecruitedAdventures | undefined) {
    if (character) {
      this.onAction.emit(character);
    }
  }

  protected readonly Stat = Stat;
}
