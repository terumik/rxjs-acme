import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of } from 'rxjs';
import { Supplier } from './supplier';
import { map, concatMap, mergeMap, switchMap, shareReplay, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
  .pipe(
    tap(data => console.log(data)),
    shareReplay(1),
    catchError(this.handleError)
  );

  supplierWithMap$ = of(1, 5, 8).pipe(
    map(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithConcatMap$ = of(1, 5, 8).pipe(
    concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithMergeMap$ = of(1, 5, 8).pipe(
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithSwitchMap$ = of(1, 5, 8).pipe(
    switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  constructor(
    private http: HttpClient
  ) {
    // this.supplierWithMap$.subscribe(
    //   o => o.subscribe(
    //     item => console.log(item)
    //   )
    // );

    // this.supplierWithConcatMap$.subscribe(item => console.log('concatMap', item));
    // this.supplierWithMergeMap$.subscribe(item => console.log('mergeMap', item));
    // this.supplierWithSwitchMap$.subscribe(item => console.log('switchMap', item));

  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
