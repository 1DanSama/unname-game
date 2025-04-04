import { EquipmentSlot, ItemForEquip, ItemRarity } from './item.model';
import {
  EquipStat, Stat
} from '../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

export const commonSword: ItemForEquip = {
  id: 'sword-1',
  name: 'Rusty Sword',
  description: 'A basic sword showing signs of wear',
  price: 10,
  rarity: ItemRarity.Common,
  slot: EquipmentSlot.Weapon,
  icon: '/assets/equipments/weapons/basic/swords/Iron_Broadsword_Icon.jpg',
  stats: {
    [Stat.Strength]: 2
  },
  equipParams: {
    [EquipStat.PhysicalAttack]: 5,
    [EquipStat.PhysicalArmor]: 1
  }
};

export const bronzeSword: ItemForEquip = {
  id: 'sword-2',
  name: 'Bronze Sword',
  description: 'A slightly better quality bronze blade',
  price: 10,
  icon: '/assets/equipments/weapons/basic/swords/Steel_Bonesaw_Icon.jpg',
  rarity: ItemRarity.Common,
  slot: EquipmentSlot.Weapon,
  stats: {
    [Stat.Strength]: 3,
    [Stat.Agility]: 1
  },
  equipParams: {
    [EquipStat.PhysicalAttack]: 7
  }
};

export const oakStaff: ItemForEquip = {
  id: 'staff-1',
  name: 'Oak Staff',
  description: 'A simple wooden staff for beginners',
  price: 10,
  rarity: ItemRarity.Common,
  slot: EquipmentSlot.Weapon,
  icon: '/assets/equipments/weapons/basic/staffs/Ritual_Wand_Icon.jpg',
  stats: {
    [Stat.Intellect]: 2,
  },
  equipParams: {
    [EquipStat.MagicAttack]: 4,
    [EquipStat.Health]: 10
  }
};

export const apprenticeStaff: ItemForEquip = {
  id: 'staff-2',
  name: "Apprentice's Staff",
  description: 'Basic magical focus for novice mages',
  price: 10,
  rarity: ItemRarity.Common,
  slot: EquipmentSlot.Weapon,
  icon: '/assets/equipments/weapons/basic/staffs/Scepter_Icon.jpg',
  stats: {
    [Stat.Intellect]: 3,
    [Stat.Agility]: 1
  },
  equipParams: {
    [EquipStat.MagicAttack]: 6
  }
};
