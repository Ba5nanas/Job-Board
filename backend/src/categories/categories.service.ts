import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    { id: 1, name: 'Engineering', count: 1240, icon: '💻' },
    { id: 2, name: 'Design', count: 380, icon: '🎨' },
    { id: 3, name: 'Marketing', count: 290, icon: '📣' },
    { id: 4, name: 'Data Science', count: 450, icon: '📊' },
    { id: 5, name: 'Product', count: 210, icon: '📋' },
    { id: 6, name: 'Sales', count: 180, icon: '💼' },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  create(category: Partial<Category>): Category {
    const newCategory: Category = {
      id: this.categories.length + 1,
      name: category.name || '',
      count: category.count || 0,
      icon: category.icon || '',
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  remove(id: number): boolean {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      return true;
    }
    return false;
  }
}
