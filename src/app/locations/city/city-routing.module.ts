import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';  // Standalone component
import { GuildHallComponent } from './city-locations/guild/guild-hall.component';  // Standalone component
import { MarketComponent } from './city-locations/market/market.component';
import {
  TavernRoomComponent
} from 'app/locations/city/city-locations/guild/guild-locations/recruiting-room/tavern-room.component';
import {BarakComponent} from './city-locations/guild/barak/barak.component';
import {ArenaComponent} from './city-locations/arena/arena.component';
import {TaskBoardComponent} from './city-locations/guild/task-board/task-board.component';  // Standalone component

const routes: Routes = [
  { path: '', component: CityComponent },
  { path: 'guild-hall', component: GuildHallComponent },
  { path: 'guild-hall/tavern', component: TavernRoomComponent},
  { path: 'guild-hall/barak', component: BarakComponent},
  { path: 'guild-hall/task-board', component: TaskBoardComponent},
  { path: 'arena', component: ArenaComponent},
  { path: 'marketplace', component: MarketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule {}
