import { Injectable } from '@angular/core';
import { EquipmentSlot, ItemForEquip, ItemRarity, ItemStats } from '../../../../store/guild-store/models/item.model';
import {EquipmentNameGeneratorService} from '../../equipment-name-generator.service';
import {
  EquipStat, Stat
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

interface StaffConfig {
  intellect: number;
  magicDamage: number;
  manaRegen: number;
}

@Injectable({ providedIn: 'root' })
export class StaffCreatorService {
  private readonly baseConfig: StaffConfig = {
    intellect: 4,
    magicDamage: 3,
    manaRegen: 2
  };

  constructor(private readonly nameGenerator: EquipmentNameGeneratorService) {}

  createCommonStaff(level: number = 1): ItemForEquip {
    const totalPoints = level * 2;
    const allocatedPoints = Math.floor(totalPoints * 0.7);
    const randomPoints = totalPoints - allocatedPoints;

    const baseStats = this.calculateBaseStats(allocatedPoints);
    const randomStats = this.addRandomStats(randomPoints);

    return {
      id: `staff-${Math.random().toString(36).substr(2, 9)}`,
      name: this.nameGenerator.generateItemName(EquipmentSlot.Weapon, 'staff'),
      description: this.generateDescription(baseStats),
      price: this.calculatePrice(baseStats, randomStats),
      rarity: ItemRarity.Common,
      slot: EquipmentSlot.Weapon,
      stats: {
        [Stat.Intellect]: baseStats.intellect + randomStats.intellect
      },
      equipParams: {
        [EquipStat.MagicAttack]: baseStats.magicDamage + randomStats.magicDamage
      }
    };
  }

  private calculateBaseStats(allocatedPoints: number): StaffConfig {
    const totalWeight = Object.values(this.baseConfig).reduce((sum, w) => sum + w, 0);

    return {
      intellect: Math.floor(allocatedPoints * (this.baseConfig.intellect / totalWeight)),
      magicDamage: Math.floor(allocatedPoints * (this.baseConfig.magicDamage / totalWeight)),
      manaRegen: Math.floor(allocatedPoints * (this.baseConfig.manaRegen / totalWeight))
    };
  }

  private addRandomStats(randomPoints: number): StaffConfig {
    const stats: StaffConfig = { intellect: 0, magicDamage: 0, manaRegen: 0 };
    const statKeys = Object.keys(stats) as (keyof StaffConfig)[];

    for (let i = 0; i < randomPoints; i++) {
      const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
      stats[randomStat]++;
    }

    return stats;
  }

  private generateDescription(baseStats: StaffConfig): string {
    const descriptors = [];

    if (baseStats.intellect > 4) descriptors.push('arcane-infused');
    if (baseStats.magicDamage > 3) descriptors.push('power-charged');
    if (baseStats.manaRegen > 2) descriptors.push('energy-flowing');

    return `A ${descriptors.join(', ') || 'mystical'} staff humming with magical energy`;
  }

  private calculatePrice(baseStats: StaffConfig, randomStats: StaffConfig): number {
    const totalStats = Object.values(baseStats).reduce((a, b) => a + b, 0) +
      Object.values(randomStats).reduce((a, b) => a + b, 0);
    return 20 + Math.floor(totalStats * 3);
  }
}
