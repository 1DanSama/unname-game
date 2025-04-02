import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { recruitedAdventuresReducer } from './store/recruted-adventures/recruited-adventures.reducer';
import { RecruitedAdventuresEffects } from './store/recruted-adventures/recruited-adventures.effects';
import {guildStoreReducer} from './store/guild-store/guild-store.reducer';
import {questStoreReducer} from './store/quest-store/quests-store.reducer';
import {battleStoreFeatureKey, battleStoreReducer} from './store/battle-store/battle-store.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(
      {
        adventuresesState: recruitedAdventuresReducer,
        guildStorState: guildStoreReducer,
        questStorState: questStoreReducer,
        [battleStoreFeatureKey]: battleStoreReducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        }
      }
    ),
    provideEffects([RecruitedAdventuresEffects]),
  ]
};
