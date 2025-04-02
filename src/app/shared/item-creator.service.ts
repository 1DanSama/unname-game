import {Injectable} from '@angular/core';
import {EquipmentSlot, ItemForEquip} from '../store/guild-store/models/item.model';
import {ArmorCreatorService} from './items-constructor/armor/armor-creator.service';
import {SwordCreatorService} from './items-constructor/weapon/blades/sword-creator.service';
import {StaffCreatorService} from './items-constructor/weapon/staff/staff-creator.service';

@Injectable({providedIn: 'root'})
export class RandomItemGeneratorService {
  private readonly armorSlots: EquipmentSlot[] = [
    EquipmentSlot.Head,
    EquipmentSlot.Neck,
    EquipmentSlot.Shoulders,
    EquipmentSlot.Chest,
    EquipmentSlot.Hands,
    EquipmentSlot.Waist,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
    EquipmentSlot.Ring,
    EquipmentSlot.Trinket,
    EquipmentSlot.OffHand
  ];

  constructor(
    private armorCreator: ArmorCreatorService,
    private swordCreator: SwordCreatorService,
    private staffCreator: StaffCreatorService
  ) {}

  generateRandomItems(
    level: number = 1,
    count: number = 1,
    slot?: EquipmentSlot
  ): ItemForEquip[] {
    return Array.from({ length: Math.max(count, 1) }, () => {
      if (slot) {
        return this.createSpecificItem(slot, level);
      }
      return this.createRandomItem(level);
    });
  }

  private createSpecificItem(slot: EquipmentSlot, level: number): ItemForEquip {
    if (this.isArmorSlot(slot)) {
      return this.armorCreator.createCommonArmor(slot, level);
    }

    if (slot === EquipmentSlot.Weapon) {
      return this.randomizeWeaponType(level);
    }

    throw new Error(`Invalid equipment slot: ${slot}`);
  }

  private createRandomItem(level: number): ItemForEquip {
    const itemType = Math.floor(Math.random() * 3);
    switch (itemType) {
      case 0: return this.generateRandomArmor(level);
      case 1: return this.swordCreator.createCommonSword(level);
      case 2: return this.staffCreator.createCommonStaff(level);
      default: throw new Error('Invalid item type generated');
    }
  }

  private generateRandomArmor(level: number): ItemForEquip {
    const randomIndex = Math.floor(Math.random() * this.armorSlots.length);
    return this.armorCreator.createCommonArmor(this.armorSlots[randomIndex], level);
  }

  private randomizeWeaponType(level: number): ItemForEquip {
    return Math.random() < 0.5
      ? this.swordCreator.createCommonSword(level)
      : this.staffCreator.createCommonStaff(level);
  }

  private isArmorSlot(slot: EquipmentSlot): boolean {
    return this.armorSlots.includes(slot);
  }

  public getArmorSlots(): EquipmentSlot[] {
    return [...this.armorSlots];
  }
}
