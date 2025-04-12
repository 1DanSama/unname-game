import {createReducer, on} from '@ngrx/store';
import {EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {GuildStoreActions} from './guild-store.actions';
import {
  RecruitedAdventures
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {EquipmentSlot, ItemForEquip} from './models/item.model';
import {apprenticeStaff, bronzeSword, commonSword, oakStaff} from './models/mock-default-items.model';
import {BattleStoreActions} from '../battle-store/battle-store.actions';

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
  store: {
    equipment: TEquipmentSlots;
    materials: IMaterials
  }
  baraks: {
    placesInBarrack: number;
    occupiedSeats: number;
  }
}

export const adapter: EntityAdapter<RecruitedAdventures> = createEntityAdapter<RecruitedAdventures>();

export const initialState: IGuildStoreState = adapter.getInitialState({
  gold: 500,
  store: {
    equipment: createDefaultInventory(),
    materials: {
      foodBags: 0,
      woodenBoards: 0,
      stoneBlocks: 0
    }
  },
  baraks: {
    placesInBarrack: 4,
    occupiedSeats: 0
  }
});

export const reducer = createReducer(
  initialState,
  on(GuildStoreActions.increaseGold, (state, { gold }) => ({
    ...state,
    gold: state.gold + gold
  })),
  on(GuildStoreActions.occupiedPlacesInBarrack, (state, { place }) => {
    return {
      ...state,
      baraks: {
        ...state.baraks,
        occupiedSeats: state.baraks.placesInBarrack >= (state.baraks.occupiedSeats + place) ? state.baraks.occupiedSeats + place : state.baraks.placesInBarrack
      }
    }
  }),
  on(GuildStoreActions.decreaseGold, (state, { gold }) => ({
    ...state,
    gold: state.gold - gold
  })),
  on(GuildStoreActions.addMaterials, (state, { materialName, amount }) => {
    const materialKey = materialName as keyof IMaterials;
    return {
      ...state,
      store: {
        ...state.store,
        materials: {
          ...state.store.materials,
          [materialKey]: (state.store.materials[materialKey] || 0) + amount
        }
      }
    };
  }),
  on(GuildStoreActions.removeMaterials, (state, { materialName, amount }) => {
    const materialKey = materialName as keyof IMaterials;
    return {
      ...state,
      store: {
        ...state.store,
        materials: {
          ...state.store.materials,
          [materialKey]: (state.store.materials[materialKey] || 0) - amount
        }
      }
    };
  }),
  on(GuildStoreActions.setEquipmentToStore, (state, { equipment }) => ({
    ...state,
    store: {
      ...state.store,
      equipment: {
        ...state.store.equipment,
        [equipment.slot]: [...(state.store.equipment[equipment.slot] || []), equipment]
      }
    }
  })),
  on(GuildStoreActions.removeEquipmentToStore, (state, { slot, itemId }) => ({
    ...state,
    store: {
      ...state.store,
      equipment: {
        ...state.store.equipment,
        [slot]: (state.store.equipment[slot] || []).filter(item => item.id !== itemId)
      }
    }
  })),
  on(GuildStoreActions.hardSetFromUserLoad, (state, {loadedState}) => loadedState),
);

export const guildStoreReducer = reducer;
