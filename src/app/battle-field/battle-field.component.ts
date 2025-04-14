import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import {BattleEngineService, BattleState} from '../shared/battle-services/battle-engine/battle-engine.service';
import {
  IActiveActionStatus,
  IBattleCharacter, RecruitedAdventures,
} from '../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {
  selectBattleEnemyType,
  selectBattleState,
  selectBattleStateBackground
} from '../store/battle-store/battle-store.selectors';
import { BattleStoreActions } from '../store/battle-store/battle-store.actions';
import {
  takeUntil,
  filter,
  tap,
  first,
  distinctUntilChanged,
  throttle,
  switchMap,
  skip,
  share,
  publish
} from 'rxjs/operators';
import {concat, defer, Observable, of, Subject, take, throttleTime} from 'rxjs';
import {AsyncPipe, NgStyle} from '@angular/common';
import {CharacterEffectsComponent} from '../shared/character-effects/character-effects.component';
import {selectRecruited} from '../store/recruted-adventures/recruited-adventures.selector';
import {EEnemyTypes, enemyPowerSettings} from './dattle-field.model';
import {
  BattleStateService
} from '../shared/battle-services/battle-engine/battle-engine-support-services/battle-state.service';

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
    public battleEngine: BattleEngineService,
    private stateService: BattleStateService,
    private cdr: ChangeDetectorRef
  ) {
    let enemyType: EEnemyTypes | null;
    this.battleState$ = this.store.select(selectBattleState).pipe(filter(data => !!data));
    this.backgroundImg$ = this.store.select(selectBattleStateBackground).pipe(filter(img => !!img));
    this.store.select(selectBattleEnemyType).pipe(filter(type => !!type), first()).subscribe(type => enemyType = type);

    // Sync engine state with store
    this.stateService.state$
      .pipe(
        filter(res => !!res),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        share(),
      )
      .pipe(
        publish(shared$ => concat(
          shared$.pipe(take(1)),
          shared$.pipe(skip(1), throttleTime(30))
        ))
      )
      .subscribe(state => {
        this.store.dispatch(BattleStoreActions.updateBattleState({ state }));
      });

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



  handleEffectComplete(effectProperty: keyof IActiveActionStatus, character: IBattleCharacter) {
    this.stateService.isInitialized$.pipe(
      takeUntil(this.destroy$),
      filter(initialized => initialized),
      first()
    ).subscribe(() => {
      this.stateService.updateCharacterEffectState(character.id, effectProperty, false);
    });
  }

  ngOnDestroy() {
    this.store.dispatch(BattleStoreActions.endBattle());
    this.battleEngine.stopBattle();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
