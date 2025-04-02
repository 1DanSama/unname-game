import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { GuildStoreActions } from './guild-store.actions';


@Injectable()
export class GuildStoreEffects {

  constructor() {}
}
