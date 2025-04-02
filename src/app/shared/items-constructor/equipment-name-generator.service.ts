import { Injectable } from '@angular/core';
import {EquipmentSlot} from '../../store/guild-store/models/item.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentNameGeneratorService {
  private readonly materials = [
    'Iron', 'Steel', 'Oak', 'Leather', 'Silver', 'Bronze', 'Bone',
    'Obsidian', 'Titanium', 'Dragonhide', 'Mithril', 'Ebony', 'Crystal',
    'Silk', 'Wool', 'Chainmail', 'Scale', 'Plate', 'Runed', 'Enchanted'
  ];

  // private readonly itemDescriptors = [
  //   'Sturdy', 'Polished', 'Ancient', 'Gleaming', 'Tempered', 'Reinforced',
  //   'Ornate', 'Engraved', 'Blessed', 'Cursed', 'Ethereal', 'Mystic',
  //   'Shadowy', 'Radiant', 'Burning', 'Frosted', 'Verdant', 'Primal'
  // ];

  private readonly slotParts = {
    [EquipmentSlot.Head]: {
      prefixes: ['Helm', 'Crown', 'Visor', 'Circlet', 'Heaume'],
      suffixes: ['of Insight', 'of Protection', 'of Clarity']
    },
    [EquipmentSlot.Neck]: {
      prefixes: ['Amulet', 'Pendant', 'Locket', 'Choker', 'Torc'],
      suffixes: ['of Wisdom', 'of Vitality', 'of the Serpent']
    },
    [EquipmentSlot.Shoulders]: {
      prefixes: ['Pauldrons', 'Mantle', 'Epaulets', 'Spaulders'],
      suffixes: ['of Strength', 'of Resilience', 'of the Bear']
    },
    [EquipmentSlot.Chest]: {
      prefixes: ['Breastplate', 'Cuirass', 'Hauberk', 'Plackart'],
      suffixes: ['of Fortitude', 'of the Titan', 'of Unyielding']
    },
    [EquipmentSlot.Hands]: {
      prefixes: ['Gauntlets', 'Gloves', 'Handguards', 'Grips'],
      suffixes: ['of Precision', 'of Crafting', 'of the Nimble']
    },
    [EquipmentSlot.Waist]: {
      prefixes: ['Belt', 'Girdle', 'Sash', 'Cincture'],
      suffixes: ['of Power', 'of the Ox', 'of Endurance']
    },
    [EquipmentSlot.Legs]: {
      prefixes: ['Greaves', 'Legguards', 'Chausses', 'Tassets'],
      suffixes: ['of Stability', 'of the Mountain', 'of Stamina']
    },
    [EquipmentSlot.Feet]: {
      prefixes: ['Boots', 'Sabatons', 'Treads', 'Sandals'],
      suffixes: ['of Swiftness', 'of the Zephyr', 'of Travel']
    },
    [EquipmentSlot.Ring]: {
      prefixes: ['Band', 'Ring', 'Loop', 'Circlet'],
      suffixes: ['of Power', 'of Warding', 'of Elements']
    },
    [EquipmentSlot.Trinket]: {
      prefixes: ['Charm', 'Relic', 'Totem', 'Idol'],
      suffixes: ['of Fortune', 'of Mystery', 'of Arcana']
    },
    [EquipmentSlot.Weapon]: {
      prefixes: ['Sword', 'Axe', 'Mace', 'Dagger', 'Staff'],
      suffixes: ['of Sharpness', 'of Ruin', 'of the Adept']
    },
    [EquipmentSlot.OffHand]: {
      prefixes: ['Shield', 'Buckler', 'Tome', 'Orb'],
      suffixes: ['of Defense', 'of Warding', 'of Knowledge']
    }
  };

  generateItemName(slot: EquipmentSlot, name: string): string {
    const parts = this.slotParts[slot];
    const material = this.randomElement(this.materials);
    // const descriptor = this.randomElement(this.itemDescriptors);
    const prefix = this.randomElement(parts.prefixes);
    const suffix = this.randomElement(parts.suffixes);

    return ` ${material} ${prefix} ${suffix} ${name}`;
  }

  private randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
