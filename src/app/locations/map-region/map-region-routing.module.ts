import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapRegionComponent} from './map-region.component';

const routes: Routes = [
  { path: '', component: MapRegionComponent }
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRegionRoutingModule { }
