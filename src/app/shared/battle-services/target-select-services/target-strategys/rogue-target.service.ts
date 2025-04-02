import { Injectable } from '@angular/core';
import {
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {ITargetSelectionStrategy} from '../target-selection.interface';


@Injectable({ providedIn: 'root' })
export class RogueTargetStrategy implements ITargetSelectionStrategy {
  selectTarget(targets: IBattleCharacter[]): IBattleCharacter {
    return [...targets].sort((a, b) => a.currentHealth - b.currentHealth)[0];
  }
}
