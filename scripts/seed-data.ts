import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a sample advisor first
  const advisor = await prisma.advisor.create({
    data: {
      firmName: 'Capital Partners Advisory',
      teamLead: 'Sarah Mitchell',
      headshotUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
      email: 'sarah@capitalpartners.com.au',
      phone: '+61 2 9876 5432',
      street: 'Level 25, 123 Collins Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      websiteUrl: 'https://capitalpartners.com.au',
      description: 'Specialized in technology and healthcare investments with over 15 years of experience. We help companies secure growth capital and strategic partnerships.',
      specialties: JSON.stringify(['Technology', 'Healthcare', 'SaaS', 'Digital Health', 'AI/ML']),
      status: 'active'
    }
  })

  // Create a sample company with advisor
  const company = await prisma.company.create({
    data: {
      name: 'MediTech Innovations',
      slug: 'meditech-innovations',
      sector: 'Healthcare',
      industry: 'Medical Devices',
      subIndustry: 'Diagnostic',
      description: 'MediTech Innovations is a cutting-edge medical technology company specializing in AI-powered diagnostic imaging solutions. Our proprietary algorithms can detect early-stage diseases with 95% accuracy, revolutionizing patient care and reducing healthcare costs. We have a strong IP portfolio with 12 patents and partnerships with major hospitals across Australia.',
      logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
      websiteUrl: 'https://meditech-innovations.com.au',
      email: 'investors@meditech-innovations.com.au',
      phone: '+61 3 1234 5678',
      street: '456 Bourke Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      latitude: -37.8136,
      longitude: 144.9631,
      tags: JSON.stringify(['AI', 'Medical Devices', 'Diagnostic', 'Healthcare', 'B2B', 'Growth Stage']),
      amountSeeking: '$15M - $25M',
      raisingReason: 'Expansion',
      properties: 'Modern 5,000 sqm facility in Melbourne CBD with state-of-the-art R&D labs, manufacturing capabilities, and clinical testing facilities. Additional satellite offices in Sydney and Brisbane.',
      status: 'published',
      views: 1247,
      advisorId: advisor.id
    }
  })

  // Create another company without advisor
  const company2 = await prisma.company.create({
    data: {
      name: 'GreenEnergy Solutions',
      slug: 'greenenergy-solutions',
      sector: 'Energy',
      industry: 'Renewable',
      subIndustry: 'Solar',
      description: 'Leading provider of commercial solar energy solutions with proprietary battery storage technology. We help businesses reduce energy costs by up to 80% while achieving carbon neutrality goals.',
      logoUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200',
      websiteUrl: 'https://greenenergy-solutions.com.au',
      email: 'info@greenenergy-solutions.com.au',
      phone: '+61 2 8765 4321',
      street: '789 George Street',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      tags: JSON.stringify(['Renewable Energy', 'Solar', 'Battery Storage', 'Sustainability', 'B2B']),
      amountSeeking: '$8M - $12M',
      raisingReason: 'Working Capital',
      properties: 'Headquarters in Sydney CBD with 3,000 sqm office space, warehouse facilities in Western Sydney, and installation teams across NSW, VIC, and QLD.',
      status: 'published',
      views: 892
    }
  })

  console.log('Sample data created successfully!')
  console.log('Advisor:', advisor.firmName)
  console.log('Company 1:', company.name)
  console.log('Company 2:', company2.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
