import { Injectable } from '@angular/core';
import {NameGeneratorService} from './name-generator.service';
import {ICharacter, IEquipStats, IPersonalStats, Stat} from './character-creator.interface';
import {CharacterClass} from '../../../../../../../store/recruted-adventures/recruted-abventures.model';
import {createPersonalStats, getRowClassPosition} from './classes/classes.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterDataCreatorService {

  constructor(private readonly nameGenerator: NameGeneratorService) {}

  create(level: number = 1, className: CharacterClass, isTemporary = true): ICharacter {
    const iconVariations = 4;
    const randomIcon = Math.floor(Math.random() * iconVariations) + 1;
    const iconPath = `assets/${className}/${className.toLowerCase()}-${randomIcon}.jpg`;
    const characterStats = createPersonalStats(className);

    return {
      className: className,
      name: this.nameGenerator.generateName(className),
      characterStats: characterStats,
      personalStats: characterStats,
      equipeStats: {} as IEquipStats,
      maxHealthPoints: Math.round((characterStats[Stat.Vitality] * ((characterStats[Stat.Strength]) * 0.5)) * 3),
      maxManaPoints: Math.round(characterStats[Stat.Intellect] * 3),
      isTemporary: isTemporary,
      icon: iconPath,
      rowPosition: getRowClassPosition(className),
      level: 1,
      currentClassLevel: 1
    };


  }

}
