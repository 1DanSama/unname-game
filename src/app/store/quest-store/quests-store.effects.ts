import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { QuestsStoreActions } from './quests-store.actions';


@Injectable()
export class QuestsStoreEffects {

  // loadQuestsStores$ = createEffect(() => {
  //   return this.actions$.pipe(
  //
  //     ofType(QuestsStoreActions.loadQuestsStores),
  //     concatMap(() =>
  //       /** An EMPTY observable only emits completion. Replace with your own observable API request */
  //       EMPTY.pipe(
  //         map(data => QuestsStoreActions.loadQuestsStoresSuccess({ data })),
  //         catchError(error => of(QuestsStoreActions.loadQuestsStoresFailure({ error }))))
  //     )
  //   );
  // });


  constructor(private actions$: Actions) {}
}
