import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create advisors first
  const advisor1 = await prisma.advisor.create({
    data: {
      firmName: 'Deloitte',
      teamLead: 'Sarah Chen',
      headshotUrl: 'https://www.deloitte.com/global/en/about/people/profiles.prenjen+6060c044.html',
      email: 'sarah.chen@deloitte.com.au',
      phone: '+61 3 9671 7000',
      street: 'Level 1, 225 George Street',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia',
      websiteUrl: 'https://www.deloitte.com/au',
      description: 'Leading professional services firm specializing in M&A and equity transactions.',
      specialties: JSON.stringify(['Technology', 'Healthcare', 'Finance']),
      status: 'active'
    }
  })

  const advisor2 = await prisma.advisor.create({
    data: {
      firmName: 'TCA Partners',
      teamLead: 'Michael Rodriguez',
      headshotUrl: 'https://via.placeholder.com/150/0066CC/FFFFFF?text=MR',
      email: 'michael@tcapartners.com.au',
      phone: '+61 2 9876 5432',
      street: 'Level 15, 123 Collins Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      websiteUrl: 'https://tcapartners.com.au',
      description: 'Boutique investment firm focused on growth-stage companies.',
      specialties: JSON.stringify(['Technology', 'Manufacturing', 'Retail']),
      status: 'active'
    }
  })

  const advisor3 = await prisma.advisor.create({
    data: {
      firmName: 'Saffron Partners',
      teamLead: 'Emma Thompson',
      headshotUrl: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=ET',
      email: 'emma@saffronpartners.com.au',
      phone: '+61 7 3333 4444',
      street: 'Level 8, 100 Eagle Street',
      suburb: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      country: 'Australia',
      websiteUrl: 'https://saffronpartners.com.au',
      description: 'Specialized in healthcare and biotech investments.',
      specialties: JSON.stringify(['Healthcare', 'Biotech', 'Medical Devices']),
      status: 'active'
    }
  })

  // Create companies
  const company1 = await prisma.company.create({
    data: {
      name: 'MediTech Innovations',
      slug: 'meditech-innovations',
      sector: 'Healthcare',
      industry: 'Medical Devices',
      subIndustry: 'Diagnostic',
      description: 'Revolutionary AI-powered diagnostic tools for early disease detection. Our proprietary machine learning algorithms can identify conditions 6 months earlier than traditional methods, potentially saving thousands of lives annually.',
      logoUrl: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=MT',
      websiteUrl: 'https://meditech-innovations.com',
      email: 'contact@meditech-innovations.com',
      phone: '+61 2 9123 4567',
      street: 'Level 5, 100 Harris Street',
      suburb: 'Pyrmont',
      state: 'NSW',
      postcode: '2009',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      tags: JSON.stringify(['Startup', 'AI', 'Healthcare', 'B2B', 'Growth Stage']),
      status: 'published',
      views: 156,
      amountSeeking: '$5M - $10M',
      raisingReason: 'R&D',
      properties: 'Modern office space in Pyrmont with state-of-the-art R&D lab, 15 employees, proprietary AI algorithms, and 3 pending patents.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop'
      ]),
      advisorId: advisor1.id
    }
  })

  const company2 = await prisma.company.create({
    data: {
      name: 'GreenEnergy Solutions',
      slug: 'greenenergy-solutions',
      sector: 'Energy',
      industry: 'Renewable',
      subIndustry: 'Solar',
      description: 'Next-generation solar panel technology with 40% higher efficiency than current market leaders. Our patented design uses advanced materials to capture more sunlight and generate power even in low-light conditions.',
      logoUrl: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=GE',
      websiteUrl: 'https://greenenergy-solutions.com.au',
      email: 'info@greenenergy-solutions.com.au',
      phone: '+61 3 9876 5432',
      street: '123 Renewable Way',
      suburb: 'Port Melbourne',
      state: 'VIC',
      postcode: '3207',
      country: 'Australia',
      latitude: -37.8409,
      longitude: 144.9464,
      tags: JSON.stringify(['Clean Tech', 'Manufacturing', 'B2B', 'Mature', 'Family Business']),
      status: 'published',
      views: 89,
      amountSeeking: '$10M - $25M',
      raisingReason: 'Expansion',
      properties: 'Manufacturing facility in Port Melbourne, 50 employees, 2 production lines, and distribution network across Australia.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1509391366360-2e959bae9c90?w=1200&h=800&fit=crop'
      ]),
      advisorId: advisor2.id
    }
  })

  const company3 = await prisma.company.create({
    data: {
      name: 'FinTech Dynamics',
      slug: 'fintech-dynamics',
      sector: 'Finance',
      industry: 'Fintech',
      subIndustry: 'Digital Banking',
      description: 'Revolutionary mobile banking platform for small businesses. Our AI-driven financial insights help SMBs optimize cash flow, reduce costs, and make smarter financial decisions. Already serving 10,000+ businesses.',
      logoUrl: 'https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=FD',
      websiteUrl: 'https://fintech-dynamics.com',
      email: 'hello@fintech-dynamics.com',
      phone: '+61 7 3333 7777',
      street: 'Level 12, 200 Queen Street',
      suburb: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      country: 'Australia',
      latitude: -27.4698,
      longitude: 153.0251,
      tags: JSON.stringify(['Fintech', 'SaaS', 'B2B', 'Growth Stage', 'Tech Enabled']),
      status: 'published',
      views: 234,
      amountSeeking: '$1M - $5M',
      raisingReason: 'Working Capital',
      properties: 'Modern office in Brisbane CBD, 25 employees, cloud-based infrastructure, and partnerships with 3 major banks.',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop'
      ]),
      advisorId: advisor3.id
    }
  })

  console.log('✅ Created advisors:', { advisor1: advisor1.id, advisor2: advisor2.id, advisor3: advisor3.id })
  console.log('✅ Created companies:', { company1: company1.id, company2: company2.id, company3: company3.id })
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
