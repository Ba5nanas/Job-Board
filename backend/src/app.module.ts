import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsController } from './jobs/jobs.controller';
import { CompaniesController } from './companies/companies.controller';
import { CategoriesController } from './categories/categories.controller';
import { FeaturedController } from './featured/featured.controller';
import { FeaturedService } from './featured/featured.service';
import { TestimonialsController } from './testimonials/testimonials.controller';
import { TestimonialsService } from './testimonials/testimonials.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesModule } from './roles/roles.module';
import { RbacModule } from './rbac/rbac.module';
import { ApplicationsModule } from './applications/applications.module';
import { TagsModule } from './tags/tags.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [RolesModule, RbacModule, ApplicationsModule, TagsModule, FavoritesModule],
  controllers: [AppController, JobsController, CompaniesController, CategoriesController, FeaturedController, TestimonialsController, SettingsController, UsersController],
  providers: [AppService, FeaturedService, TestimonialsService, SettingsService, UsersService],
})
export class AppModule {}
