import { Injectable } from '@angular/core';
import {
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {ITargetSelectionStrategy} from '../target-selection.interface';

@Injectable({ providedIn: 'root' })
export class WarriorTargetStrategy implements ITargetSelectionStrategy {
  selectTarget(targets: IBattleCharacter[]): IBattleCharacter {
    const frontRow = targets.filter(t => t.rowPosition === 1);
    return frontRow.length > 0
      ? frontRow[Math.floor(Math.random() * frontRow.length)]
      : targets[Math.floor(Math.random() * targets.length)];
  }
}
