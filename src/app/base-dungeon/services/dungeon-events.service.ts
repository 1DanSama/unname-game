import { Injectable } from '@angular/core';
import {dungeonEvents} from './dungeon-events';
import {DungeonArea} from '../base-dungeon.component';

@Injectable({
  providedIn: 'root'
})
export class DungeonEventsService {

  constructor() { }

  getRandomEvent(roomType: DungeonArea, wasVisited: boolean) {
    if(wasVisited && dungeonEvents[roomType]) {
    }
  }
}
