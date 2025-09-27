import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAndSeed() {
  try {
    console.log('🧹 Clearing existing data...')
    
    // Clear all data
    await prisma.savedListing.deleteMany()
    await prisma.company.deleteMany()
    await prisma.advisor.deleteMany()
    
    console.log('✅ Database cleared')
    
    // Add new test companies
    const testCompanies = [
      {
        name: 'TechFlow Solutions',
        slug: 'techflow-solutions',
        sector: 'Technology',
        industry: 'Software Development',
        subIndustry: 'SaaS',
        description: 'AI-powered workflow automation platform for enterprise clients. Our proprietary machine learning algorithms help businesses streamline operations and reduce costs by up to 40%.',
        logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=face',
        websiteUrl: 'https://techflow-solutions.com',
        email: 'investors@techflow-solutions.com',
        phone: '+61 2 9876 5432',
        street: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia',
        latitude: -37.8136,
        longitude: 144.9631,
        tags: ['SaaS', 'AI', 'B2B', 'Enterprise', 'Automation'],
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop'
        ],
        projectPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop'
        ],
        amountSeeking: '$2M - $5M',
        raisingReason: 'Product development and international expansion',
        properties: 'Modern office space in Melbourne CBD with state-of-the-art development facilities',
        status: 'published',
        createdBy: 'test-user-1'
      },
      {
        name: 'GreenEnergy Co',
        slug: 'greenenergy-co',
        sector: 'Energy',
        industry: 'Renewable Energy',
        subIndustry: 'Solar Technology',
        description: 'Revolutionary solar panel technology with 30% higher efficiency than traditional panels. Our innovative design reduces installation costs and increases energy output for residential and commercial properties.',
        logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        websiteUrl: 'https://greenenergy-co.com.au',
        email: 'investors@greenenergy-co.com.au',
        phone: '+61 3 1234 5678',
        street: '456 Bourke Street',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia',
        latitude: -37.8136,
        longitude: 144.9631,
        tags: ['Renewable Energy', 'Solar', 'Sustainability', 'Clean Tech', 'B2B'],
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop'
        ],
        projectPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop'
        ],
        amountSeeking: '$5M - $10M',
        raisingReason: 'Manufacturing facility expansion and R&D for next-generation panels',
        properties: 'Manufacturing plant in Dandenong with 50,000 sqm production capacity',
        status: 'published',
        createdBy: 'test-user-2'
      },
      {
        name: 'MediCare Plus',
        slug: 'medicare-plus',
        sector: 'Healthcare',
        industry: 'Digital Health',
        subIndustry: 'Telemedicine',
        description: 'Digital health platform connecting patients with healthcare providers through AI-powered matching. Our platform reduces wait times by 60% and improves patient outcomes through personalized care recommendations.',
        logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop&crop=face',
        websiteUrl: 'https://medicare-plus.com.au',
        email: 'investors@medicare-plus.com.au',
        phone: '+61 7 2345 6789',
        street: '789 Queen Street',
        suburb: 'Brisbane',
        state: 'QLD',
        postcode: '4000',
        country: 'Australia',
        latitude: -27.4698,
        longitude: 153.0251,
        tags: ['Digital Health', 'Telemedicine', 'Healthcare', 'AI', 'B2C'],
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop'
        ],
        projectPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop'
        ],
        amountSeeking: '$3M - $7M',
        raisingReason: 'Platform development and healthcare provider partnerships',
        properties: 'Modern office in Brisbane CBD with telemedicine infrastructure',
        status: 'published',
        createdBy: 'test-user-3'
      },
      {
        name: 'AgriTech Innovations',
        slug: 'agritech-innovations',
        sector: 'Agriculture',
        industry: 'Precision Agriculture',
        subIndustry: 'IoT Sensors',
        description: 'Smart farming solutions using IoT sensors and machine learning to optimize crop yields. Our technology helps farmers increase productivity by 25% while reducing water usage by 30%.',
        logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=face',
        websiteUrl: 'https://agritech-innovations.com.au',
        email: 'investors@agritech-innovations.com.au',
        phone: '+61 8 3456 7890',
        street: '321 St Georges Terrace',
        suburb: 'Perth',
        state: 'WA',
        postcode: '6000',
        country: 'Australia',
        latitude: -31.9505,
        longitude: 115.8605,
        tags: ['Agriculture', 'IoT', 'Precision Farming', 'Sustainability', 'B2B'],
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop'
        ],
        projectPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop'
        ],
        amountSeeking: '$1M - $3M',
        raisingReason: 'Sensor development and field testing program',
        properties: 'Research facility in Perth with 10-hectare test farm',
        status: 'published',
        createdBy: 'test-user-4'
      },
      {
        name: 'FinTech Dynamics',
        slug: 'fintech-dynamics',
        sector: 'Finance',
        industry: 'Financial Technology',
        subIndustry: 'Payment Solutions',
        description: 'Next-generation payment processing platform with real-time fraud detection and instant settlements. Our technology reduces transaction costs by 50% and increases security through advanced AI algorithms.',
        logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        websiteUrl: 'https://fintech-dynamics.com.au',
        email: 'investors@fintech-dynamics.com.au',
        phone: '+61 2 8765 4321',
        street: '654 George Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia',
        latitude: -33.8688,
        longitude: 151.2093,
        tags: ['FinTech', 'Payments', 'AI', 'Security', 'B2B'],
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=800&fit=crop'
        ],
        projectPhotos: [
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop'
        ],
        amountSeeking: '$8M - $15M',
        raisingReason: 'Regulatory compliance and international market expansion',
        properties: 'Secure data center in Sydney with 99.9% uptime guarantee',
        status: 'published',
        createdBy: 'test-user-5'
      }
    ]
    
    console.log('🌱 Adding new test companies...')
    
    for (const companyData of testCompanies) {
      const company = await prisma.company.create({
        data: {
          ...companyData,
          tags: JSON.stringify(companyData.tags),
          photos: JSON.stringify(companyData.photos),
          projectPhotos: JSON.stringify(companyData.projectPhotos)
        }
      })
      console.log(`✅ Created company: ${company.name} (${company.id})`)
    }
    
    console.log('🎉 Database cleared and seeded successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAndSeed()
