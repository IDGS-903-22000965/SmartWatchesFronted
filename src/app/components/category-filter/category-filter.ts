import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.html',
  styleUrls: ['./category-filter.scss']
})
export class CategoryFilterComponent implements OnInit {
  @Input() selectedCategoryId: number | null = null;
  @Output() categoryChanged = new EventEmitter<number | null>();

  categories: Category[] = [];
  loading = true;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  onCategorySelect(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.categoryChanged.emit(categoryId);
  }

  isSelected(categoryId: number | null): boolean {
    return this.selectedCategoryId === categoryId;
  }

  getCategoryIcon(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
      case 'deportivos':
        return 'fas fa-running';
      case 'elegantes':
        return 'fas fa-user-tie';
      case 'básicos':
        return 'fas fa-clock';
      case 'premium':
        return 'fas fa-crown';
      default:
        return 'fas fa-watch';
    }
  }
}