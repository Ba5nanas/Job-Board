import { Injectable } from '@nestjs/common';
import { Job } from '../entities/job.entity';

@Injectable()
export class JobsService {
  private jobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Bangkok, Thailand',
      type: 'Full-time',
      salary: '฿80,000 - ฿120,000',
      tags: ['React', 'TypeScript', 'Next.js'],
      posted: '2 days ago',
      logo: '🏢',
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '฿70,000 - ฿110,000',
      tags: ['Node.js', 'Python', 'AWS'],
      posted: '1 day ago',
      logo: '🚀',
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Bangkok, Thailand',
      type: 'Contract',
      salary: '฿60,000 - ฿90,000',
      tags: ['Figma', 'Adobe XD', 'Prototyping'],
      posted: '3 hours ago',
      logo: '🎨',
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'CloudFirst',
      location: 'Remote',
      type: 'Full-time',
      salary: '฿90,000 - ฿140,000',
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      posted: '5 hours ago',
      logo: '☁️',
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'DataDriven',
      location: 'Chiang Mai, Thailand',
      type: 'Full-time',
      salary: '฿85,000 - ฿130,000',
      tags: ['Python', 'ML', 'TensorFlow'],
      posted: '1 week ago',
      logo: '📊',
    },
    {
      id: 6,
      title: 'Mobile App Developer',
      company: 'AppWorks',
      location: 'Bangkok, Thailand',
      type: 'Part-time',
      salary: '฿50,000 - ฿80,000',
      tags: ['React Native', 'iOS', 'Android'],
      posted: '4 days ago',
      logo: '📱',
    },
  ];

  findAll(): Job[] {
    return this.jobs;
  }

  findOne(id: number): Job | undefined {
    return this.jobs.find(j => j.id === id);
  }

  create(job: Partial<Job>): Job {
    const newJob: Job = {
      id: this.jobs.length + 1,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || '',
      salary: job.salary || '',
      tags: job.tags || [],
      posted: job.posted || 'Just now',
      logo: job.logo || '🏢',
    };
    this.jobs.push(newJob);
    return newJob;
  }

  remove(id: number): boolean {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      return true;
    }
    return false;
  }
}
