import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { RecruitedAdventuresActions } from './recruited-adventures.actions';


@Injectable()
export class RecruitedAdventuresEffects {

  constructor() {}
}
