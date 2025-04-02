import { Injectable } from '@angular/core';
import {
  IEquipStats,
  IPersonalStats, Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

@Injectable({
  providedIn: 'root'
})
export class CountTotalStatsService {

  public calculateTotalStats(personal: IPersonalStats, equip: IEquipStats) {
    return {
      vitality: personal.vitality + (equip[Stat.Vitality] || 0),
      strength: personal.strength + (equip[Stat.Strength] || 0),
      intellect: personal.intellect + (equip[Stat.Intellect] || 0),
      agility: personal.agility + (equip[Stat.Agility] || 0)
    };
  }
}
