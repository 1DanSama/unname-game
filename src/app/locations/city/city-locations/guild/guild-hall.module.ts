import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdventureCreatorService} from './guild-locations/recruiting-room/recrutes-sandbox/adventures-creator.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [AdventureCreatorService],
})
export class GuildHallModule {}
