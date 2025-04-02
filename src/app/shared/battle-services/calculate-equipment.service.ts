import { Injectable } from '@angular/core';
import {
  EquipStat,
  IBattleCharacter,
  IEquipStats, Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  calculateEquipmentStats(character: IBattleCharacter): IEquipStats {
    let totalBaseStats: { [key in Stat]?: number } = {};
    let totalEquipStats: { [key in EquipStat]?: number } = {};

    Object.entries(character?.equipment ?? {}).forEach(([slot, item]) => {
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
