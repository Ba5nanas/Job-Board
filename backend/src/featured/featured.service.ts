import { Injectable } from '@nestjs/common';
import { FeaturedJob } from '../entities/featured.entity';

@Injectable()
export class FeaturedService {
  private featured: FeaturedJob[] = [
    {
      id: 1,
      jobId: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Bangkok, Thailand',
      type: 'Full-time',
      salary: '฿80,000 - ฿120,000',
      tags: ['React', 'TypeScript', 'Next.js'],
      logo: '🏢',
    },
    {
      id: 2,
      jobId: 4,
      jobTitle: 'DevOps Engineer',
      company: 'CloudFirst',
      location: 'Remote',
      type: 'Full-time',
      salary: '฿90,000 - ฿140,000',
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      logo: '☁️',
    },
    {
      id: 3,
      jobId: 5,
      jobTitle: 'Data Scientist',
      company: 'DataDriven',
      location: 'Chiang Mai, Thailand',
      type: 'Full-time',
      salary: '฿85,000 - ฿130,000',
      tags: ['Python', 'ML', 'TensorFlow'],
      logo: '📊',
    },
  ];

  findAll(): FeaturedJob[] {
    return this.featured;
  }

  findOne(id: number): FeaturedJob | undefined {
    return this.featured.find(f => f.id === id);
  }

  create(data: Partial<FeaturedJob>): FeaturedJob {
    const newFeatured: FeaturedJob = {
      id: this.featured.length + 1,
      jobId: data.jobId || 0,
      jobTitle: data.jobTitle || '',
      company: data.company || '',
      location: data.location || '',
      type: data.type || '',
      salary: data.salary || '',
      tags: data.tags || [],
      logo: data.logo || '🏢',
    };
    this.featured.push(newFeatured);
    return newFeatured;
  }

  update(id: number, data: Partial<FeaturedJob>): FeaturedJob | null {
    const item = this.featured.find(f => f.id === id);
    if (item) {
      Object.assign(item, data);
      return item;
    }
    return null;
  }

  remove(id: number): boolean {
    const index = this.featured.findIndex(f => f.id === id);
    if (index !== -1) {
      this.featured.splice(index, 1);
      return true;
    }
    return false;
  }
}
