import {createReducer, on} from '@ngrx/store';
import {EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {GuildStoreActions} from './guild-store.actions';
import {
  RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {EquipmentSlot, ItemForEquip} from './models/item.model';
import {apprenticeStaff, bronzeSword, commonSword, oakStaff} from './models/mock-default-items.model';

// Updated type with index signature
export type TEquipmentSlots = {
  [key in EquipmentSlot]?: ItemForEquip[];
} & { [key: string]: ItemForEquip[] | undefined };

// Helper function to create default inventory
const createDefaultInventory = (): TEquipmentSlots => {
  const inventory: TEquipmentSlots = {};

  // Initialize all slots with empty arrays
  Object.values(EquipmentSlot).forEach(slot => {
    inventory[slot] = [];
  });

  // Add default weapons
  inventory[EquipmentSlot.Weapon] = [
    commonSword,
    bronzeSword,
    oakStaff,
    apprenticeStaff
  ];

  return inventory;
};

export interface IMaterials {
  foodBags: number,
  woodenBoards: number,
  stoneBlocks: number
}

export interface IGuildStoreState {
  gold: number;
  equipment: TEquipmentSlots;
  materials: IMaterials
}

export const adapter: EntityAdapter<RecruitedAdventures> = createEntityAdapter<RecruitedAdventures>();

export const initialState: IGuildStoreState = adapter.getInitialState({
  gold: 950,
  equipment: createDefaultInventory(),
  materials: {
    foodBags: 0,
    woodenBoards: 0,
    stoneBlocks:0
  }
});

export const reducer = createReducer(
  initialState,
  on(GuildStoreActions.increaseGold, (state, { gold }) => ({
    ...state,
    gold: state.gold + gold
  })),
  on(GuildStoreActions.decreaseGold, (state, { gold }) => ({
    ...state,
    gold: state.gold - gold
  })),
  on(GuildStoreActions.addMaterials, (state, { materialName, amount }) => {
    const materialKey = materialName as keyof typeof state.materials;

    return {
      ...state,
      materials: {
        ...state.materials,
        [materialKey]: (state.materials[materialKey] || 0) + amount
      }
    };
  }),
  on(GuildStoreActions.removeMaterials, (state, { materialName, amount }) => {
    const materialKey = materialName as keyof typeof state.materials;

    return {
      ...state,
      materials: {
        ...state.materials,
        [materialKey]: (state.materials[materialKey] || 0) - amount
      }
    };
  }),
  on(GuildStoreActions.setEquipmentToStore, (state, {equipment}) => ({
    ...state,
    equipment: {
      ...state.equipment,
      [equipment.slot]: [...(state.equipment[equipment.slot] || []), equipment]
    }
  })),
  on(GuildStoreActions.removeEquipmentToStore, (state, {slot, itemId}) => {
    return {
      ...state,
      equipment: {
        ...state.equipment,
        [slot]: (state.equipment[slot] || []).filter(item => item.id !== itemId)
      }
    }
  })
);

export const guildStoreReducer = reducer;
