import {
  EquipmentSlot,
  ItemForEquip,
} from '../../../../../../../store/guild-store/models/item.model';

export interface RecruitedAdventures extends ICharacter {
  id: number;
}

export enum Stat {
  Vitality = 'vitality',
  Strength = 'strength',
  Intellect = 'intellect',
  Agility = 'agility'
}

export enum EquipStat {
  Vitality = 'vitality',
  Strength = 'strength',
  Intellect = 'intellect',
  Agility = 'agility',
  PhysicalArmor = 'physicalArmor',
  MageArmor = 'mageArmor',
  PhysicalAttack = 'physicalAttack',
  MagicAttack = 'magicAttack',
  Health = 'health',
  Mana = 'mana'
}

// TODO should be the same as ItemStats
export interface IPersonalStats {
  [Stat.Vitality]: number;
  [Stat.Strength]: number;
  [Stat.Intellect]: number;
  [Stat.Agility]: number;
}

// TODO should be the same as ItemParams
export interface IEquipStats {
  [EquipStat.PhysicalArmor]?: number;
  [EquipStat.MageArmor]?: number;
  [EquipStat.MagicAttack]?: number;
  [EquipStat.PhysicalAttack]?: number;
  [EquipStat.Health]?: number;
  [EquipStat.Mana]?: number;
  [Stat.Vitality]?: number;
  [Stat.Strength]?: number;
  [Stat.Intellect]?: number;
  [Stat.Agility]?: number;
}

export interface ICharacter {
  className: string;
  name: string;
  characterStats: IPersonalStats;
  personalStats: IPersonalStats;
  equipeStats: IEquipStats;
  maxHealthPoints: number;
  maxManaPoints: number;
  isTemporary: boolean;
  icon: string;
  equipment?: { [key in EquipmentSlot]?: ItemForEquip };
  rowPosition: rowPosition;
  level: number;
  currentClassLevel: number;
}

export type rowPosition = 1 | 2 | 3 | 4 | 5 | 6;

export interface IBattleCharacter extends RecruitedAdventures {


  lastDamage?: number;
  lastHeal?: number;
  // Основні бойові параметри
  currentHealth: number;
  currentMana: number;
  isEnemy: boolean;
  initiative: number;
  isActive: boolean;
  armor?: number;

  // Анімації та дії
  currentAction?: 'attack' | 'heal' | 'move' | 'preparing';
  actionTargetId?: number | null;

  // Позиціонування
  currentRow: rowPosition;
  maxRow: rowPosition;
  attackRange: number; // Дальність атаки

  // Статистика руху
  canMoveForward: boolean;
  movementSpeed: number;
  previousRow: rowPosition;

  isHit: boolean;
  isHeal: boolean;
  isDead: boolean;
  isEvaded: boolean;
  isCriticalDamaged: boolean;
  isActionCompleted: boolean;
}

export interface ICharacterCreator {
  create(level: number): ICharacter;
}

export type BattleRow = {
  row: rowPosition;
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
};
