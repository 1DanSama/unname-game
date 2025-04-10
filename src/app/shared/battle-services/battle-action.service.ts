import {Injectable} from '@angular/core';
import {BattleLoggerService} from './battle-logger.service';
import {DamageCalculationService} from './damage-calculation.service';
import {
  EquipStat,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
import {TargetSelectionService} from './target-select-services/target-selection.service';

export interface IPerformAutoActionResult {
  updatedAttacker: IBattleCharacter;
  updatedTargets: IBattleCharacter[];
  logs: string[];
  damageAmount?: number;
  healAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class BattleActionService {
  private readonly HEAL_DIVIDER = 1;

  constructor(
    private damageCalculator: DamageCalculationService,
    private targetSelector: TargetSelectionService,
    private logger: BattleLoggerService
  ) {}

  performAutoAction(
    attacker: IBattleCharacter,
    validTargets: IBattleCharacter[],
    onComplete: (result: IPerformAutoActionResult) => void
  ) {
    let target: IBattleCharacter | null = null;
    const logs: string[] = [];
    const updatedTargets: IBattleCharacter[] = [];

    if (!attacker.isActive) {
      onComplete({
        updatedAttacker: attacker,
        updatedTargets: [],
        logs: [`${attacker.name} is inactive!`]
      });
      return;
    }

    // Target selection
    if (attacker.className === CharacterClass.Healer) {
      const healingTargets = validTargets.filter(t => t.currentHealth < t.maxHealthPoints);
      target = healingTargets.length > 0
        ? this.selectTarget(healingTargets)
        : null;
    } else {
      target = this.selectTarget(validTargets);
    }

    if (!target) {
      logs.push(`${attacker.name} не знайшов цілей!`);
      onComplete({
        updatedAttacker: { ...attacker,
          activeActionStatus: {
            ...attacker.activeActionStatus,
          },
          isActionCompleted: true
        },
        updatedTargets: [],
        logs
      });
      return;
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

    onComplete({
      updatedAttacker: {
        ...attacker,
        activeActionStatus: {
          ...attacker.activeActionStatus,
        },
        isActionCompleted: true
      },
      updatedTargets: result,
      logs,
      damageAmount,
      healAmount
    });
  }

  private selectTarget(targets: IBattleCharacter[]): IBattleCharacter {
    if (!targets?.length) return {} as IBattleCharacter;
    return targets.reduce((prev, current) =>
      (current.currentHealth < prev.currentHealth) ? current : prev
    );
  }

  performAttack(
    attacker: IBattleCharacter,
    targets: IBattleCharacter[]
  ): { updatedTargets: IBattleCharacter[]; damageAmount: number } {
    const target = this.targetSelector.selectTarget(attacker, targets);

    const baseDamage = this.damageCalculator.calculateBaseDamage(attacker);

    const evasionResult = this.damageCalculator.calculateEvasionChance(attacker, target, baseDamage);

    if (evasionResult.isEvaded) {
      this.logger.addLog(`${target.name} ухилився від атаки!`);
      return {
        updatedTargets: targets.map(t => t?.id === target?.id ? {...target, activeActionStatus: {...target.activeActionStatus, isEvaded: true}} : t),
        damageAmount: 0
      };
    }

    const { damage: finalDamage, isCriticalDamaged: isCritical } =
      this.damageCalculator.calculateCriticalStrike(attacker, target, baseDamage);

    const totalDamage = Math.floor(finalDamage);
    const newHealth = Math.max(0, target.currentHealth - totalDamage);

    const updatedTarget = {
      ...target,
      currentHealth: newHealth,
      activeActionStatus: {
        ...target.activeActionStatus,
        isTakingDamage: true,
        isCriticalDamaged: isCritical
      }
    };

    this.logger.addLog(`${attacker?.name} атакує ${target?.name} (${totalDamage} шкоди)`);
    if (isCritical) this.logger.addLog('⚡ Критичний удар!');

    return {
      updatedTargets: targets.map(t => {
if(t?.id === target?.id ) {
  console.log(' target?.id',  target?.id)
}
  return t?.id === target?.id ? updatedTarget : t
      }),
      damageAmount: totalDamage
    };
  }

  performHeal(
    healer: IBattleCharacter,
    targets: IBattleCharacter[]
  ): { updatedTargets: IBattleCharacter[]; healAmount: number } {
    const validTargets = targets.filter(t => {
        // For info Healing strategy
        // console.log(  ((healer.characterStats[Stat.Intellect]*3) + (healer?.equipeStats[EquipStat?.MagicAttack] || 0)))
        // console.log(t?.currentHealth / t?.maxHealthPoints * 100)
     return  t?.currentHealth < t?.maxHealthPoints &&
       (t.isEnemy === healer.isEnemy || !t.isEnemy === !healer.isEnemy)
    });

    if (validTargets.length === 0) {
      this.logger.addLog(`ℹ️ Немає поранених союзників для лікування`);
      return {
        updatedTargets: targets,
        healAmount: 0
      };
    }

    const target = validTargets.sort((a, b) => a.currentHealth - b.currentHealth)[0];
    const healAmount = Math.floor((healer.characterStats.intellect + (healer?.equipeStats[EquipStat.MagicAttack] || 0)) / this.HEAL_DIVIDER);

    const updatedTarget = {
      ...target,
      currentHealth: Math.min(target.currentHealth + healAmount, target.maxHealthPoints),
      activeActionStatus: {
        ...target.activeActionStatus,
        isHeal: true
      }
    };

    this.logger.addLog(`💚 ${healer.name} лікує ${target.name} на ${healAmount} HP`);

    console.log('battle-action', updatedTarget)

    return {
      updatedTargets: targets.map(t => t?.id === target?.id ? updatedTarget : t),
      healAmount: healAmount,
    };
  }
}
