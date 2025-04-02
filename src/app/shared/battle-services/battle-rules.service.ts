import { Injectable } from '@angular/core';
import { BattleActionService } from './battle-action.service';
import { BattleLoggerService } from './battle-logger.service';
import {
  IBattleCharacter,
  Stat,
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import { DamageCalculationService } from './damage-calculation.service';
import { CharacterClass } from '../../store/recruted-adventures/recruted-abventures.model';

@Injectable({ providedIn: 'root' })
export class BattleRulesService {
  constructor(
    private logger: BattleLoggerService,
    private damageCalculator: DamageCalculationService,
  ) {}

  performTurn(attacker: IBattleCharacter, target: IBattleCharacter): {
    logs: string[];
    updatedTarget: IBattleCharacter;
    damageAmount: number;
  } {
    const logs: string[] = [];

    if (attacker.className === CharacterClass.Healer) {
      if (target.currentHealth < target.maxHealthPoints) {
        return this.performHeal(attacker, target, logs);
      } else {
        logs.push(`${attacker.name} 1чекає, бо немає союзників для лікування.`);
        return {
          logs,
          updatedTarget: target,
          damageAmount: 0,
        };
      }
    }

    // Default to attack behavior for other classes
    return this.performAttack(attacker, target, logs);
  }

  private performHeal(
    attacker: IBattleCharacter,
    target: IBattleCharacter,
    logs: string[],
  ): {
    logs: string[];
    updatedTarget: IBattleCharacter;
    damageAmount: number;
  } {
    const healAmount = Math.floor(
      attacker.characterStats.intellect * 1.5 +
      (attacker.equipeStats?.magicAttack || 0),
    );

    const newHealth = target.currentHealth + healAmount;

    const updatedHealth = Math.min(newHealth, target.maxHealthPoints);

    const updatedTarget = {
      ...target,
      currentHealth: updatedHealth,
      isHeal: true,
    };

    logs.push(
      `${attacker.name} лікує ${target.name} на ${healAmount} здоров'я`,
    );

    return {
      logs,
      updatedTarget,
      damageAmount: -healAmount,
    };
  }

  private performAttack(
    attacker: IBattleCharacter,
    target: IBattleCharacter,
    logs: string[],
  ): {
    logs: string[];
    updatedTarget: IBattleCharacter;
    damageAmount: number;
  } {
    let damageAmount = 0;

    const baseDamage =
      attacker.characterStats.strength +
      (attacker.equipeStats?.physicalAttack || 0);

    const isCritical = Math.random() < attacker.characterStats[Stat.Agility];
    const critMultiplier = isCritical ? 1.5 : 1;
    damageAmount = Math.floor(baseDamage * critMultiplier);

    // Apply damage to the single target
    const newHealth = Math.max(0, target.currentHealth - damageAmount);
    const updatedTarget = {
      ...target,
      currentHealth: newHealth,
      isHit: true,
    };


    // TODO uncomment it
    // logs.push(
    //   `${attacker.name} атакує ${target.name} і завдає ${damageAmount} шкоди${
    //     isCritical ? ' (КРИТИЧНИЙ УДАР!)' : ''
    //   }`,
    // );

    return {
      logs,
      updatedTarget,
      damageAmount,
    };
  }

  private isMelee(className: string): boolean {
    const meleeClasses = ['Warrior', 'Rogue'];
    return meleeClasses.includes(className);
  }
}
