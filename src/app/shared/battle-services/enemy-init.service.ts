import { Injectable } from '@angular/core';
import { CharacterDataCreatorService } from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-data-creator.service';
import {ItemServicesService} from '../item-services/item-services.service';
import {CountTotalStatsService} from './count-total-stats.service';
import {
  IBattleCharacter, IPersonalStats, rowPosition
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {CharacterClass} from '../../store/recruted-adventures/recruted-abventures.model';
import {
  getRowClassPosition
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/classes/classes.model';

@Injectable({
  providedIn: 'root'
})
export class EnemyInitService {
  constructor(
    private characterDataCreatorService: CharacterDataCreatorService,
    private itemServicesService: ItemServicesService,
    private countTotalStatsService: CountTotalStatsService
  ) {}

  generateBalancedEnemies(
    targetPower: number,
    averageLevel: number,
    partySize: number,
    healthMultiplier = 1.5,
    attackMultiplier = 1.2,
    intellectMultiplier = 1.0,
    agilityMultiplier = 1.0
  ): IBattleCharacter[] {
    const enemies: IBattleCharacter[] = [];
    const enemyCount = this.calculateEnemyCount(partySize);
    const powerPerEnemy = targetPower / enemyCount;

    for (let i = 0; i < enemyCount; i++) {
      const enemyLevel = this.getEnemyLevel(averageLevel);
      const enemy = this.createEnemy(
        enemyLevel,
        powerPerEnemy,
        i,
        healthMultiplier,
        attackMultiplier,
        intellectMultiplier,
        agilityMultiplier,
        this.getRandomClass()
      );
      enemies.push(enemy);
    }

    return enemies;
  }

  private createEnemy(
    level: number,
    powerPerEnemy: number,
    index: number,
    healthMultiplier: number,
    attackMultiplier: number,
    intellectMultiplier: number,
    agilityMultiplier: number,
    className: CharacterClass
  ): IBattleCharacter {
    const baseCharacter = this.characterDataCreatorService.create(
      level,
      className,
      true
    );

    const modifiedStats = this.scaleStats(
      baseCharacter.personalStats,
      healthMultiplier,
      attackMultiplier,
      intellectMultiplier,
      agilityMultiplier
    );

    const equipment = this.itemServicesService.generateFullEquipmentSet(level, CharacterClass.Warrior);
    const equipeStats = this.itemServicesService.calculateEquipmentStats(equipment);

    const iconVariations = 4;
    const randomIcon = Math.floor(Math.random() * iconVariations) + 1;
    const iconPath = `assets/${className}/${className.toLowerCase()}-${randomIcon}.jpg`;

    return {
      ...baseCharacter,
      id: -index,
      name: `Гоблін ${index + 1}`,
      isEnemy: true,
      isActive: true,
      activeActionStatus: {
        isTakingDamage: false,
        isHeal: false,
        isDead: false,
        isEvaded: false,
        isCriticalDamaged: false,
      },
      isActionCompleted: false,
      actionTargetId: null,
      canMoveForward: true,
      movementSpeed: 1,
      currentAction: undefined,
      previousRow: this.getEnemyStartPosition(className),
      currentRow: this.getEnemyStartPosition(className),
      maxRow: this.getEnemyMaxRow(className),
      attackRange: this.getEnemyAttackRange(className),
      initiative: modifiedStats.agility + Math.random() * 10,
      armor: equipeStats.physicalArmor || 0,

      // Stats
      personalStats: modifiedStats,
      equipeStats: equipeStats,
      characterStats: this.countTotalStatsService.calculateTotalStats(modifiedStats, equipeStats),

      // Health/Mana
      currentHealth: baseCharacter?.maxHealthPoints * healthMultiplier,
      currentMana: baseCharacter?.maxManaPoints,

      // Equipment
      equipment: equipment,

      // Level/Position
      level: level,
      currentClassLevel: 1, // Додаємо default значення
      rowPosition: getRowClassPosition(className),

      icon: iconPath,
    };
  }

  private scaleStats(
    baseStats: IPersonalStats,
    healthMult: number,
    attackMult: number,
    intellectMult: number,
    agilityMult: number
  ): IPersonalStats {
    return {
      vitality: Math.floor(baseStats.vitality * healthMult),
      strength: Math.floor(baseStats.strength * attackMult),
      intellect: Math.floor(baseStats.intellect * intellectMult),
      agility: Math.floor(baseStats.agility * agilityMult)
    };
  }

  private calculateEnemyCount(partySize: number): number {
    return Math.max(1, Math.floor(partySize * 0.8 + Math.random() * 2));
  }

  private getEnemyLevel(averageLevel: number): number {
    const variance = Math.ceil(averageLevel * 0.2);
    const min = Math.max(1, averageLevel - variance);
    const max = averageLevel + variance;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getEnemyStartPosition(className: string): rowPosition {
    if (className.includes(CharacterClass.Warrior)) return 4;
    if (className.includes(CharacterClass.Rogue)) return 5;
    if (className.includes(CharacterClass.Wizard) || className.includes(CharacterClass.Healer)) return 6;
    return 6;
  }

  private getEnemyMaxRow(className: string): rowPosition {
    return 1;
  }

  private getEnemyAttackRange(className: string): number {
    switch (className) {
      case CharacterClass.Warrior:
      case CharacterClass.Rogue:
        return 1;
      case CharacterClass.Wizard:
      case CharacterClass.Healer:
        return 3;
      default:
        return 1;
    }  }

  private getRandomClass(): CharacterClass {
    const values = Object.values(CharacterClass) as CharacterClass[];

    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  }
}
