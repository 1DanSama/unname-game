import {Injectable} from '@angular/core';
import {
  IBattleCharacter,
  Stat
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';

@Injectable({ providedIn: 'root' })
export class DamageCalculationService {
  private readonly CRIT_MULTIPLIER = 1.5;
  private readonly BASE_ARMOR_REDUCTION = 0.02;

  calculateBaseDamage(attacker: IBattleCharacter): number {
    switch (attacker.className) {
      case CharacterClass.Warrior:
        return  attacker.characterStats[Stat.Strength];
      case CharacterClass.Wizard:
      case CharacterClass.Healer:
        return  attacker.characterStats[Stat.Intellect];
      case CharacterClass.Rogue:
        return attacker.characterStats[Stat.Strength];

      default:
        return attacker.characterStats[Stat.Strength];
    }
  }

  applyArmorReduction(damage: number, target: IBattleCharacter): number {
    // const armor = target.equipment?.armor?.defenseValue || 0;
    // return Math.max(1, Math.floor(damage * (1 - armor * this.BASE_ARMOR_REDUCTION)));
    return damage;
  }

  calculateCriticalStrike(attacker: IBattleCharacter, target: IBattleCharacter, baseDamage: number): { damage: number, isCriticalDamaged: boolean } {
    const attackerAgi = attacker?.characterStats[Stat.Agility];
    const targetAgi = target?.characterStats[Stat.Agility];

    if (!targetAgi) return { damage: baseDamage * this.CRIT_MULTIPLIER, isCriticalDamaged: true };

    // 1. Відношення агільностей
    const ratio = attackerAgi / targetAgi;

    // 2. Логарифмічна формула для задоволення умов
    const rawChance = 0.10 + (Math.log(ratio) / Math.log(3)) * 0.65;

    // 3. Обмеження діапазону
    const critChance = Math.min(Math.max(rawChance, 0.10), 0.85);

    const isCritical = Math.random() < critChance;

    return {
      damage: isCritical ? Math.floor(baseDamage * this.CRIT_MULTIPLIER) : baseDamage,
      isCriticalDamaged: isCritical
    };
  }

  calculateEvasionChance(attacker: IBattleCharacter, target: IBattleCharacter, baseDamage: number): { damage: number, isEvaded: boolean } {
    const attackerAgi = attacker?.characterStats[Stat.Agility];
    const targetAgi = target?.characterStats[Stat.Agility];

    if (attackerAgi === 0) return { damage: 0, isEvaded: true };

    const ratio = targetAgi / attackerAgi; // Інвертоване відношення
    const rawChance = 0.10 + (Math.log(ratio) / Math.log(3)) * 0.65;
    const evasionChance = Math.min(Math.max(rawChance, 0.10), 0.85);

    const isEvaded = Math.random() < evasionChance;
    return {
      damage: isEvaded ? 0 : baseDamage,
      isEvaded
    };
  }

}
