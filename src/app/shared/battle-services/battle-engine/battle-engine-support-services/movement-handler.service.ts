import { Injectable } from '@angular/core';
import { BattleStateService } from './battle-state.service';
import {
  IBattleCharacter, rowPosition
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../../../store/recruted-adventures/recruted-abventures.model';
import {BattleCharacterMovingService} from '../../battle-character-moving.service';
import {LogService} from './log.service';

@Injectable({ providedIn: 'root' })
export class MovementHandlerService {
  constructor(
    private logService: LogService,
    private stateService: BattleStateService,
    private battleMoving: BattleCharacterMovingService
  ) {}


  public handleNoTargets(attacker: IBattleCharacter) {
    const movement = attacker.movementSpeed;
    let newRow: rowPosition;

    if (attacker.isEnemy) {
      newRow = Math.max(1, attacker.currentRow - movement) as rowPosition;
    } else {
      newRow = Math.min(6, attacker.currentRow + movement) as rowPosition;
    }

    if (newRow !== attacker.currentRow) {
      this.moveCharacter(attacker, newRow);
    } else {
      this.logService.addToLog(`${attacker.name} couldn't move!`);
    }
  }

  private moveCharacter(char: IBattleCharacter, newRow: rowPosition) {
    const { allies, enemies } = this.stateService.currentState;
    const team = char.isEnemy ? enemies : allies;
    const otherAllies = team.filter(member =>
      member.id !== char.id &&
      member.className !== CharacterClass.Healer
    );

    const movementResult = this.battleMoving.calculateMovement(
      char,
      newRow,
      otherAllies,
      char.maxRow,
      char.attackRange
    );

    if (!movementResult.canMove) {
      if (movementResult.log) this.logService.addToLog(movementResult.log);
      return;
    }

    const updatedChar = {
      ...movementResult.updatedChar,
      previousRow: char.currentRow,
      currentRow: newRow,
      currentAction: 'move',
      activeActionStatus: { ...char.activeActionStatus }
    };

    const updatedArray = char.isEnemy
      ? enemies.map(c => c.id === char.id ? updatedChar : {...c})
      : allies.map(c => c.id === char.id ? updatedChar : {...c});

    this.stateService.updateStateByKey([{key: char.isEnemy ? 'enemies' : 'allies', value: updatedArray}])

    this.logService.addToLog(movementResult.log!);
    this.updateBattleRows();
  }

  public updateBattleRows() {
    const { allies, enemies } = this.stateService.currentState;

    const battleRows = [1, 2, 3, 4, 5, 6].map(row => ({
      row: row as rowPosition,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));

    this.stateService.updateStateByKey([{key:'battleRows', value: battleRows}])
  }
}
