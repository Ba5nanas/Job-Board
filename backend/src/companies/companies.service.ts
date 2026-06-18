import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompaniesService {
  private companies: Company[] = [
    { id: 1, name: 'Google' },
    { id: 2, name: 'Microsoft' },
    { id: 3, name: 'Amazon' },
    { id: 4, name: 'Meta' },
    { id: 5, name: 'Apple' },
    { id: 6, name: 'Netflix' },
    { id: 7, name: 'Spotify' },
    { id: 8, name: 'Uber' },
  ];

  findAll(): Company[] {
    return this.companies;
  }

  create(company: Partial<Company>): Company {
    const newCompany: Company = {
      id: this.companies.length + 1,
      name: company.name || '',
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  remove(id: number): boolean {
    const index = this.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.companies.splice(index, 1);
      return true;
    }
    return false;
  }
}
