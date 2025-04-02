import { Injectable } from '@angular/core';
import {dungeonEvents} from './dungeon-events';
import {DungeonArea} from '../base-dungeon.component';

@Injectable({
  providedIn: 'root'
})
export class DungeonEventsService {

  constructor() { }

  getRandomEvent(roomType: DungeonArea, wasVisited: boolean) {
    console.log('roomType', roomType)
    console.log('dungeonEvents', dungeonEvents)
    if(wasVisited && dungeonEvents[roomType]) {
      console.log('dungeonEvents[roomType]',  dungeonEvents[roomType])
      console.log(dungeonEvents[roomType][Math.floor(Math.random()*dungeonEvents[roomType].length)])
    }
  }
}
