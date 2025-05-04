import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';
import {BehaviorSubject, concat, of, timer, Subject, filter, pairwise, throttleTime} from 'rxjs';
import {
  switchMap,
  mapTo,
  startWith,
  distinctUntilChanged,
  takeUntil,
  map,
  concatMap, tap,
} from 'rxjs/operators';
import {
  IActiveActionStatus,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Store} from '@ngrx/store';
import {defaulsBattleState} from '../../store/battle-store/battle-store.reducer';
import {selectBattleState} from '../../store/battle-store/battle-store.selectors';
import {BattleStoreActions} from '../../store/battle-store/battle-store.actions';

@Component({
  selector: 'app-character-effects',
  templateUrl: './character-effects.component.html',
  imports: [
    AsyncPipe,
    NgOptimizedImage
  ],
  styleUrls: ['./character-effects.component.scss']
})
export class CharacterEffectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private characterSubject = new BehaviorSubject<IBattleCharacter | null>(null);
  private isActiveTurnSubject = new BehaviorSubject<boolean>(false);
   currentHealth: number = this.character?.currentHealth || 0;
   isEnemy = false;
   counter = 1;

  @Input() set character(value: IBattleCharacter | undefined) {
    this.isEnemy = value?.isEnemy || false
    this.characterSubject.next(value || null);
    this.translateEvasionEnd = this.isEnemy ? '0, 75%' : '0, -75%';
    this.translateHitEnd = this.isEnemy ? '0, -50%' : '0, 50%'
  }

  @Input() set isActiveTurn(isActiveTurn: boolean) {
    this.isActiveTurnSubject.next(isActiveTurn);
  }

  @Output() effectCompleted = new EventEmitter<Partial<IActiveActionStatus>>();
  private battleStateStoreSubject= new BehaviorSubject(defaulsBattleState);

  character$ = this.characterSubject.asObservable();

  isActiveTurn$ = this.isActiveTurnSubject.pipe(
    distinctUntilChanged(),
    switchMap(isActive => isActive ? concat(of(true), timer(500).pipe(mapTo(false))) : of(false))
  );
  @HostBinding('style.--evasion-translate-end') translateEvasionEnd = '';
  @HostBinding('style.--hit-translate-end') translateHitEnd = '';

  constructor(private cdr: ChangeDetectorRef, private battleStateStore: Store) {
    this.battleStateStore.select(selectBattleState).pipe(
      tap(state => this.battleStateStoreSubject.next(state)),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnInit() {
    this.character$
      .pipe(
        takeUntil(this.destroy$),
        filter(character => !!character),
      )
      .subscribe(curr => {
        this.counter += 1;

        const hasAnyTrue = Object.values(curr.activeActionStatus).some((status: boolean) => status);

        if (hasAnyTrue) {
          // TODO create export initActionStatus obj and reuse it
          const updatedActionStatus: IActiveActionStatus = {
            isTakingDamage: false,
            isHeal: false,
            isDead: false,
            isEvaded: false,
            isCriticalDamaged: false,
          };

          const key = curr.isEnemy ? 'enemies' : 'allies';
          const updatedValue = this.battleStateStoreSubject.value[key].map(character =>
            character.id === curr.id
              ? { ...character, activeActionStatus: updatedActionStatus, hasUpdatedActionStatus: false }
              : character
          );
          // this.stateService.updateStateByKey([{key, value: updatedValue}]);
          this.battleStateStore.dispatch(BattleStoreActions.updateBattleStateData({updates: {[key]: updatedValue}}))


          this.cdr.detectChanges();
        }
      });

  }

  private healthChange$ = this.character$.pipe(
    map(c => c?.currentHealth ?? null),
    filter((v): v is number => v !== null),
    distinctUntilChanged(),
    pairwise()
  );

  public damage$ = this.healthChange$.pipe(
    filter(([prev, current]) => current < prev),
    map(([prev, current]) => prev - current),
    concatMap(damage => concat(
      of(damage),
    )),
    startWith(null)
  );

  public heal$ = this.healthChange$.pipe(
    filter(([prev, current]) => current > prev),
    map(([prev, current]) => current - prev),
    concatMap(heal => concat(
      of(heal),
    )),
    startWith(null)
  );

  getHealthPercentage(character: IBattleCharacter | null): number {
    return character?.maxHealthPoints ? (character.currentHealth * 100) / character.maxHealthPoints : 0;
  }

  getManaPercentage(character: IBattleCharacter | null): number {
    return character?.maxManaPoints ? (character.currentMana * 100) / character.maxManaPoints : 0;
  }

  isManaUser(character: IBattleCharacter | null): boolean {
    return !!character && ['Wizard', 'Healer'].includes(character.className);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
