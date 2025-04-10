import {Component, Input, Output, EventEmitter, OnDestroy, OnInit, HostBinding} from '@angular/core';
import {BehaviorSubject, concat, of, timer, Subject, filter, pairwise, throttleTime} from 'rxjs';
import {
  switchMap,
  mapTo,
  startWith,
  distinctUntilChanged,
  takeUntil,
  map,
  concatMap,
} from 'rxjs/operators';
import {
  IActiveActionStatus,
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';

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

  @Input() set character(value: IBattleCharacter | undefined) {
    this.isEnemy = value?.isEnemy || false
    this.characterSubject.next(value || null);
    this.translateEvasionEnd = this.isEnemy ? '0, 75%' : '0, -75%';
    this.translateHitEnd = this.isEnemy ? '0, -50%' : '0, 50%'
  }

  @Input() set isActiveTurn(isActiveTurn: boolean) {
    this.isActiveTurnSubject.next(isActiveTurn);
  }

  @Output() effectCompleted = new EventEmitter<keyof IActiveActionStatus>();

  character$ = this.characterSubject.asObservable();

  isActiveTurn$ = this.isActiveTurnSubject.pipe(
    distinctUntilChanged(),
    switchMap(isActive => isActive ? concat(of(true), timer(700).pipe(mapTo(false))) : of(false))
  );
  @HostBinding('style.--evasion-translate-end') translateEvasionEnd = '';
  @HostBinding('style.--hit-translate-end') translateHitEnd = '';

  ngOnInit() {
    this.character$
      .pipe(
        takeUntil(this.destroy$),
        filter(character => !!character),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        const keys = Object.keys(curr.activeActionStatus) as Array<keyof IActiveActionStatus>;

        const changes: Partial<IActiveActionStatus> = {};
        for (const key of keys) {
          if (prev.activeActionStatus[key] !== curr.activeActionStatus[key]) {
            changes[key] = curr.activeActionStatus[key];
            this.effectCompleted.emit(key)
          }
        }

        this.currentHealth = curr.currentHealth;
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
