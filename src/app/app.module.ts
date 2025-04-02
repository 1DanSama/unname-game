import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromQuestsStore from './quests-store.reducer';
import { reducers, metaReducers } from '../reducers';
import * as fromBattleStore from '../reducers/battle-store.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BattleStoreEffects } from '../effects/battle-store.effects';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent,
    StoreModule.forRoot(reducers, { metaReducers }),
    isDevMode() ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forFeature(fromQuestsStore.questsStoresFeatureKey, fromQuestsStore.reducer),
    StoreModule.forFeature(fromBattleStore.battleStoreFeatureKey, fromBattleStore.reducer),
    EffectsModule.forFeature([BattleStoreEffects]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
