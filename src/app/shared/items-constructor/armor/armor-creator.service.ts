import { Injectable } from '@angular/core';
import { EquipmentSlot, ItemForEquip, ItemRarity, ItemStats } from '../../../store/guild-store/models/item.model';
import {EquipmentNameGeneratorService} from '../equipment-name-generator.service';
import {
  EquipStat
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

interface ArmorConfig {
  armor: number;
  health: number;
  agility: number;
}

@Injectable({ providedIn: 'root' })
export class ArmorCreatorService {
  private readonly baseConfig: ArmorConfig = {
    armor: 1,
    health: 3,
    agility: 1
  };

  constructor(private readonly nameGenerator: EquipmentNameGeneratorService) {}

  createCommonArmor(slot: EquipmentSlot, level: number = 1): ItemForEquip {
    const totalPoints = level * 2;
    const allocatedPoints = Math.floor(totalPoints * 0.7);
    const randomPoints = totalPoints - allocatedPoints;

    const baseStats = this.calculateBaseStats(allocatedPoints);
    const randomStats = this.addRandomStats(randomPoints);

    return {
      id: `armor-${this.getRandomId()}`,
      name: this.nameGenerator.generateItemName(slot, this.getSlotName(slot)),
      description: this.generateDescription(baseStats, slot),
      price: this.calculatePrice(baseStats, randomStats),
      rarity: ItemRarity.Common,
      slot: slot,
      icon: '',
      stats: {
        agility: baseStats.agility + randomStats.agility
      },
      equipParams:{
        physicalArmor: baseStats.armor + randomStats.armor,
        [EquipStat.Health]: baseStats.health + randomStats.health,
      }
    };
  }

  private calculateBaseStats(allocatedPoints: number): ArmorConfig {
    const totalWeight = Object.values(this.baseConfig).reduce((sum, w) => sum + w, 0);

    return {
      armor: Math.floor(allocatedPoints * (this.baseConfig.armor / totalWeight)),
      health: Math.floor(allocatedPoints * (this.baseConfig.health / totalWeight)),
      agility: Math.floor(allocatedPoints * (this.baseConfig.agility / totalWeight))
    };
  }

  private addRandomStats(randomPoints: number): ArmorConfig {
    const stats: ArmorConfig = { armor: 0, health: 0, agility: 0 };
    const statKeys = Object.keys(stats) as (keyof ArmorConfig)[];

    for (let i = 0; i < randomPoints; i++) {
      const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
      stats[randomStat]++;
    }

    return stats;
  }

  private generateDescription(baseStats: ArmorConfig, slot: EquipmentSlot): string {
    const descriptors = [];

    if (baseStats.armor > 5) descriptors.push('reinforced');
    if (baseStats.health > 3) descriptors.push('sturdy');
    if (baseStats.agility > 1) descriptors.push('lightweight');

    return `A ${descriptors.join(', ') || 'well-crafted'} ${this.getSlotName(slot)} for protection`;
  }

  private getSlotName(slot: EquipmentSlot): string {
    return EquipmentSlot[slot] || '';
  }

  private calculatePrice(baseStats: ArmorConfig, randomStats: ArmorConfig): number {
    const totalStats = Object.values(baseStats).reduce((a, b) => a + b, 0) +
      Object.values(randomStats).reduce((a, b) => a + b, 0);
    return 10 + Math.floor(totalStats * 2);  // Changed multiplier from 3 to 2
  }

  private getRandomId (): string {
    return Math.random().toString(36).substr(1, 16)
  }
}
