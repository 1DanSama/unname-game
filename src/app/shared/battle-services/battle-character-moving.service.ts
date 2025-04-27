import { Injectable } from '@angular/core';
import {
  IBattleCharacter, rowPosition
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';

@Injectable({
  providedIn: 'root'
})
export class BattleCharacterMovingService {

  calculateMovement(
    char: IBattleCharacter,
    newRow: rowPosition,
    otherAllies: IBattleCharacter[],
    healerMaxRow: number,
    attackRange: number
  ): { canMove: boolean; updatedChar?: IBattleCharacter; log?: string } {
    if (char.className === CharacterClass.Healer ) {
      if(!char.isEnemy && newRow < healerMaxRow) {
        return { canMove: false };
      } else if (char.isEnemy && newRow > healerMaxRow) {
        return { canMove: false };
      }
    }

    if (char.className === CharacterClass.Healer && otherAllies.length > 0) {
      const farthestAllyRow = Math.max(...otherAllies.map(a => a.currentRow));
      const distanceToFrontline = farthestAllyRow - char.currentRow;

      if (distanceToFrontline <= attackRange) {
        return {
          canMove: false,
          log: `${char.name} stays in position - already within healing range of the frontline (Row ${farthestAllyRow})`
        };
      }
    }

    const updatedChar: IBattleCharacter = {
      ...char,
      previousRow: char.currentRow,
      currentRow: newRow,
      currentAction: 'move'
    };

    return {
      canMove: true,
      updatedChar,
      log: `${char.name} рухається з ряду ${char.currentRow} до ${newRow}`
    };
  }}
