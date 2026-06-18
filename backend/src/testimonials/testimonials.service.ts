import { Injectable } from '@nestjs/common';
import { Testimonial } from '../entities/testimonial.entity';

@Injectable()
export class TestimonialsService {
  private testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Google',
      content: 'JobFinder helped me land my dream job at Google. The platform is intuitive and the job recommendations were spot on!',
      rating: 5,
      avatar: '👩‍💻',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Meta',
      content: 'The best job platform I have ever used. Found multiple offers within weeks of signing up.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UX Designer',
      company: 'Apple',
      content: 'Amazing experience! The filtering options made it easy to find exactly what I was looking for.',
      rating: 4,
      avatar: '👩‍🎨',
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Data Analyst',
      company: 'Amazon',
      content: 'Quick and efficient. Got responses from employers within days.',
      rating: 4,
      avatar: '👨‍🔬',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      role: 'Marketing Director',
      company: 'Netflix',
      content: 'Highly recommend JobFinder to anyone looking for career opportunities. The team is supportive and the platform works great.',
      rating: 5,
      avatar: '👩‍🦰',
    },
    {
      id: 6,
      name: 'David Kim',
      role: 'Full Stack Developer',
      company: 'Microsoft',
      content: 'The job alerts feature is a game changer. Never miss relevant opportunities anymore.',
      rating: 4,
      avatar: '👨‍💻',
    },
  ];

  findAll(): Testimonial[] {
    return this.testimonials;
  }

  findOne(id: number): Testimonial | undefined {
    return this.testimonials.find(t => t.id === id);
  }

  create(data: Partial<Testimonial>): Testimonial {
    const newTestimonial: Testimonial = {
      id: this.testimonials.length + 1,
      name: data.name || '',
      role: data.role || '',
      company: data.company || '',
      content: data.content || '',
      rating: data.rating || 5,
      avatar: data.avatar || '👤',
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  update(id: number, data: Partial<Testimonial>): Testimonial | null {
    const item = this.testimonials.find(t => t.id === id);
    if (item) {
      Object.assign(item, data);
      return item;
    }
    return null;
  }

  remove(id: number): boolean {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      this.testimonials.splice(index, 1);
      return true;
    }
    return false;
  }
}
