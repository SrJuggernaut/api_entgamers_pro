const { PrismaClient } = require('@prisma/client')
const prismaClient = new PrismaClient()

const seed = async () => {
  const userScopes = [
    'profile:get-self',
    'profile:update-self'
  ]
  const moderatorScopes = [
    ...userScopes
  ]
  const collaboratorScopes = [
    ...moderatorScopes
  ]
  const adminScopes = [
    ...collaboratorScopes,
    'profile:get',
    'profile:update'
  ]
  try {
    const userRole = await prismaClient.role.upsert({
      where: {
        name: 'user'
      },
      create: {
        name: 'user',
        scopes: userScopes
      },
      update: {
        name: 'user',
        scopes: userScopes
      }
    })
    const moderatorRole = await prismaClient.role.upsert({
      where: {
        name: 'moderator'
      },
      create: {
        name: 'moderator',
        scopes: moderatorScopes
      },
      update: {
        name: 'moderator',
        scopes: moderatorScopes
      }
    })
    const collaboratorRole = await prismaClient.role.upsert({
      where: {
        name: 'collaborator'
      },
      create: {
        name: 'collaborator',
        scopes: collaboratorScopes
      },
      update: {
        name: 'collaborator',
        scopes: collaboratorScopes
      }
    })
    const adminRole = await prismaClient.role.upsert({
      where: {
        name: 'admin'
      },
      create: {
        name: 'admin',
        scopes: adminScopes
      },
      update: {
        name: 'admin',
        scopes: adminScopes
      }
    })
    if (userRole && moderatorRole && collaboratorRole && adminRole) {
      console.log('🌱 Roles seeded successfully!')
    }

    await prismaClient.$disconnect()
  } catch (error) {
    console.error('Error seeding database: ', error)
    process.exit(1)
  }
}

seed()
