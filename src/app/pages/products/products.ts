import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryFilterComponent, ProductCardComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  error = '';
  
  searchTerm = '';
  selectedCategoryId: number | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId = +params['category'];
      }
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    if (this.selectedCategoryId) {
      this.loadProductsByCategory(this.selectedCategoryId);
    } else {
      this.loadAllProducts();
    }
  }

  loadAllProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products by category:', error);
        this.error = 'Error al cargar los productos de la categoría';
        this.loading = false;
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    const localFiltered = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredProducts = localFiltered;

    this.productService.searchProducts(searchTerm).subscribe({
      next: (serverProducts) => {
        const allProducts = [...localFiltered];
        serverProducts.forEach(serverProduct => {
          if (!allProducts.find(p => p.id === serverProduct.id)) {
            allProducts.push(serverProduct);
          }
        });
        this.filteredProducts = allProducts;
      },
      error: (error) => {
        console.error('Error searching products:', error);
      }
    });
  }

  onCategoryChanged(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.searchTerm = '';
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
  }

  getResultsText(): string {
    const count = this.filteredProducts.length;
    if (this.searchTerm) {
      return `${count} resultado${count !== 1 ? 's' : ''} para "${this.searchTerm}"`;
    }
    if (this.selectedCategoryId) {
      return `${count} producto${count !== 1 ? 's' : ''} en esta categoría`;
    }
    return `${count} producto${count !== 1 ? 's' : ''} disponibles`;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}