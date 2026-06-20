# User & Role Architecture Implementation

## Summary

This implementation adds complete separation between Backoffice users and Landing Page users with Role-Based Access Control (RBAC).

## Architecture Overview

### 1. Two Separate User Systems

#### A. Backoffice Users (Admin Portal)
- **Location**: `/api/backoffice/*` endpoints
- **Authentication**: Uses `backoffice/users/register` API endpoint
- **Access**: Can ONLY access Backoffice/Admin Portal

**Backoffice Roles**:
- `super_admin` - Full system access to all entities and settings
- `admin` - Manage users, companies, jobs, applications; limited admin settings
- `content_manager` - Manage content (jobs, testimonials, featured items)
- `support_staff` - View cases, contact candidates, basic operations

**Permissions Matrix**:
```typescript
SUPER_ADMIN: Full access to all permissions
ADMIN: Dashboard, Jobs, Applications, Companies, Users view/edit/delete, Categories, Testimonials
CONTENT_MANAGER: Jobs, Testimonials, Featured, Dashboard
SUPPORT_STAFF: Applications, Candidates, Resumes, Logs (view only)
```

#### B. Landing Page Users (Public Portal)
- **Location**: `/api/auth/landing/*` endpoints  
- **Registration**: Public registration via frontend
- **Two types of users**:

**1. Job Seekers**
- Registration via landing page `register/job-seeker` endpoint
- Features: Profile management, work experience, education, skills, portfolio
- Actions: Apply for jobs, save favorites, upload resume (PDF), track applications

**2. Companies (Organizations)**
- Company registration and profile creation
- Can have multiple team members with different roles

### 2. Company Team Roles & Permissions

#### Owner
- Full access to all company settings
- Manage/add/remove company members
- Upgrade/downgrade subscription package
- Create/manage job postings
- Access billing and payment settings

#### HR / Recruiter  
- Manage job postings (create, edit)
- Review applicants from company dashboard
- Contact candidates via internal messaging
- Cannot modify company ownership or billing

**Permissions by Role**:
```typescript
OWNER:   { jobs: ['view','create','edit','delete'], applications: ['view','contact'], settings: ['view','edit'] }
HR/REC:  { jobs: ['view','create','edit'], applications: ['view','contact'], settings: ['view'] }
```

### 3. Job Posting Limits & Packages

Subscription packages with configurable job posting limits:

| Package Type | Jobs per Month | Price/Month | Features |
|--------------|----------------|-------------|----------|
| Free | 3 | $0 | Basic job posting |
| Standard | 20 | $499 | Branded apply link |
| Premium | 100 | $999 | Social media posts, Analytics |
| Unlimited | ∞ | $2,499 | All features + Priority Support |

**Backoffice Management**: Admins can configure limits for each package and assign packages to companies.

```typescript
interface CompanyPackage {
  planType: 'free'|'standard'|'premium'|'unlimited';
  name: string;
  jobLimit: number;
  pricePerMonth: number;
  features: string[];
}
```

### 4. New API Endpoints Summary

#### Company Management (Landing Page)
```
GET    /api/companies/my-profile              - Get company profile by current user
POST   /api/companies/profile/update          - Update company profile with logo, about, etc.
GET    /api/companies/my-package              - Get current subscription package
PUT    /api/companies/my-package              - Request plan upgrade/downgrade
```

#### Job Posting Controls
```
GET    /api/companies/:companyId/jobs         - List company's job postings
POST   /api/companies/:companyId/jobs/create-check  - Check if can create more jobs
POST   /api/companies/:companyId/job-submit     - Create job (enforces limit checks)
DELETE /api/companies/:companyId/job/:jobId    - Delete job (decrements count)
```

#### Analytics Dashboard
```
GET    /api/companies/dashboard/stats         - Company statistics overview
GET    /api/companies/usage-stats             - Current job usage and limit remaining
```

#### Backoffice Management
```
// User Management
POST   /api/backoffice/users/register         - Register backoffice user
GET    /api/backoffice/users                  - List users with filters (status, email)
PUT    /api/backoffice/users/:id              - Update user role/permissions
DELETE /api/backoffice/users/:id              - Remove user

// Company Management  
GET    /api/backoffice/companies              - List all companies
POST   /api/backoffice/companies/:id/approve  - Approve company registration
POST   /api/backoffice/companies/:id/reject   - Reject company (with reason)
POST   /api/backoffice/companies/:id/suspend  - Suspend company

// Packages
GET    /api/backoffice/packages               - List all available packages
POST   /api/backoffice/packages               - Create new package configuration
PUT    /api/backoffice/packages/:id           - Update package limits/pricing
POST   /api/backoffice/companies/:id/package/update  - Assign package to company

// Job & Application Management
GET    /api/backoffice/jobs                   - List all jobs (can filter by company_id)
POST   /api/backoffice/jobs/approve           - Approve job posting
GET    /api/backoffice/applications           - View applications (company-specific)

// Company Members
GET    /api/backoffice/company-members        - Get members of a company  
POST   /api/backoffice/company-members        - Add new member (with role)
PUT    /api/backoffice/company-members/:id    - Update member details/role
DELETE /api/backoffice/company-members/:id    - Remove member

// Analytics
GET    /api/backoffice/analytics/overview     - Platform-wide statistics
GET    /api/backoffice/analytics/job-stats    - Job posting trends by period
GET    /api/backoffice/logs/activity          - System activity logs
GET    /api/backoffice/logs/security          - Security audit logs
```

