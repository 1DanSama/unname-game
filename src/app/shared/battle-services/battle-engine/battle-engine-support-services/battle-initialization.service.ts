import { Injectable } from '@angular/core';
import {
  IBattleCharacter, rowPosition
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {PositionStrategyFactory} from './position-strategies.service';
import {EnemyInitService} from '../../enemy-init.service';
import {IEnemyPowerSettings} from '../../../../battle-field/dattle-field.model';
import {PartyPowerCalculatorService} from '../../../party-power-calculator.service';
import {BattleState} from '../../../../store/battle-store/battle-store.reducer';

@Injectable({ providedIn: 'root' })
export class BattleInitializationService {
  private baseState: Omit<BattleState, 'allies' | 'enemies' | 'participants' | 'battleRows'> = {
    battleLog: [],
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
      previousRow: strategy.getStartPosition(isEnemy),
      attackRange: strategy.getAttackRange(),
      movementSpeed: strategy.getMovementSpeed(),
      isEnemy: false,
      initiative: this.calculateInitiative(char),
      activeActionStatus: this.defaultActionStatus(),
      isActionCompleted: false,
      canMoveForward: true,
      isActive: true
    };
  }

  private calculateInitiative(char: any): number {
    return char.personalStats.agility + Math.random() * 10;
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
      row: row as rowPosition,
      allies: allies.filter(a => a.currentRow === row),
      enemies: enemies.filter(e => e.currentRow === row)
    }));
  }

  private generateEnemies(allies: IBattleCharacter[], enemyPower: IEnemyPowerSettings) {
    const partyStats = this.partyPower.calculatePartyStats(allies);

    return this.enemyInit.generateBalancedEnemies(
      partyStats.totalPower * enemyPower.enemyPowerMultiplier,
      enemyPower.averageLevel || partyStats.averageLevel * enemyPower.enemyLevelMultiplier,
      enemyPower.enemyPartySize || partyStats.partySize * enemyPower.enemyPartySizeMultiplier
    );
  }
}
