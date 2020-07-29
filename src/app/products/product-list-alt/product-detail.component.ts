import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap, map, filter } from 'rxjs/operators';
import { EMPTY, Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();


  constructor(
    private productService: ProductService
  ) { }
  productSuppliers$ = this.productService.selectedProductSuppliers$.pipe(
    tap(x => console.log(x)),
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.product$.pipe(
    map(p => p ? `Product Detail for: ${p.productName}` : null)
  );

  vm$ = combineLatest([
    this.product$,
    this.pageTitle$,
    this.productSuppliers$
  ])
  .pipe(
    filter(([product]) => !!product),
    map(([product, pageTitle, productSuppliers]) => {
      return {product, pageTitle, productSuppliers}
    })
  );
}