### 5. Data Structure

**Company Entity Fields**:
- `name`, `logo`, `coverImage` (NEW)
- `website`, `industry`, `companySize`
- `aboutCompany` (detailed profile)
- `address`, `founded`, `location`
- `contactEmail`, `phone`
- `socials`: [linkedin, facebook, twitter, instagram]
- `status`: 'active' | 'pending' | 'rejected' | 'inactive'
- `isVerified`: boolean (approval flag)
- `packageType`: package subscription level
- `subscriptionStatus`: active/inactive/cancelled/expired

**Backoffice User Entity Fields**:
- `display_name`, `email`
- `user_type`: 'backoffice'
- `back_office_role`: super_admin | admin | content_manager | support_staff
- `permissions`: Array of permission strings
- `status`: active/inactive/suspended

**CompanyUser Entity (Team Members)**:
- `display_name`, `email` (company-specific email)
- `role_name`: owner | hr | recruiter
- `avatar`: profile image
- `permissions`: Object with role-based access
- `status`: active/suspended

### 6. Authentication Flow

#### Landing Page Users
```
1. Registration: POST /api/auth/register/{job-seeker|company}
2. Login:       POST /api/auth/login/{job-seeker|company-owner}
3. Token:       JWT in response, included in Authorization header
```

#### Backoffice Users  
```
1. Registration: POST /api/backoffice/users/register (internal use)
2. Login:       Uses system credentials from database
3. Token:       JWT issued with backoffice-role claim
4. Permission Check: Middleware validates x-backoffice-role header
```

### 7. Installation & Running

```bash
docker compose up -d --build
```

**Available Services**:
- Backend: http://localhost:3001 (NestJS)  
- Landing Page: http://localhost:3000 (Next.js)
- Backoffice: http://localhost:3002 (Admin Portal - Next.js)
- Database: PostgreSQL on port 5432

## Testing Credentials

### Backoffice Users
```
Format: backoffice/{userType}/password123
Examples:
- Email: backoffice/superadmin/password123
- Email: backoffice/admin/password123  
- Email: backoffice/contentmanager/password123 (as UserType)
```

### Landing Page Users (Job Seeker)
```
Username: land-seeker@example.com
Password: password123 (plain text format used for login)
OR use JSON body with actual credentials
```

## Files Created/Modified

### Core Architecture Files
- `entities/company.entity.ts` - Updated with coverImage, packageType fields
- `utils/roles.enum.ts` - Added CompanyUserRole, UserType enums  
- `rbac/permissions.constant.ts` - Complete permission structure
- `job-limits/job-limits.service.ts` - Enhanced package management

### New Service Files
- `backoffice/backoffice.service.ts` - Main backoffice logic
- `companies/companies.service.ts` - Company & member operations
- `landing-page-users/landing-page-users.service.ts` - Public user management
- `job-limits/job-limits.service.ts` - Package configuration

### New Controller Files  
- `backoffice/backoffice.controller.ts` - Backoffice endpoints
- `companies/companies.controller.ts` - Company public endpoints
- `landing-page-users/landing-page-users.controller.ts` - Registration/login

### Entity Files (TypeScript models)
- `users/user.entity.ts` - Separated userType and added enums
- `application_users.application_user.entity.ts` - Job applications
- `company_users.company_user.entity.ts` - Company team members
- `company-packages.package.entity.ts` - Subscription packages

## Key Implementation Details

### Permission System
Permissions follow pattern: `{module}:{action}`
```typescript
Example: 'jobs:view', 'users:create', 'analytics:view'
Roles have default permission arrays configured in BACKOFFICE_ROLE_PERMISSIONS
```

### Company Member Role Hierarchy
1. `owner` (level 1) - Full control, cannot be removed without replacement  
2. `hr/recruiter` (level 2) - Job & application management only  
3. Members restricted to view-only by platform team

### Job Posting Limit Enforcement  
```typescript
Before creating job:
1. Get company's current package -> determine limit
2. Check remaining slots = limit - currentCount
3. If atLimit: return error "Upgrade needed" or show remaining count
4. User must upgrade plan via /package endpoint to create more

After deleting job:- Decrement currentCount immediately
- Status updated in real-time
```
