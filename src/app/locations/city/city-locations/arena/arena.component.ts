import {Component, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { Store } from '@ngrx/store';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {BattleStoreActions} from '../../../../store/battle-store/battle-store.actions';
import {
  RecruitedAdventures
} from '../guild/guild-locations/recruiting-room/recrutes-sandbox/character-creator.interface';
import {selectRecruited} from '../../../../store/recruted-adventures/recruited-adventures.selector';
import {EEnemyTypes} from '../../../../battle-field/dattle-field.model';

@Component({
  selector: 'app-arena',
  standalone: true,
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ]
})
export class ArenaComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  recruitedAdventures$: Observable<RecruitedAdventures[]>;

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.recruitedAdventures$ = this.store.select(selectRecruited);
  }

  startBattle() {
    this.store.dispatch(BattleStoreActions.startBattle({backgroundImg: 'assets/BattleFields/arena-2.png', enemyType: EEnemyTypes.peoples}));
    this.router.navigate(['/battle-field']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
