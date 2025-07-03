import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) { }

  viewProduct() {
    this.router.navigate(['/product', this.product.id]);
  }

  getStockStatus(): string {
    if (this.product.stock === 0) return 'Sin stock';
    if (this.product.stock <= 5) return 'Pocas unidades';
    return 'Disponible';
  }

  getStockClass(): string {
    if (this.product.stock === 0) return 'text-danger';
    if (this.product.stock <= 5) return 'text-warning';
    return 'text-success';
  }
}