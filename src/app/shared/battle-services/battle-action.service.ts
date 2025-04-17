import {Injectable} from '@angular/core';
import {BattleLoggerService} from './battle-logger.service';
import {DamageCalculationService} from './damage-calculation.service';
import {
  EquipStat,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
import {TargetSelectionService} from './target-select-services/target-selection.service';
import {BattleStateService} from './battle-engine/battle-engine-support-services/battle-state.service';

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
    private logger: BattleLoggerService,
    private stateService: BattleStateService
  ) {
  }

  performAutoAction(
    attacker: IBattleCharacter,
    validTargets: IBattleCharacter[],
    onComplete: (result: IPerformAutoActionResult) => void
  ) {
    let target: IBattleCharacter | null = null;
    const logs: string[] = [];
    const ANIMATION_DURATION = 400;

    if (attacker.currentHealth <= 0) {
      onComplete({
        updatedAttacker: attacker,
        updatedTargets: [],
        logs: [`${attacker.name} is inactive!`]
      });
      return;
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
      onComplete({
        updatedAttacker: {
          ...attacker,
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

        const targetIsEnemy = target.isEnemy;

        this.stateService.updateState(state => ({
          ...state,
          [targetIsEnemy ? 'enemies' : 'allies']: state[targetIsEnemy ? 'enemies' : 'allies'].map(c =>
            c.id === target.id ? {...result[0], hasUpdatedActionStatus: true,} : c
          )
        }));
      } else {
        const attackResult = this.performAttack(attacker, [target]);
        result = attackResult.updatedTargets;
        damageAmount = attackResult.damageAmount;

        const targetIsEnemy = target.isEnemy;
        this.stateService.updateState(state => ({
          ...state,
          [targetIsEnemy ? 'enemies' : 'allies']: state[targetIsEnemy ? 'enemies' : 'allies'].map(c =>
            c.id === target.id ? {...result[0], hasUpdatedActionStatus: true} : c
          )
        }));
      }

      onComplete({
        updatedAttacker: {
          ...attacker,
          isActionCompleted: true
        },
        updatedTargets: result,
        logs,
        damageAmount,
        healAmount
      });
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

    this.addToLog(`${attacker.name} атакує ${target.name} (${totalDamage} шкоди)`);
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

    this.stateService.updateState(state => ({
      ...state,
      battleLog: [...newMessages, ...state.battleLog]
    }));
  }
}
