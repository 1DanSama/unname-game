import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BattleState} from '../battle-engine.service';
import {
  IActiveActionStatus,
  IBattleCharacter
} from '../../../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';

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

@Injectable({providedIn: 'root'})
export class BattleStateService {
  private stateStore = new BehaviorSubject<BattleState>(initialState);

  public state$ = this.stateStore.asObservable();

  private isInitialized = new BehaviorSubject<boolean>(false);
  isInitialized$ = this.isInitialized.asObservable();

  setInitialized(value: boolean) {
    this.isInitialized.next(value);
  }

  get currentState(): BattleState {
    return this.stateStore.value;
  }

  updateState(updater: (state: BattleState) => BattleState) {
    const newState = this.produceNextState(updater);
    console.log('newState', newState)

    this.stateStore.next(newState);
  }

  resetState() {
    this.stateStore.next(initialState);
  }

  private produceNextState(updater: (state: BattleState) => BattleState): BattleState {
    const current = this.stateStore.value;

    const draft = structuredClone(current);

    const newState = updater(draft);

    return newState;
  }

  updateCharacterEffectState(
    characterId: number,
    effect: keyof IActiveActionStatus,
    value: boolean
  ) {
    this.updateState(state => ({
      ...state,
      allies: this.updateCharacterInArray(state.allies, characterId, effect, value),
      enemies: this.updateCharacterInArray(state.enemies, characterId, effect, value)
    }));
  }

  private updateCharacterInArray(array: IBattleCharacter[], characterId: number, effect: keyof IActiveActionStatus, value: boolean) {
    return array.map(c => c.id === characterId ? {
      ...c,
      activeActionStatus: {
        ...c.activeActionStatus,
        [effect]: value
      }
    } : c);
  }
}
