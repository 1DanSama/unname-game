import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {IGuildStoreState, IMaterials} from '../store/guild-store/guild-store.reducer';
import {Store} from '@ngrx/store';
import {getGoldCount, getMaterialsCount} from '../store/guild-store/guild-store.selector';
import {combineLatest, Observable, take} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {getAllActiveQuests} from '../store/quest-store/quest-store.selector';
import {IBaseQuest} from '../locations/city/city-locations/guild/task-board/models/quest-interface';
import {IQuestsStoresState} from '../store/quest-store/quests-store.reducer';
import {MatDialog} from '@angular/material/dialog';
import {QuestsMenueModalComponent} from './header-modals/quests-menue-modal/quests-menue-modal.component';
import {
  GuildResourcesMenueModalComponent
} from './header-modals/guild-resources-menue-modal/guild-resources-menue-modal.component';
import {SaveLoadService} from '../save-load/save-load.service';
import {LoadModalComponent} from '../save-load/load-modal/load-modal.component';

@Component({
  selector: 'app-header',
  imports: [
    AsyncPipe,
    LoadModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLoadModal = false;

  goldCount$: Observable<number>
  quests$: Observable<IBaseQuest[]>
  materials$: Observable<IMaterials>

  showQuestsModal = false;

  constructor(
    private router: Router,
    private readonly guildStore: Store<IGuildStoreState>,
    private readonly questsStore: Store<IQuestsStoresState>,
    private dialog: MatDialog,
    private saveLoad: SaveLoadService,
  ) {
    this.goldCount$ = this.guildStore.select(getGoldCount);
    this.materials$ = this.guildStore.select(getMaterialsCount)
    this.quests$ = this.questsStore.select(getAllActiveQuests);
  }

  goBack() {
    const currentUrl = this.router.url;

    const segments = currentUrl.split('/').filter(segment => segment !== '');
    if(segments.length > 0) {
      segments.pop();
    }

    this.router.navigate(['/' + segments.join('/')]);
  }

  toggleQuestsModal(): void {
    this.quests$.pipe(take(1)).subscribe(quests => {
      this.dialog.open(QuestsMenueModalComponent, {
        data: { quests },
        width: '70vw',
        panelClass: 'quests-modal'
      });
    });
  }

  showResourcesModal(): void {
    combineLatest([this.goldCount$, this.materials$]).pipe(
      take(1)
    ).subscribe(([gold, materials]) => {
      this.dialog.open(GuildResourcesMenueModalComponent, {
        data: { gold, materials },
        width: '70vw',
        panelClass: 'quests-modal'
      });
    });
  }

  saveGame() {
    this.saveLoad.saveGame();
  }

  loadGame() {
    this.saveLoad.saveGame();
  }
}
