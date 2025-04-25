import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  BattleRow, IActiveActionStatus,
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

export interface BattleState {
  allies: IBattleCharacter[];
  enemies: IBattleCharacter[];
  participants: IBattleCharacter[];
  battleRows: BattleRow[];
  battleLog: string[];
  isBattleInProgress: boolean;
  currentRound: number;
  currentTurnIndex: number;
  damageNumbers: { id: string; value: number; x: number; y: number }[];
  healNumbers: { id: string; value: number; x: number; y: number }[];
}

// Початковий стан битви
const initialState: BattleState = {
  allies: [],
  enemies: [],
  participants: [],
  battleRows: [],
  battleLog: [],
  isBattleInProgress: false,
  currentRound: 1,
  currentTurnIndex: 0,
  damageNumbers: [],
  healNumbers: []
};

@Injectable({ providedIn: 'root' })
export class BattleStateService {
  private stateStore = new BehaviorSubject<BattleState>(initialState);

  private updateQueue$ = new Subject<(state: BattleState) => BattleState>();

  public state$ = this.stateStore.asObservable();

  constructor() {
    this.updateQueue$
      .pipe(
        concatMap(updater => {
          const currentState = this.stateStore.value;
          const newState = updater(currentState);
          this.stateStore.next(newState);
          return [];
        })
      )
      .subscribe();
  }

  get currentState(): BattleState {
    return this.stateStore.value;
  }

  private queueUpdate(updater: (state: BattleState) => BattleState): void {
    this.updateQueue$.next(updater);
  }

  public updateStateByKey(updates: { key: keyof BattleState; value: any }[]) {
    this.queueUpdate(state => ({
      ...state,
      ...updates.reduce((acc, update) => ({
        ...acc,
        [update.key]: update.value
      }), {})
    }));
  }

  public updateCharacterEffectState(
    characterId: number,
    effects: Partial<IActiveActionStatus>,
    type: 'allies' | 'enemies'
  ) {
    this.queueUpdate(state => ({
      ...state,
      [type]: this.updateCharacterInArray(state[type], characterId, effects)
    }));
  }

  private updateCharacterInArray(
    array: IBattleCharacter[],
    characterId: number,
    effects: Partial<IActiveActionStatus>
  ): IBattleCharacter[] {
    return array.map(character =>
      character.id === characterId
        ? {
          ...character,
          activeActionStatus: {
            ...character.activeActionStatus,
            ...effects
          }
        }
        : character
    );
  }


  public resetState() {
    this.queueUpdate(() => initialState);
  }

  public endBattle() {
    this.queueUpdate(state => ({
      ...state,
      isBattleInProgress: false
    }));
  }
}
