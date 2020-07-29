import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, first, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productWithAdd$,
    this.categorySelectedAction$
      // .pipe(
      //   startWith(0)
      // )
  ]).pipe(
    map(([products, selectedCategoryId]) => {
      return products.filter(p =>
        selectedCategoryId ? p.categoryId === selectedCategoryId : true);
    }),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    }),
  );


  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
  ) { }

  onAdd(): void {
    this.productService.addProduct(null);
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
