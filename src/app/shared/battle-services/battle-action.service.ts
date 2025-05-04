import {Injectable} from '@angular/core';
import {BattleLoggerService} from './battle-logger.service';
import {DamageCalculationService} from './damage-calculation.service';
import {
  EquipStat,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
import {TargetSelectionService} from './target-select-services/target-selection.service';
import {Store} from '@ngrx/store';

export interface IPerformAutoActionResult {
  updatedAttacker: IBattleCharacter;
  updatedTargets: IBattleCharacter[];
  logs: string[];
  damageAmount?: number;
  healAmount?: number;
}

@Injectable({providedIn: 'root'})
export class BattleActionService {
  private readonly HEAL_DIVIDER = 1;

  constructor(
    private damageCalculator: DamageCalculationService,
    private targetSelector: TargetSelectionService,
    private battleStore: Store
  ) {
  }

  performAutoAction(
    attacker: IBattleCharacter,
    validTargets: IBattleCharacter[]
  ): IPerformAutoActionResult {
    let target: IBattleCharacter | null = null;
    const logs: string[] = [];
    const ANIMATION_DURATION = 400;

    if (attacker.currentHealth <= 0) {
      return {
        updatedAttacker: attacker,
        updatedTargets: [],
        logs: [`${attacker.name} is inactive!`]
      };
    }

    if (attacker.className === CharacterClass.Healer) {
      const healingTargets = validTargets.filter(t =>
        t.currentHealth < t.maxHealthPoints &&
        t.isEnemy === attacker.isEnemy
      );
      target = healingTargets.length > 0
        ? this.selectTarget(healingTargets)
        : null;
    } else {
      target = this.selectTarget(validTargets.filter(t => t.isEnemy !== attacker.isEnemy));
    }

    if (!target) {
      logs.push(`${attacker.name} не знайшов цілей!`);
      return {
        updatedAttacker: {
          ...attacker,
          isActionCompleted: true
        },
        updatedTargets: [],
        logs
      };
    }

    let result: IBattleCharacter[];
    let damageAmount = 0;
    let healAmount = 0;
      if (attacker.className === CharacterClass.Healer) {
        const healResult = this.performHeal(attacker, [target]);
        result = healResult.updatedTargets;
        healAmount = healResult.healAmount;
      } else {
        const attackResult = this.performAttack(attacker, [target]);
        result = attackResult.updatedTargets;
        damageAmount = attackResult.damageAmount;
      }

    return {
      updatedAttacker: {
        ...attacker,
        isActionCompleted: true
      },
      updatedTargets: result,
      logs,
      damageAmount,
      healAmount
    };
  }

  private selectTarget(targets: IBattleCharacter[]): IBattleCharacter | null {
    if (!targets?.length) return null;

    return targets.reduce((prev, current) =>
      (current.currentHealth < prev.currentHealth) ? current : prev
    );
  }

  performAttack(
    attacker: IBattleCharacter,
    targets: IBattleCharacter[]
  ): { updatedTargets: IBattleCharacter[]; damageAmount: number } {
    const target = this.targetSelector.selectTarget(attacker, targets);

    if (!target) return { updatedTargets: targets, damageAmount: 0 };

    const baseDamage = this.damageCalculator.calculateBaseDamage(attacker);
    const evasionResult = this.damageCalculator.calculateEvasionChance(attacker, target, baseDamage);

    // Create new objects with spread operator for immutability
    let updatedTargets = targets.map(t => ({
      ...t,
      hasUpdatedActionStatus: true,
      activeActionStatus: {
        ...t.activeActionStatus,
        isTakingDamage: false,
        isEvaded: false,
        isCriticalDamaged: false
      }
    }));

    if (evasionResult.isEvaded) {
      this.addToLog(`${target.name} ухилився від атаки!`);
      updatedTargets = updatedTargets.map(t =>
        t.id === target.id ? {
          ...t,
          hasUpdatedActionStatus: true,
          activeActionStatus: {
            ...t.activeActionStatus,
            isEvaded: true
          }
        } : t
      );
      return { updatedTargets, damageAmount: 0 };
    }

    const { damage: finalDamage, isCriticalDamaged } =
      this.damageCalculator.calculateCriticalStrike(attacker, target, baseDamage);

    const totalDamage = Math.floor(finalDamage);
    const newHealth = Math.max(0, target.currentHealth - totalDamage);

    updatedTargets = updatedTargets.map(t =>
      t.id === target.id ? {
        ...t,
        currentHealth: newHealth,
        hasUpdatedActionStatus: true,
        activeActionStatus: {
          ...t.activeActionStatus,
          isTakingDamage: true,
          isCriticalDamaged
        }
      } : t
    );

    this.addToLog(` ⚔️ ${attacker.name} атакує ${target.name} (${totalDamage} шкоди)`);
    if (isCriticalDamaged) this.addToLog('⚡ Критичний удар!');

    return { updatedTargets, damageAmount: totalDamage };
  }

  performHeal(
    healer: IBattleCharacter,
    targets: IBattleCharacter[]
  ): { updatedTargets: IBattleCharacter[]; healAmount: number } {
    const validTargets = targets.filter(t =>
      t.currentHealth < t.maxHealthPoints &&
      t.isEnemy === healer.isEnemy
    );

    if (validTargets.length === 0) {
      this.addToLog(`ℹ️ Немає поранених союзників для лікування`);
      return {
        updatedTargets: targets,
        healAmount: 0
      };
    }

    const target = this.selectTarget(validTargets);
    if (!target) {
      return { updatedTargets: targets, healAmount: 0 };
    }

    const healAmount = Math.floor(
      (healer.characterStats.intellect +
        (healer.equipeStats[EquipStat.MagicAttack] || 0)) /
      this.HEAL_DIVIDER
    );

    const updatedTarget = {
      ...target,
      currentHealth: Math.min(target.currentHealth + healAmount, target.maxHealthPoints),
      hasUpdatedActionStatus: true,
      activeActionStatus: {
        ...target.activeActionStatus,
        isHeal: true
      }
    };

    this.addToLog(`💚 ${healer.name} лікує ${target.name} на ${healAmount} HP`);

    return {
      updatedTargets: targets.map(t => t.id === target.id ? updatedTarget : t),
      healAmount: healAmount,
    };
  }

  private addToLog(messages: string | string[]) {
    const newMessages = Array.isArray(messages) ? messages : [messages];
    // this.stateService.updateStateByKey([{key:'battleLog', value:[...newMessages, ...this.stateService.currentState.battleLog]}])
  }
}
