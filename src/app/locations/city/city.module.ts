import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component'; // Standalone component
import { GuildHallComponent } from './city-locations/guild/guild-hall.component'; // Standalone component
import { MarketComponent } from './city-locations/market/market.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    CityRoutingModule,
    CityComponent,  // Standalone component
    GuildHallComponent, // Standalone component
    MarketComponent, // Standalone component
    MatTooltipModule
  ]
})
export class CityModule {}
