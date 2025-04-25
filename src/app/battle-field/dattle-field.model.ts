export interface IEnemyPowerSettings {
  enemyPowerMultiplier: number;
  enemyLevelMultiplier: number;
  enemyPartySizeMultiplier: number;
  averageLevel: number;
  enemyPartySize: number;
}

export enum EEnemyTypes {
  peoples = 'peoples',
  goblins = 'goblins',
  animals = 'animals',
  cursedAnimals = 'cursedAnimals'
}

export type TEnemyPowerSettings = {
  [key in EEnemyTypes]: IEnemyPowerSettings;
};


export const enemyPowerSettings: TEnemyPowerSettings = {
  // TODO return as was
  peoples: {
    enemyPowerMultiplier: 1,
    enemyLevelMultiplier: 1,
    averageLevel: 1,
    enemyPartySizeMultiplier: 1,
    enemyPartySize: 1,
  },
  goblins: {
    enemyPowerMultiplier: 0.6,
    enemyLevelMultiplier: 1,
    averageLevel: 1,
    enemyPartySizeMultiplier: 3,
    enemyPartySize: 1,
  },
  animals: {
    enemyPowerMultiplier: 2,
    enemyLevelMultiplier: 1,
    averageLevel: 1,
    enemyPartySizeMultiplier: 0.7,
    enemyPartySize: 1,
  },
  cursedAnimals: {
    enemyPowerMultiplier: 4,
    enemyLevelMultiplier: 0,
    averageLevel: 0,
    enemyPartySizeMultiplier: 0.7,
    enemyPartySize: 0,
  },

}
