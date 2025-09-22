const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create test companies
  const companies = [
    {
      name: 'TechFlow Solutions',
      slug: 'techflow-solutions',
      sector: 'Technology',
      industry: 'Software',
      subIndustry: 'SaaS',
      description: 'Leading provider of cloud-based workflow management solutions for enterprise clients.',
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      websiteUrl: 'https://techflow.com',
      email: 'contact@techflow.com',
      phone: '+61 2 9876 5432',
      street: '123 Collins Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      latitude: -37.8136,
      longitude: 144.9631,
      tags: JSON.stringify(['SaaS', 'Enterprise', 'Cloud']),
      status: 'published',
      views: 150,
      amountSeeking: '$2M - $5M',
      raisingReason: 'Product Development',
      properties: 'Modern office space in Melbourne CBD, cloud infrastructure, IP portfolio',
    },
    {
      name: 'GreenEnergy Solutions',
      slug: 'greenenergy-solutions',
      sector: 'Energy',
      industry: 'Renewable',
      subIndustry: 'Solar',
      description: 'Renewable energy solutions for commercial and residential properties.',
      logoUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200',
      websiteUrl: 'https://greenenergy.com.au',
      email: 'info@greenenergy.com.au',
      phone: '+61 3 8765 4321',
      street: '456 Bourke Street',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      tags: JSON.stringify(['Renewable', 'Solar', 'Sustainability']),
      status: 'published',
      views: 200,
      amountSeeking: '$5M - $10M',
      raisingReason: 'Market Expansion',
      properties: 'Solar panel manufacturing facility, R&D lab, distribution network',
    },
    {
      name: 'HealthTech Innovations',
      slug: 'healthtech-innovations',
      sector: 'Healthcare',
      industry: 'Medical Technology',
      subIndustry: 'Digital Health',
      description: 'Revolutionary AI-powered diagnostic tools for early disease detection.',
      logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
      websiteUrl: 'https://healthtech.com.au',
      email: 'hello@healthtech.com.au',
      phone: '+61 7 2345 6789',
      street: '789 Queen Street',
      suburb: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
      country: 'Australia',
      latitude: -27.4698,
      longitude: 153.0251,
      tags: JSON.stringify(['AI', 'Healthcare', 'Diagnostics']),
      status: 'published',
      views: 120,
      amountSeeking: '$3M - $7M',
      raisingReason: 'Clinical Trials',
      properties: 'Medical research facility, AI computing infrastructure, patent portfolio',
    }
  ]

  for (const company of companies) {
    await prisma.company.create({
      data: company
    })
  }

  console.log('Test companies created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
