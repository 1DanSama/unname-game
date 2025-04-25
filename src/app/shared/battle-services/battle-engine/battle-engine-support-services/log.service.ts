import { Injectable } from '@angular/core';
import {BattleStateService} from './battle-state.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(
    private stateService: BattleStateService,
  ) {}

  public addToLog(messages: string | string[]) {
    const newMessages = Array.isArray(messages) ? messages : [messages];

    this.stateService.updateStateByKey([{key:'battleLog', value: [...newMessages, ...this.stateService.currentState.battleLog]}])
  }
}
