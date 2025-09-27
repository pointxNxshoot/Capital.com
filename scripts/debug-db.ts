import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database...')
    
    // Check all companies
    const allCompanies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`\n📊 Total companies in database: ${allCompanies.length}`)
    allCompanies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name} (${company.id}) - ${company.status} - ${company.createdAt}`)
    })
    
    // Check if old companies exist
    const oldIds = [
      'cmfs42p0c0008cbdi11b75lmy',
      'cmfs42p0a0004cbdi661fmesy', 
      'cmfs42p0b0006cbdicntzdx4t',
      'cmfxxfvhp0007cbaxg5fjznex'
    ]
    
    console.log('\n🔍 Checking for old company IDs...')
    for (const oldId of oldIds) {
      const company = await prisma.company.findUnique({
        where: { id: oldId },
        select: { id: true, name: true }
      })
      console.log(`${oldId}: ${company ? company.name : 'NOT FOUND'}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDatabase()
