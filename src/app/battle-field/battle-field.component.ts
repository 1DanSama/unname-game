import { Component, Input, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  IActiveActionStatus,
  IBattleCharacter, RecruitedAdventures,
} from '../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {
  selectAllFromBattleStore,
  selectBattleEnemyType,
  selectBattleState,
  selectBattleStateBackground
} from '../store/battle-store/battle-store.selectors';
import { BattleStoreActions } from '../store/battle-store/battle-store.actions';
import {
  takeUntil,
  filter,
  tap,
  first
} from 'rxjs/operators';
import { Observable, Subject} from 'rxjs';
import {AsyncPipe, JsonPipe, NgStyle} from '@angular/common';
import {CharacterEffectsComponent} from '../shared/character-effects/character-effects.component';
import {selectRecruited} from '../store/recruted-adventures/recruited-adventures.selector';
import {EEnemyTypes, enemyPowerSettings} from './dattle-field.model';
import {FasadEngineService} from '../shared/battle-services/battle-engine/fasad-engine.service';
import {BattleState, IBattleStoreState} from '../store/battle-store/battle-store.reducer';

@Component({
  selector: 'app-battle-field',
  templateUrl: './battle-field.component.html',
  imports: [
    AsyncPipe,
    CharacterEffectsComponent,
    NgStyle,
  ],
  styleUrls: ['./battle-field.component.scss']
})
export class BattleFieldComponent implements OnDestroy {
  @Input() animationDelay: number = 400;

  private destroy$ = new Subject<void>();
  battleState$: Observable<IBattleStoreState>;
  backgroundImg$: Observable<string>;
  recruitedAdventures$: Observable<RecruitedAdventures[]>;

  constructor(
    private store: Store,
    private fasadEngine: FasadEngineService,
  ) {
    let enemyType: EEnemyTypes | null;
    this.battleState$ = this.store.select(selectAllFromBattleStore).pipe(filter(data => !!data));
    this.backgroundImg$ = this.store.select(selectBattleStateBackground).pipe(filter(img => !!img));
    this.store.select(selectBattleEnemyType).pipe(filter(type => !!type), first()).subscribe(type => enemyType = type);

    this.recruitedAdventures$ = this.store.select(selectRecruited);

    this.recruitedAdventures$
      .pipe(
        takeUntil(this.destroy$),
        filter(chars => chars && chars.length > 0),
        tap(chars => {
          this.fasadEngine.initializeBattle(chars, enemyPowerSettings[enemyType || 'peoples'], 'null', enemyType || 'peoples' as EEnemyTypes);
        })
      ).subscribe();
  }

  handleEffectComplete(effectProperty:  Partial<IActiveActionStatus>, character: IBattleCharacter) {
    this.store.dispatch(BattleStoreActions.updateCharacterEffectState({id: character.id, effectProperty,  isEnemy: character.isEnemy}))

    // this.stateService.updateCharacterEffectState(character.id, effectProperty, character.isEnemy? 'enemies': 'allies');
  }

  ngOnDestroy() {
    this.store.dispatch(BattleStoreActions.endBattle());
    this.fasadEngine.stopBattle();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
