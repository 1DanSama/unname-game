import { Injectable } from '@angular/core';
import {BattleState} from '../battle-engine.service';
import {
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {PositionStrategyFactory} from './position-strategies.service';
import {EnemyInitService} from '../../enemy-init.service';
import {IEnemyPowerSettings} from '../../../../battle-field/dattle-field.model';
import {PartyPowerCalculatorService} from '../../../party-power-calculator.service';

@Injectable({ providedIn: 'root' })
export class BattleInitializationService {
  private baseState: Omit<BattleState, 'allies' | 'enemies' | 'participants' | 'battleRows'> = {
    battleLog: [],
    isBattleInProgress: false,
    currentRound: 1,
    currentTurnIndex: 0,
    damageNumbers: [],
    healNumbers: []
  };

  constructor(
    private positionFactory: PositionStrategyFactory,
    private enemyInit: EnemyInitService,
    private partyPower: PartyPowerCalculatorService,
  ) {}

  createInitialState(recruited: any[], enemyPower: IEnemyPowerSettings): BattleState {
    const allies = recruited.map(c => this.createBattleCharacter(c, false));
    const enemies = this.generateEnemies(allies, enemyPower);

    return {
      ...this.baseState,
      allies,
      enemies,
      participants: this.sortParticipants([...allies, ...enemies]),
      battleRows: this.createBattleRows(allies, enemies)
    };
  }

  private createBattleCharacter(char: any, isEnemy: boolean): IBattleCharacter {
    const strategy = this.positionFactory.getStrategy(char.className);

    return {
      ...char,
      currentHealth: char.maxHealthPoints,
      currentRow: strategy.getStartPosition(isEnemy),
      attackRange: strategy.getAttackRange(),
      movementSpeed: strategy.getMovementSpeed(),
      isEnemy,
      initiative: this.calculateInitiative(char),
      activeActionStatus: this.defaultActionStatus(),
      isActionCompleted: false
    };
  }

  private calculateInitiative(char: any): number {
    return char.agility + Math.random() * 10;
  }

  private defaultActionStatus() {
    return {
      isTakingDamage: false,
      isDead: false,
      isHeal: false,
      isEvaded: false,
      isCriticalDamaged: false
    };
  }

  private sortParticipants(participants: IBattleCharacter[]) {
    return participants
      .filter(p => p.currentHealth > 0)
      .sort((a, b) => b.initiative - a.initiative);
  }

  private createBattleRows(allies: IBattleCharacter[], enemies: IBattleCharacter[]) {
    return [1, 2, 3, 4, 5, 6].map(row => ({
      rowNumber: row,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));
  }

  private generateEnemies(allies: IBattleCharacter[], enemyPower: IEnemyPowerSettings) {
    const partyStats = this.partyPower.calculatePartyStats(allies);
    console.log('partyStats', partyStats)

    return this.enemyInit.generateBalancedEnemies(
      partyStats.totalPower * enemyPower.enemyPowerMultiplier,
      enemyPower.averageLevel || partyStats.averageLevel * enemyPower.enemyLevelMultiplier,
      enemyPower.enemyPartySize || partyStats.partySize * enemyPower.enemyPartySizeMultiplier
    );
  }
}
