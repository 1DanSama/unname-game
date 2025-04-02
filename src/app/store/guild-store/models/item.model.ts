import {
  EquipStat,
  IEquipStats,
  Stat
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

export enum ItemRarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
  Mythic = "Mythic"
}

// Частини тіла/слоти
export enum EquipmentSlot {
  Head = "Head",
  Neck = "Neck",
  Shoulders = "Shoulders",
  Chest = "Chest",
  Hands = "Hands",
  Waist = "Waist",
  Legs = "Legs",
  Feet = "Feet",
  Ring = "Ring",
  Trinket = "Trinket",
  Weapon = "Weapon",
  OffHand = "OffHand"
}

// TODO should be the same as IEquipStats
export interface ItemStats {
  [Stat.Vitality]?: number;
  [Stat.Strength]?: number;
  [Stat.Intellect]?: number;
  [Stat.Agility]?: number;
  [EquipStat.Health]?: number;
  [EquipStat.Mana]?: number;
}

// // TODO should be the same as IEquipStats

// Базовий інтерфейс речі
export interface ItemForEquip {
  id: string;
  name: string;
  description?: string;
  price: number;
  rarity: ItemRarity;
  slot: EquipmentSlot;
  stats: ItemStats;
  equipParams: IEquipStats;
  levelRequirement?: number;
  isUpgradeable?: boolean;
  // setBonus?: {
  //   setName: string;
  //   bonusStats: ItemStats;
  //   itemsRequired: number;
  // };
}
