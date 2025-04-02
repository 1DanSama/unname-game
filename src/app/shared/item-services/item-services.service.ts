import { Injectable } from '@angular/core';
import {EquipmentSlot, ItemForEquip} from '../../store/guild-store/models/item.model';
import {
  EquipStat,
  IEquipStats,
  Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {RandomItemGeneratorService} from '../item-creator.service';
import {SetEquipmentStatService} from '../items-constructor/set-equipment-stats.service';

@Injectable({
  providedIn: 'root'
})
export class ItemServicesService {

  constructor(
    private randomItemGeneratorService: RandomItemGeneratorService,
    private statService: SetEquipmentStatService,
  ) { }

  // TODO create it reusable
  public generateFullEquipmentSet(
    level: number,
    characterClass: string // Added class parameter
  ): { [key in EquipmentSlot]?: ItemForEquip } {
    const equipment: { [key in EquipmentSlot]?: ItemForEquip } = {};

    // Generate armor with class-adjusted stats
    this.randomItemGeneratorService.getArmorSlots().forEach(slot => {
      const item = this.randomItemGeneratorService.generateRandomItems(level, 1, slot)[0];
      equipment[slot] = this.statService.adjustStatsForClass(item, characterClass as any); // Added stat adjustment
    });

    // Generate weapon with class-adjusted stats
    const weapon = this.randomItemGeneratorService.generateRandomItems(level, 1, EquipmentSlot.Weapon)[0];
    equipment[EquipmentSlot.Weapon] = this.statService.adjustStatsForClass(weapon, characterClass as any); // Added stat adjustment

    return equipment;
  }

  // TODO create it reusable
  public calculateEquipmentStats(equipment: { [key in EquipmentSlot]?: ItemForEquip }): IEquipStats {
    let totalBaseStats: { [key in Stat]?: number } = {};
    let totalEquipStats: { [key in EquipStat]?: number } = {};

    // Проходимо по всій екіпіровці
    Object.entries(equipment).forEach(([slot, item]) => {
      // Сумуємо базові характеристики
      if (item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          const key = stat as Stat;
          totalBaseStats[key] = (totalBaseStats[key] || 0) + (value ?? 0);
        });
      }

      // Сумуємо параметри екіпірування
      if (item.equipParams) {
        Object.entries(item.equipParams).forEach(([param, value]) => {
          const key = param as EquipStat;
          totalEquipStats[key] = (totalEquipStats[key] || 0) + (value ?? 0);
        });
      }
    });

    return {...totalBaseStats, ...totalEquipStats}
  }
}
