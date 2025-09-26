import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...')
    
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdBy: true
      }
    })
    
    console.log(`Found ${companies.length} companies:`)
    companies.forEach(company => {
      console.log(`- ${company.name} (${company.id}) - ${company.status} - ${company.createdBy}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
