import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.loadRelatedProducts(product.categoryId);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Producto no encontrado';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      alert(`Agregado al carrito: ${this.quantity} x ${this.product.name}`);
    }
  }

  buyNow(): void {
    if (this.product) {
      alert(`Compra directa: ${this.quantity} x ${this.product.name}`);
    }
  }

  getStockStatus(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Sin stock';
    if (this.product.stock <= 5) return 'Pocas unidades disponibles';
    return `${this.product.stock} unidades disponibles`;
  }

  getStockClass(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'text-danger';
    if (this.product.stock <= 5) return 'text-warning';
    return 'text-success';
  }

  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }
}