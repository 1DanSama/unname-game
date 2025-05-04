import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(
  ) {}

  public addToLog(messages: string | string[]) {
    const newMessages = Array.isArray(messages) ? messages : [messages];

    // this.stateService.updateStateByKey([{key:'battleLog', value: [...newMessages, ...this.stateService.currentState.battleLog]}])
  }
}
