import { PrismaClient, OrganizationsType, EventCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating sample organization...');
  const organization = await prisma.organizations.create({
    data: {
      name: 'Life Transform Harvest Ministry - Recto Manila',
      type: OrganizationsType.CHURCH,
    }
  })

  console.log('Creating sample event...');
  const event = await prisma.events.create({
    data: {
      name: 'LTHMI - Recto Sunday Service',
      description: 'Happenings every Sundat at Recto',
      image: 'https://picsum.photos/200/300',
      tagline: 'Lorem',
      location: 'Pilar Building 507 Dalupan Street Sampaloc, Manila 10001',
      category: EventCategory.RECURRING,
      slug: 'lthmi-recto-sunday-service',
      startTime: new Date('1970-01-01T09:00:00+08:00'),
      endTime: new Date('1970-01-01T12:00:00+08:00'),
      organizationId: organization.id,
    }
  })

  console.log('Creating sample attendees...');
  const attendee = await prisma.attendees.create({
    data: {
      firstName: 'Ace Gabriel',
      lastName: 'Pasiliao',
      age: 21,
      status: 'Single',
      organizationId: organization.id,
    }
  })

  console.log(`Created organization: ${organization.name}`);
  console.log(`Created event: ${event.name}`);
  console.log(`Created attendee: ${attendee.firstName} ${attendee.lastName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });