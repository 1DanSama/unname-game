import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {BattleEngineService, BattleState} from '../shared/battle-services/battle-engine/battle-engine.service';
import {
  IBattleCharacter, RecruitedAdventures,
} from '../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {
  selectBattleEnemyType,
  selectBattleState,
  selectBattleStateBackground
} from '../store/battle-store/battle-store.selectors';
import { BattleStoreActions } from '../store/battle-store/battle-store.actions';
import {takeUntil, filter, tap, debounce, debounceTime, distinctUntilChanged, first} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {AsyncPipe, NgStyle} from '@angular/common';
import {CharacterEffectsComponent} from '../shared/character-effects/character-effects.component';
import {selectRecruited} from '../store/recruted-adventures/recruited-adventures.selector';
import {EEnemyTypes, enemyPowerSettings} from './dattle-field.model';

@Component({
  selector: 'app-battle-field',
  templateUrl: './battle-field.component.html',
  imports: [
    AsyncPipe,
    CharacterEffectsComponent,
    NgStyle
  ],
  styleUrls: ['./battle-field.component.scss']
})
export class BattleFieldComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  battleState$: Observable<BattleState>;
  backgroundImg$: Observable<string>;
  recruitedAdventures$: Observable<RecruitedAdventures[]>;

  constructor(
    private store: Store,
    public battleEngine: BattleEngineService
  ) {
    let enemyType: EEnemyTypes | null;
    this.battleState$ = this.store.select(selectBattleState).pipe(filter(data => !!data));
    this.backgroundImg$ = this.store.select(selectBattleStateBackground).pipe(filter(img => !!img));
    this.store.select(selectBattleEnemyType).pipe(filter(type => !!type), first()).subscribe(type => enemyType = type);

    // Sync engine state with store
    this.battleEngine.stateChanged
      .pipe(
        takeUntil(this.destroy$),
        tap(state => {
          this.store.dispatch(BattleStoreActions.updateBattleState({ state }));
        })
      ).subscribe();
    this.recruitedAdventures$ = this.store.select(selectRecruited);


    this.recruitedAdventures$
      .pipe(
        takeUntil(this.destroy$),
        filter(chars => chars && chars.length > 0),
        tap(chars => {
          this.battleEngine.initializeBattle(chars, enemyPowerSettings[enemyType || 'peoples']);
          this.battleEngine.startBattle();
        })
      ).subscribe();
  }

  handleEffectComplete(effectProperty: keyof IBattleCharacter, character: IBattleCharacter) {
    if (this.battleEngine.isInitialized) {
      this.battleEngine.updateCharacterEffectState(character.id, effectProperty, false);
    }
  }

  ngOnDestroy() {
    this.store.dispatch(BattleStoreActions.endBattle());
    this.battleEngine.stopBattle();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
