// DungeonArea = 'corridor' | 'room' | 'hall' | 'cave';
export interface IDungeonEvents {
  corridor:IDungeonEvent[];
  room:IDungeonEvent[];
  hall:IDungeonEvent[];
  cave:IDungeonEvent[];
}

export interface IDungeonEvent {
  title: string,
  description: string,
  enemyPowerMultiple?: number,
  enemyType?: string,
  canHarvest: boolean,
  hasLoot: boolean
}

export const dungeonEvents: IDungeonEvents = {
  corridor:[
    {
      title: 'Ambush!',
      description: 'You were attacked by wild goblins.',
      enemyPowerMultiple: 1.4,
      enemyType: 'goblins',
      canHarvest: false,
      hasLoot: false
    },
    {
      title: 'Ambush!',
      description: 'You were attacked by wild animals.',
      enemyPowerMultiple: 1.6,
      enemyType: 'animals',
      canHarvest: false,
      hasLoot: false
    }
  ],
  room:[],
  hall:[],
  cave:[]
}
