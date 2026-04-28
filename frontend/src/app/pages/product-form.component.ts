import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductRequest } from '../models';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly categories$ = this.productService.getCategories();
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    stock: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    imageUrl: new FormControl('', { nonNullable: true })
  });

  isEdit = false;
  pending = false;
  errorMessage = '';
  private productId: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = id !== null;
    this.productId = id ? Number(id) : null;

    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe((product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.category.id,
          stock: product.stock,
          imageUrl: product.imageUrl ?? ''
        });
      });
    }
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.categoryId === null) {
      this.errorMessage = 'Category is required.';
      return;
    }

    const request: ProductRequest = {
      name: value.name,
      description: value.description,
      price: value.price,
      categoryId: value.categoryId,
      stock: value.stock,
      imageUrl: value.imageUrl || null
    };

    const save$ =
      this.isEdit && this.productId
        ? this.productService.updateProduct(this.productId, request)
        : this.productService.createProduct(request);

    this.pending = true;
    save$.subscribe({
      next: () => {
        this.pending = false;
        this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.pending = false;
        this.errorMessage = 'Product could not be saved.';
      }
    });
  }
}
