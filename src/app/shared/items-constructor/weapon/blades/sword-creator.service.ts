import {Injectable} from '@angular/core';
import {EquipmentSlot, ItemForEquip, ItemRarity} from '../../../../store/guild-store/models/item.model';
import {EquipmentNameGeneratorService} from '../../equipment-name-generator.service';
import {
  EquipStat
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

interface SwordConfig {
  strength: number;
  [EquipStat.PhysicalAttack]: number;
  armor: number;
}

@Injectable({ providedIn: 'root' })
export class SwordCreatorService {
  private readonly baseConfig: SwordConfig = {
    strength: 3,
    [EquipStat.PhysicalAttack]: 5,
    armor: 1
  };

  constructor(private readonly EquipmentNameGenerator: EquipmentNameGeneratorService) {}

  createCommonSword(level: number = 1): ItemForEquip {
    const totalPoints = level * 2;
    const allocatedPoints = Math.floor(totalPoints * 0.7);
    const randomPoints = totalPoints - allocatedPoints;

    const baseStats = this.calculateBaseStats(allocatedPoints);
    const randomStats = this.addRandomStats(randomPoints);

    return {
      id: `sword-${Math.random().toString(36).substr(2, 9)}`,
      name: this.EquipmentNameGenerator.generateItemName(EquipmentSlot.Weapon, 'sword'),
      description: this.generateDescription(baseStats),
      price: this.calculatePrice(baseStats, randomStats),
      rarity: ItemRarity.Common,
      slot: EquipmentSlot.Weapon,
      stats: {
        strength: baseStats.strength + randomStats.strength
      },
      equipParams: {
        [EquipStat.PhysicalAttack]: baseStats[EquipStat.PhysicalAttack] + randomStats[EquipStat.PhysicalAttack],
        [EquipStat.PhysicalArmor]: baseStats.armor + randomStats.armor
      }
    };
  }

  private calculateBaseStats(allocatedPoints: number): SwordConfig {
    const totalWeight = Object.values(this.baseConfig).reduce((sum, w) => sum + w, 0);

    return {
      strength: Math.floor(allocatedPoints * (this.baseConfig.strength / totalWeight)),
      [EquipStat.PhysicalAttack]: Math.floor(allocatedPoints * (this.baseConfig[EquipStat.PhysicalAttack] / totalWeight)),
      armor: Math.floor(allocatedPoints * (this.baseConfig.armor / totalWeight))
    };
  }

  private addRandomStats(randomPoints: number): SwordConfig {
    const stats: SwordConfig = { strength: 0, [EquipStat.PhysicalAttack]: 0, armor: 0 };
    const statKeys = Object.keys(stats) as (keyof SwordConfig)[];

    for (let i = 0; i < randomPoints; i++) {
      const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
      stats[randomStat]++;
    }

    return stats;
  }

  private generateDescription(baseStats: SwordConfig): string {
    const descriptors = [];
    if (baseStats.strength > 3) descriptors.push('well-balanced');
    if (baseStats[EquipStat.PhysicalAttack] > 4) descriptors.push('sharp-edged');
    if (baseStats.armor > 1) descriptors.push('durable');

    return `A ${descriptors.join(', ') || 'basic'} sword suitable for combat`;
  }

  private calculatePrice(baseStats: SwordConfig, randomStats: SwordConfig): number {
    const totalStats = Object.values(baseStats).reduce((a, b) => a + b, 0) +
      Object.values(randomStats).reduce((a, b) => a + b, 0);
    return 10 + Math.floor(totalStats * 2.5);
  }
}
