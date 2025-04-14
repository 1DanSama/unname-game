import { Injectable } from '@angular/core';
import { CharacterClass } from 'app/store/recruted-adventures/recruted-abventures.model';
import {BattleState} from '../battle-engine.service';
import {
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

interface PositionStrategy {
  getStartPosition(isEnemy: boolean): number;
  getAttackRange(): number;
  getMovementSpeed(): number;
  calculateOptimalPosition(char: IBattleCharacter, state: BattleState): number;
}

@Injectable({ providedIn: 'root' })
export class PositionStrategyFactory {
  getStrategy(className: CharacterClass): PositionStrategy {
    switch (className) {
      case CharacterClass.Warrior:
        return new WarriorPositionStrategy();
      case CharacterClass.Rogue:
        return new RoguePositionStrategy();
      case CharacterClass.Healer:
        return new HealerPositionStrategy();
      default:
        return new MagePositionStrategy();
    }
  }
}

class WarriorPositionStrategy implements PositionStrategy {
  getStartPosition = (isEnemy: boolean) => isEnemy ? 4 : 3;
  getAttackRange = () => 1;
  getMovementSpeed = () => 1;

  calculateOptimalPosition(char: IBattleCharacter, state: BattleState) {
    return char.currentRow;
  }
}

class RoguePositionStrategy implements PositionStrategy {
  getStartPosition = (isEnemy: boolean) => isEnemy ? 5 : 2;
  getAttackRange = () => 1;
  getMovementSpeed = () => 2;

  calculateOptimalPosition(char: IBattleCharacter, state: BattleState) {
    return char.currentRow;
  }
}

class HealerPositionStrategy implements PositionStrategy {
  getStartPosition = (isEnemy: boolean) => isEnemy ? 6 : 1;
  getAttackRange = () => 3;
  getMovementSpeed = () => 1;

  calculateOptimalPosition(char: IBattleCharacter, state: BattleState) {
    return char.currentRow;
  }
}

class MagePositionStrategy implements PositionStrategy {
  getStartPosition = (isEnemy: boolean) => isEnemy ? 6 : 1;
  getAttackRange = () => 3;
  getMovementSpeed = () => 1;

  calculateOptimalPosition(char: IBattleCharacter, state: BattleState) {
    return char.currentRow;
  }
}
