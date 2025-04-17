import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  HostBinding,
  ChangeDetectorRef,
  AfterViewChecked, NgZone
} from '@angular/core';
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
import {BattleStateService} from '../battle-services/battle-engine/battle-engine-support-services/battle-state.service';

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

  @Output() effectCompleted = new EventEmitter<keyof IActiveActionStatus>();

  character$ = this.characterSubject.asObservable();

  isActiveTurn$ = this.isActiveTurnSubject.pipe(
    distinctUntilChanged(),
    switchMap(isActive => isActive ? concat(of(true), timer(500).pipe(mapTo(false))) : of(false))
  );
  @HostBinding('style.--evasion-translate-end') translateEvasionEnd = '';
  @HostBinding('style.--hit-translate-end') translateHitEnd = '';

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private stateService: BattleStateService
  ) {}
  ngOnInit() {
    this.character$
      .pipe(
        takeUntil(this.destroy$),
        filter(character => !!character),
      )
      .subscribe(curr => {
        this.counter += 1;

        this.stateService.updateState(state => ({
          ...state,
          [curr.isEnemy ? 'enemies' : 'allies']: state[curr.isEnemy ? 'enemies' : 'allies'].map(character =>
            character.id === curr.id
              ? { ...character, hasUpdatedActionStatus: false }
              : character
          )
        }));
          this.cdr.detectChanges()
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

  private deepCompare(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== typeof obj2) return false;

    if (obj1 === null || obj2 === null) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.deepCompare(obj1[key], obj2[key])) return false;
    }

    return true;
  }
}
