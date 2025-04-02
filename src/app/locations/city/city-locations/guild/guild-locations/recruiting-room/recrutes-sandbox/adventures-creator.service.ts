import {Injectable} from '@angular/core';
import {EquipStat, ICharacter, IEquipStats, Stat} from './character-creator.interface';
import {EquipmentSlot, ItemForEquip} from '../../../../../../../store/guild-store/models/item.model';
import {RandomItemGeneratorService} from '../../../../../../../shared/item-creator.service';
import {SetEquipmentStatService} from '../../../../../../../shared/items-constructor/set-equipment-stats.service';
import {CharacterDataCreatorService} from './character-data-creator.service';
import {CharacterClass} from '../../../../../../../store/recruted-adventures/recruted-abventures.model';
import {ItemServicesService} from '../../../../../../../shared/item-services/item-services.service';

@Injectable({providedIn: 'root'})
export class AdventureCreatorService {
  constructor(
    private characterDataCreatorService: CharacterDataCreatorService,
    private itemServicesService: ItemServicesService
  ) {}

  generateRandomClass(level: number, withEquipment: boolean = false): ICharacter {
      const character = this.characterDataCreatorService.create(1, this.getRandomClass(), true);


      if (withEquipment) {
        character.equipment = this.itemServicesService.generateFullEquipmentSet(level, character.className);
        if (character.equipment) {
          character.equipeStats = this.itemServicesService.calculateEquipmentStats(character.equipment);
        }

      }

    character.characterStats = Object.keys(Stat).reduce((acc, statKey) => {
      const stat = Stat[statKey as keyof typeof Stat];
      acc[stat] = (character.personalStats[stat] || 0) + (character.equipeStats[stat] || 0);
      return acc;
    }, { ...character.characterStats });

      return character;
  }

  private getRandomClass(): CharacterClass {
    const values = Object.values(CharacterClass) as CharacterClass[];

    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  }
}
