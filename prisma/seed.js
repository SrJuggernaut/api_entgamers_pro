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
    'profile:update',
    'home:get',
    'home:update'
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

    const existHome = await prismaClient.home.findFirst()
    if (!existHome) {
      const home = await prismaClient.home.create({
        data: {
          seo: {
            title: 'Home - EntGamers',
            description: 'EntGamers es una comunidad de jugadores que comparten la misma pasión por los juegos.',
            image: 'https://i.picsum.photos/id/881/1200/630.jpg?hmac=undri1RE2oJTlxRB0sR2mmiRA8BYK-rffBCA1sYutXk'
          },
          heroTitle: 'EntGamers',
          heroSubtitle: 'Comunidad Gamer',
          heroImage: 'https://cdn.entgamers.pro/static/logo/notext/EntGamers.png',
          clanesTitle: 'Clanes',
          clanesDescription: 'Los clanes son espacios donde compartir nuestros gustos con otros usuarios, dándonos la oportunidad de organizar proyectos y eventos en los cuales formar parte.',
          clanesButtonText: 'Ver los clanes',
          clanesImage: 'https://i.picsum.photos/id/1075/1200/630.jpg?hmac=eoCq8ofRxrnpFHvkQJauplXFeRNI9fTCrcPJSSYiLDU',
          socialNetworksTitle: 'Nuestras redes sociales',
          socialNetworks: [
            {
              name: 'facebook',
              description: 'Puedes seguirnos en Facebook para ver memes sobre videojuegos, información sobre los Clanes,  la comunidad, eventos, etc. o formar parte del grupo para interactuar mas de cerca con otros integrantes de la comunidad',
              buttons: [
                {
                  text: 'Síguenos en Facebook',
                  url: 'https://www.facebook.com/EntGamers/'
                },
                {
                  text: 'Únete al grupo',
                  url: 'https://www.facebook.com/groups/EntGamers/'
                }
              ]
            },
            {
              name: 'twitter',
              description: 'Puedes seguirnos en Twitter para ver memes sobre videojuegos, información sobre los Clanes, la comunidad, eventos, etc.',
              buttons: [
                {
                  text: 'Síguenos en Twitter',
                  url: 'https://twitter.com/EntGamers'
                }
              ]
            }
          ],
          teamTitle: 'Equipo',
          teamJoinButtonText: '¡Únete a nuestro equipo!',
          teamViewButtonText: 'Ver el equipo'
        }
      })
      if (home) {
        console.log('🌱 Home seeded successfully!')
      }
    }

    await prismaClient.$disconnect()
  } catch (error) {
    console.error('Error seeding database: ', error)
    process.exit(1)
  }
}

seed()
