import {Injectable} from '@angular/core';
import {ITargetSelectionStrategy} from './target-selection.interface';
import { WarriorTargetStrategy } from './target-strategys/warrior-target.service';
import {RogueTargetStrategy} from './target-strategys/rogue-target.service';
import {
  IBattleCharacter
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../../store/recruted-adventures/recruted-abventures.model';


@Injectable({ providedIn: 'root' })
export class TargetSelectionService {
  private strategies: Map<string, ITargetSelectionStrategy>;

  constructor(
    private warriorStrategy: WarriorTargetStrategy,
    private rogueStrategy: RogueTargetStrategy
  ) {
    this.strategies = new Map<string, ITargetSelectionStrategy>([
      ['Warrior', this.warriorStrategy],
      ['Rogue', this.rogueStrategy]
    ]);
  }

  selectTarget(attacker: IBattleCharacter, targets: IBattleCharacter[]): IBattleCharacter {
    const strategy = this.strategies.get(attacker.className) || this.warriorStrategy;

    return strategy.selectTarget(targets.filter(t => t.isActive || t.currentHealth > 0));
  }

  public getValidTargets(
    attacker: IBattleCharacter,
    allies: IBattleCharacter[],
    enemies: IBattleCharacter[]): IBattleCharacter[] {

    let targets = this.getValidTargets2(
      attacker,
      allies,
      enemies
    );

    if (attacker.className === CharacterClass.Healer) {
      const needsSelfHeal = attacker.currentHealth < (attacker.maxHealthPoints * 0.8);
      const validSelfTarget = attacker.isActive && attacker.currentHealth > 0;

      if (targets.length === 0 && validSelfTarget && needsSelfHeal) {
        targets = [attacker];
      }
    }

    targets = targets.filter(t =>
      (t.isActive ||
      t.currentHealth > 0) &&
      this.isInAttackRange(attacker, t)
    );

    console.log('targets', targets)
    if (targets.length === 0) {
      return [];
    }

    return targets;
  }

  getValidTargets2(
    attacker: IBattleCharacter,
    allies: IBattleCharacter[],
    enemies: IBattleCharacter[]
  ): IBattleCharacter[] {
    const ownTeam = attacker.isEnemy ? enemies : allies;
    const opposingTeam = attacker.isEnemy ? allies : enemies;

    const availableTargets = attacker.className === CharacterClass.Healer
      ? ownTeam
      : opposingTeam;

    const activeTargets = availableTargets.filter(t => (t?.isActive || t?.currentHealth > 0) && this.isInAttackRange(attacker, t));

    if (attacker.className === CharacterClass.Healer) {
      return this.getHealerTargets(attacker, activeTargets);
    }

    return this.getAttackerTargets(attacker, activeTargets);
  }

  private getHealerTargets(
    healer: IBattleCharacter,
    availableTargets: IBattleCharacter[]
  ): IBattleCharacter[] {
    const injuredTargets = availableTargets.filter(t =>
      t.currentHealth < t.maxHealthPoints
    );

    if (injuredTargets.length === 0 && healer.currentHealth < healer.maxHealthPoints) {
      return [healer];
    }

    return injuredTargets.sort((a, b) =>
      (a.currentHealth / a.maxHealthPoints) - (b.currentHealth / b.maxHealthPoints)
    );
  }

  private getAttackerTargets(
    attacker: IBattleCharacter,
    availableTargets: IBattleCharacter[]
  ): IBattleCharacter[] {
    return availableTargets.filter(target => {
      const distance = Math.abs(attacker.currentRow - target.currentRow);
      return distance <= attacker.attackRange;
    });
  }

  private isInAttackRange(attacker: IBattleCharacter, target: IBattleCharacter): boolean {
    const rowDifference = Math.abs(attacker.currentRow - target.currentRow);
    return rowDifference <= attacker.attackRange;
  }
}
