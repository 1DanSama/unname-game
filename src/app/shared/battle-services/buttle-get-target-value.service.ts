`// import { Injectable } from '@angular/core';
// import {
//   IBattleCharacter
// } from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
// import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ButtleGetTargetValueService {
//   getValidTargets(
//     attacker: IBattleCharacter,
//     allies: IBattleCharacter[],
//     enemies: IBattleCharacter[]
//   ): IBattleCharacter[] {
//     // Determine team relationships
//     const ownTeam = attacker.isEnemy ? enemies : allies;
//     const opposingTeam = attacker.isEnemy ? allies : enemies;
//
//     // Select appropriate targets based on character role
//     const availableTargets = attacker.className === CharacterClass.Healer
//       ? ownTeam  // Healers always target their own team
//       : opposingTeam;  // Others target opposing team
//
//     // Filter out inactive targets immediately
//     const activeTargets = availableTargets.filter(t => t.isActive);
//
//     if (attacker.className === CharacterClass.Healer) {
//       return this.getHealerTargets(attacker, activeTargets);
//     }
//
//     return this.getAttackerTargets(attacker, activeTargets);
//   }
//
//   private getHealerTargets(
//     healer: IBattleCharacter,
//     availableTargets: IBattleCharacter[]
//   ): IBattleCharacter[] {
//     // Find injured allies including self
//     const injuredTargets = availableTargets.filter(t =>
//       t.currentHealth < t.maxHealthPoints
//     );
//
//     // If no injured allies but healer is damaged, include self
//     if (injuredTargets.length === 0 && healer.currentHealth < healer.maxHealthPoints) {
//       return [healer];
//     }
//
//     // Prioritize most injured targets
//     return injuredTargets.sort((a, b) =>
//       (a.currentHealth / a.maxHealthPoints) - (b.currentHealth / b.maxHealthPoints)
//     );
//   }
//
//   private getAttackerTargets(
//     attacker: IBattleCharacter,
//     availableTargets: IBattleCharacter[]
//   ): IBattleCharacter[] {
//     // Filter targets in attack range
//     return availableTargets.filter(target => {
//       const distance = Math.abs(attacker.currentRow - target.currentRow);
//       return distance <= attacker.attackRange;
//     });
//   }
// }
`
