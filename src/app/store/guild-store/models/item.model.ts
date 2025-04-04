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
  Gloves = "Gloves",
  Belt = "Belt",
  Legs = "Legs",
  Body = "Body",
  Boots = "Boots",
  Trinket = "Trinket",
  Weapon = "Weapon",
  OffHand = "OffHand",
  Cape = "Cape",
  Ring1 = "Ring1",
  Ring2 = "Ring2",
  Ring3 = "Ring3",
  Ring4 = "Ring4",
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
  icon: string;
  // setBonus?: {
  //   setName: string;
  //   bonusStats: ItemStats;
  //   itemsRequired: number;
  // };
}
