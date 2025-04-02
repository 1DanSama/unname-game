// party-power-calculator.service.ts
import { Injectable } from '@angular/core';
import {
  EquipStat,
  IEquipStats,
  IPersonalStats,
  RecruitedAdventures
} from '../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

@Injectable({
  providedIn: 'root'
})
export class PartyPowerCalculatorService {
  private readonly STAT_WEIGHTS = {
    health: 1.2,
    mana: 0.8,
    offensive: 1.5,
    defensive: 1.0
  };

  calculatePartyStats(party: RecruitedAdventures[]): {
    totalPower: number;
    averageLevel: number;
    partySize: number;
  } {
    return {
      totalPower: this.calculateTotalPower(party),
      averageLevel: this.getAverageLevel(party),
      partySize: party.length
    };
  }

  private calculateTotalPower(party: RecruitedAdventures[]): number {
    return party.reduce((sum, char) => sum + this.calculateCharacterPower(char), 0);
  }

  private calculateCharacterPower(char: RecruitedAdventures): number {
    const totalStats = this.calculateTotalStatPoints(char.level);
    let power = 0;

    // Розрахунок сили з основних статів
    power += this.calculateStatsPower(
      char.personalStats,
      this.getPersonalStatWeights()
    );

    // Бонуси за рівень
    power += this.calculateLevelBonus(char.level);

    // Обладунки та зброя
    power += this.calculateStatsPower(
      char.equipeStats,
      this.getEquipmentStatWeights()
    );

    // Здоров'я та мана
    power += char.maxHealthPoints * this.STAT_WEIGHTS.health;
    power += char.maxManaPoints * this.STAT_WEIGHTS.mana;

    return Math.round(power);
  }

  private calculateTotalStatPoints(level: number): number {
    if (level < 1) return 0;
    const base = 22 + (level - 1);
    const bonus5 = (Math.floor(level / 5) - Math.floor(level / 10)) * 1;
    const bonus10 = Math.floor(level / 10) * 3;
    return base + bonus5 + bonus10;
  }

  private calculateLevelBonus(level: number): number {
    let bonus = 0;
    if (level >= 5) bonus += Math.floor(level / 5) * 1;
    if (level >= 10) bonus += Math.floor(level / 10) * 3;
    return bonus * 0.8;
  }

  private getAverageLevel(party: RecruitedAdventures[]): number {
    return party.length > 0
      ? Math.round(party.reduce((sum, c) => sum + c.level, 0) / party.length)
      : 1;
  }

  private calculateStatsPower(stats: IPersonalStats | IEquipStats, weights: Record<string, number>): number {
    return Object.entries(stats).reduce((total, [stat, value]) => {
      return total + (value || 0) * (weights[stat] || 1);
    }, 0);
  }

  private getPersonalStatWeights(): Record<string, number> {
    return {
      [EquipStat.Vitality]: this.STAT_WEIGHTS.defensive,
      [EquipStat.Strength]: this.STAT_WEIGHTS.offensive,
      [EquipStat.Intellect]: this.STAT_WEIGHTS.offensive,
      [EquipStat.Agility]: 0.7
    };
  }

  private getEquipmentStatWeights(): Record<string, number> {
    return {
      [EquipStat.PhysicalAttack]: this.STAT_WEIGHTS.offensive,
      [EquipStat.MagicAttack]: this.STAT_WEIGHTS.offensive,
      [EquipStat.PhysicalArmor]: this.STAT_WEIGHTS.defensive,
      [EquipStat.MageArmor]: this.STAT_WEIGHTS.defensive,
      [EquipStat.Health]: this.STAT_WEIGHTS.health * 0.8,
      [EquipStat.Mana]: this.STAT_WEIGHTS.mana * 0.8
    };
  }
}
