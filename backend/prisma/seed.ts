import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const salt = 10

  const superAdminPassword = await bcrypt.hash('password123', salt)
  const adminPassword = await bcrypt.hash('password123', salt)
  const contentManagerPassword = await bcrypt.hash('password123', salt)
  const supportPassword = await bcrypt.hash('password123', salt)
  const financePassword = await bcrypt.hash('password123', salt)

  await prisma.backofficeUser.createMany({
    data: [
      {
        displayName: 'Super Administrator',
        email: 'superadmin@jobfinder.com',
        password: superAdminPassword,
        role: 'SUPER_ADMIN',
        permissions: {
          dashboard: ['view'],
          users: ['view', 'create', 'edit', 'delete'],
          companies: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'suspend'],
          jobs: ['view', 'create', 'edit', 'delete', 'approve'],
          applications: ['view', 'edit'],
          categories: ['view', 'create', 'edit', 'delete'],
          testimonials: ['view', 'create', 'edit', 'delete'],
          featured: ['view', 'create', 'edit', 'delete'],
          packages: ['view', 'create', 'edit', 'delete'],
          settings: ['view', 'edit'],
          roles: ['view', 'create', 'edit', 'delete'],
          analytics: ['view'],
          logs: ['view'],
        },
        status: 'ACTIVE',
      },
      {
        displayName: 'Administrator',
        email: 'admin@jobfinder.com',
        password: adminPassword,
        role: 'ADMIN',
        permissions: {
          dashboard: ['view'],
          users: ['view', 'create', 'edit', 'delete'],
          companies: ['view', 'create', 'edit', 'delete'],
          jobs: ['view', 'create', 'edit', 'delete'],
          applications: ['view'],
          categories: ['view', 'create', 'edit', 'delete'],
          testimonials: ['view', 'create', 'edit', 'delete'],
          featured: ['view', 'create', 'edit', 'delete'],
          settings: ['view', 'edit'],
          analytics: ['view'],
        },
        status: 'ACTIVE',
      },
      {
        displayName: 'Content Manager',
        email: 'contentmanager@jobfinder.com',
        password: contentManagerPassword,
        role: 'CONTENT_MANAGER',
        permissions: {
          dashboard: ['view'],
          jobs: ['view', 'create', 'edit', 'delete'],
          testimonials: ['view', 'create', 'edit', 'delete'],
          featured: ['view', 'create', 'edit', 'delete'],
          categories: ['view', 'create', 'edit', 'delete'],
        },
        status: 'ACTIVE',
      },
      {
        displayName: 'Support Agent',
        email: 'support@jobfinder.com',
        password: supportPassword,
        role: 'SUPPORT_STAFF',
        permissions: {
          dashboard: ['view'],
          users: ['view'],
          companies: ['view'],
          jobs: ['view'],
          applications: ['view'],
          logs: ['view'],
        },
        status: 'ACTIVE',
      },
      {
        displayName: 'Finance Manager',
        email: 'finance@jobfinder.com',
        password: financePassword,
        role: 'FINANCE_MANAGER',
        permissions: {
          dashboard: ['view'],
          companies: ['view'],
          packages: ['view', 'create', 'edit', 'delete'],
          analytics: ['view'],
          settings: ['view', 'edit'],
        },
        status: 'ACTIVE',
      },
    ],
  })

  await prisma.package.createMany({
    data: [
      {
        name: 'Free',
        type: 'FREE',
        description: 'Basic job posting plan',
        jobLimit: 3,
        pricePerMonth: 0,
        features: ['Basic job posting', 'Email support', 'Job analytics'],
        isActive: true,
        isDefault: true,
      },
      {
        name: 'Basic',
        type: 'BASIC',
        description: 'Standard job posting plan',
        jobLimit: 10,
        pricePerMonth: 299,
        features: ['10 job postings', 'Priority support', 'Company branding', 'Basic analytics'],
        isActive: true,
        isDefault: false,
      },
      {
        name: 'Standard',
        type: 'STANDARD',
        description: 'Professional job posting plan',
        jobLimit: 20,
        pricePerMonth: 499,
        features: ['20 job postings', 'Branded apply link', 'Advanced analytics', 'Social media posts', 'Priority support'],
        isActive: true,
        isDefault: false,
      },
      {
        name: 'Premium',
        type: 'PREMIUM',
        description: 'Premium job posting plan',
        jobLimit: 100,
        pricePerMonth: 999,
        features: ['100 job postings', 'All Standard features', 'Social media posts', 'Advanced analytics', 'Dedicated support'],
        isActive: true,
        isDefault: false,
      },
      {
        name: 'Unlimited',
        type: 'UNLIMITED',
        description: 'Unlimited job posting plan',
        jobLimit: -1,
        pricePerMonth: 2499,
        features: ['Unlimited job postings', 'All Premium features', 'API access', 'White-label options', 'Priority support', 'Custom integrations'],
        isActive: true,
        isDefault: false,
      },
    ],
  })

  await prisma.category.createMany({
    data: [
      { name: 'Technology', slug: 'technology', description: 'IT, Software, Engineering', icon: '💻', isActive: true },
      { name: 'Healthcare', slug: 'healthcare', description: 'Medical, Nursing, Pharmacy', icon: '🏥', isActive: true },
      { name: 'Finance', slug: 'finance', description: 'Banking, Accounting, Investment', icon: '💰', isActive: true },
      { name: 'Education', slug: 'education', description: 'Teaching, Training, Research', icon: '📚', isActive: true },
      { name: 'Marketing', slug: 'marketing', description: 'Advertising, PR, Digital Marketing', icon: '📢', isActive: true },
      { name: 'Sales', slug: 'sales', description: 'Business Development, Retail', icon: '🤝', isActive: true },
      { name: 'Engineering', slug: 'engineering', description: 'Civil, Mechanical, Electrical', icon: '⚙️', isActive: true },
      { name: 'Design', slug: 'design', description: 'UI/UX, Graphic, Product Design', icon: '🎨', isActive: true },
    ],
  })

  const testCompanyPassword = await bcrypt.hash('password123', salt)

  await prisma.company.create({
    data: {
      name: 'TechCorp Inc.',
      slug: 'techcorp-inc',
      email: 'hr@techcorp.com',
      password: testCompanyPassword,
      industry: 'Technology',
      companySize: '201-500',
      about: 'Leading technology company specializing in cloud solutions.',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
      contactEmail: 'contact@techcorp.com',
      phone: '+1-555-0100',
      status: 'ACTIVE',
      isVerified: true,
      packageType: 'STANDARD',
      subscriptionStatus: 'ACTIVE',
      maxJobs: 20,
      currentJobs: 0,
      socials: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp',
      },
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
