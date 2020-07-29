import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, EMPTY, Subject } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedProduct$ = this.productService.selectedProduct$;

  products$ = this.productService.productWithCategory$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    }),
  );


  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectProductChanged(productId);
  }
}
