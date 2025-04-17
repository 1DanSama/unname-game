import { Injectable } from '@angular/core';
import {
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {ITargetSelectionStrategy} from './target-select-services/target-selection.interface';
import {WarriorTargetStrategy} from './target-select-services/target-strategys/warrior-target.service';
import {RogueTargetStrategy} from './target-select-services/target-strategys/rogue-target.service';

@Injectable({ providedIn: 'root' })
export class BattlePriorityService {
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

  getPriorityTarget(attacker: IBattleCharacter, targets: IBattleCharacter[]): IBattleCharacter | null {
    const strategy = this.strategies.get(attacker.className) || this.warriorStrategy;
    return strategy.selectTarget(targets.filter(t => t.currentHealth > 0));
  }
}
