import {Injectable} from '@angular/core';
import {ItemForEquip, ItemStats} from '../../store/guild-store/models/item.model';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
import {
  Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

@Injectable({ providedIn: 'root' })
export class SetEquipmentStatService {
  private readonly MAX_STAT_SUM = 2;

  adjustStatsForClass(item: ItemForEquip, characterClass: CharacterClass): ItemForEquip {
    let stats = { ...item.stats };

    // Remove forbidden stats and ensure all fields exist
    stats = this.removeForbiddenStats(stats, characterClass);

    // Normalize stat sum with type-safe operations
    stats = this.normalizeStatSum(stats);

    // Apply class-specific stat priorities with proper initialization
    stats = this.applyClassPriorities(stats, characterClass);

    return { ...item, stats };
  }

  private removeForbiddenStats(stats: ItemStats, characterClass: CharacterClass): ItemStats {
    // Initialize all possible stats with 0 if undefined
    const cleaned: ItemStats = {
      strength: stats.strength ?? 0,
      vitality: stats[Stat.Vitality] ?? 0,
      agility: stats.agility ?? 0,
      intellect: stats.intellect ?? 0,
    };

    switch (characterClass) {
      case CharacterClass.Wizard:
      case CharacterClass.Healer:
        cleaned.strength = 0;
        break;
      case CharacterClass.Warrior:
      case CharacterClass.Rogue:
        cleaned.intellect = 0;
        break;
    }

    return cleaned;
  }

  private normalizeStatSum(stats: ItemStats): ItemStats {
    const currentSum = Object.values(stats).reduce((sum, val) => sum + val, 0);
    if (currentSum <= this.MAX_STAT_SUM) return stats;

    const scaleFactor = this.MAX_STAT_SUM / currentSum;
    const scaledStats: ItemStats = {};

    // Type-safe stat scaling with initialization
    (Object.entries(stats) as [keyof ItemStats, number][])
      .forEach(([stat, value]) => {
        scaledStats[stat] = Math.round(value * scaleFactor);
      });

    return this.adjustForRounding(scaledStats);
  }

  private adjustForRounding(stats: ItemStats): ItemStats {
    let currentSum = Object.values(stats).reduce((sum, val) => sum + val, 0);
    const diff = this.MAX_STAT_SUM - currentSum;

    if (diff !== 0) {
      const statsList = (Object.entries(stats) as [keyof ItemStats, number][])
        .filter(([_, value]) => value > 0);

      if (statsList.length > 0) {
        const [maxStat] = statsList.reduce((a, b) => a[1] > b[1] ? a : b);
        stats[maxStat] = (stats[maxStat] ?? 0) + diff;
      }
    }

    return stats;
  }

  private applyClassPriorities(stats: ItemStats, characterClass: CharacterClass): ItemStats {
    const prioritized = { ...stats };
    const currentSum = Object.values(prioritized).reduce((sum, val) => sum + val, 0);
    const remaining = this.MAX_STAT_SUM - currentSum;

    if (remaining > 0) {
      switch (characterClass) {
        case CharacterClass.Wizard:
        case CharacterClass.Healer:
          prioritized[Stat.Intellect] = (prioritized[Stat.Intellect] ?? 0) + remaining;
          break;
        case CharacterClass.Warrior:
          prioritized[Stat.Vitality] = (prioritized[Stat.Vitality] ?? 0) + remaining;
          break;
        case CharacterClass.Rogue:
          this.distributeToRogueStats(prioritized, remaining);
          break;
      }
    }

    return prioritized;
  }

  private distributeToRogueStats(stats: ItemStats, points: number): void {
    // Ensure stats exist before incrementing
    stats.strength = stats.strength ?? 0;
    stats.agility = stats.agility ?? 0;

    for (let i = 0; i < points; i++) {
      Math.random() > 0.5 ? stats.strength++ : stats.agility++;
    }
  }
}
