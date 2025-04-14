// import { Injectable } from '@angular/core';
// import { BattleStateService } from './battle-state.service';
// import {
//   IBattleCharacter
// } from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
// import {BattleState} from '../battle-engine.service';
// import {PositionStrategyFactory} from './position-strategies.service';
// import {CharacterClass} from '../../../../store/recruted-adventures/recruted-abventures.model';
//
// @Injectable({ providedIn: 'root' })
// export class MovementHandlerService {
//   constructor(
//     private state: BattleStateService,
//     private positionFactory: PositionStrategyFactory
//   ) {}
//
//   calculateNewPosition(char: IBattleCharacter): number {
//     const strategy = this.positionFactory.getStrategy(char.className as CharacterClass);
//     return strategy.calculateOptimalPosition(char, this.state.currentState);
//   }
//
//   moveCharacter(char: IBattleCharacter, newRow: number) {
//     this.state.updateState(state => {
//       const updated = this.updateCharacterPosition(state, char, newRow);
//       return this.addMovementLog(updated, char, newRow);
//     });
//   }
//
//   private updateCharacterPosition(state: BattleState, char: IBattleCharacter, newRow: number) {
//     const collection = char.isEnemy ? 'enemies' : 'allies';
//     return {
//       ...state,
//       [collection]: state[collection].map(c =>
//         c.id === char.id ? { ...c, currentRow: newRow } : c
//       )
//     };
//   }
//
//   private addMovementLog(state: BattleState, char: IBattleCharacter, newRow: number) {
//     return {
//       ...state,
//       battleLog: [
//         `${char.name} moved to row ${newRow}`,
//         ...state.battleLog
//       ]
//     };
//   }
// }
