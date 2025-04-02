import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './locations/home-page/home-page.component';
import {DialogComponent} from './dialog/dialog.component';
import {BaseDungeonComponent} from './base-dungeon/base-dungeon.component';
import {BattleFieldComponent} from './battle-field/battle-field.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'dialog', component: DialogComponent},
  {path: 'dungeon', component: BaseDungeonComponent},
  {path: 'battle-field', component: BattleFieldComponent},
  {
    path: 'city',
    loadChildren: () => import('./locations/city/city.module').then(m => m.CityModule)
  },
  {
    path: 'map-region',
    loadChildren: () => import('./locations/map-region/map-region.module').then(m => m.MapRegionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}




