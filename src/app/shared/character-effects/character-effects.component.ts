import {Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {BehaviorSubject, concat, of, timer, Subject, filter, pairwise} from 'rxjs';
import {switchMap, mapTo, tap, startWith, distinctUntilChanged, takeUntil, map, concatMap} from 'rxjs/operators';
import {
  IBattleCharacter
} from '../../locations/city/city-locations/guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-character-effects',
  templateUrl: './character-effects.component.html',
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./character-effects.component.scss']
})
export class CharacterEffectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private characterSubject = new BehaviorSubject<IBattleCharacter | null>(null);
  private isActiveTurnSubject = new BehaviorSubject<boolean>(false);
   previousHealth: number = this.character?.maxHealthPoints || 0;
   currentHealth: number = this.character?.currentHealth || 0;

  @Input() set character(value: IBattleCharacter | undefined) {
    this.characterSubject.next(value || null);
  }

  @Input() set isActiveTurn(isActiveTurn: boolean) {
    this.isActiveTurnSubject.next(isActiveTurn);
  }

  @Output() effectCompleted = new EventEmitter<keyof IBattleCharacter>();

  character$ = this.characterSubject.asObservable();
  crit$ = this.createEffectStream('isCriticalDamaged');
  evasion$ = this.createEffectStream('isEvaded');
  healing$ = this.createEffectStream('isHeal');
  hit$ = this.createEffectStream('isHit');

  isActiveTurn$ = this.isActiveTurnSubject.pipe(
    distinctUntilChanged(),
    switchMap(isActive => isActive ? concat(of(true), timer(1000).pipe(mapTo(false))) : of(false))
  );

  ngOnInit() {
    this.character$
      .pipe(
        takeUntil(this.destroy$),
        filter(currentHealth => currentHealth !== null),
        tap(character => {
          this.previousHealth = character!.maxHealthPoints;
          this.currentHealth = character!.currentHealth;
        }),
        map(character => character?.currentHealth ?? null),
        distinctUntilChanged()
      )
      .subscribe(currentHealth => {
        this.currentHealth = currentHealth;
    setTimeout((()=> this.previousHealth = currentHealth), 1000)
      });
  }

  constructor(private cdr: ChangeDetectorRef) {}

  private createEffectStream(property: keyof IBattleCharacter) {
    return this.character$.pipe(
      switchMap(character => {
        const isActive = !!character?.[property];
        if (!isActive) return of(false);

        return concat(
          of(true),
          timer(1000).pipe( // Increase timer for animation
            tap(() => {
              this.effectCompleted.emit(property);
              this.cdr.markForCheck(); // Use markForCheck instead of detectChanges
            }),
            mapTo(false)
          )
        );
      }),
      startWith(false),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
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
    concatMap(damage => concat(  // Change from switchMap to concatMap
      of(damage),
      timer(300).pipe(mapTo(null))
    )),
    startWith(null)
  );

  public heal$ = this.healthChange$.pipe(
    filter(([prev, current]) => current > prev),
    map(([prev, current]) => current - prev),
    concatMap(heal => concat(  // Change from switchMap to concatMap
      of(heal),
      timer(500).pipe(mapTo(null))
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
