import { Injectable } from '@nestjs/common';
import { SiteSettings } from '../entities/settings.entity';

@Injectable()
export class SettingsService {
  private settings: SiteSettings = {
    siteName: 'JobFinder',
    tagline: 'Find your dream career today',
    heroTitle: 'Find Your Dream Job Today',
    heroSubtitle: 'Browse thousands of job opportunities from top companies',
    contactEmail: 'contact@jobfinder.com',
    footerText: '© 2024 JobFinder. All rights reserved.',
    maintenanceMode: false,
  };

  getSettings(): SiteSettings {
    return this.settings;
  }

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    Object.assign(this.settings, data);
    return this.settings;
  }
}
