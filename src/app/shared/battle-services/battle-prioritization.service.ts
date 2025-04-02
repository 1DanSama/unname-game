import { Injectable } from '@angular/core';
import {ITargetSelectionStrategy} from './target-selection.interface';
import {WarriorTargetStrategy} from './warrior-target.service';
import {RogueTargetStrategy} from './rogue-target.service';
import {
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

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
    return strategy.selectTarget(targets.filter(t => t.isActive));
  }
}
