import { prisma } from './config/prisma';

async function test() {
  try {
    console.log('--- ClassRoom Records ---');
    const classrooms = await prisma.$queryRaw`SELECT * FROM "ClassRoom"`;
    console.log(classrooms);

    console.log('\n--- HeadmasterStaff Records ---');
    const staff = await prisma.headmasterStaff.findMany();
    console.log(staff);

    console.log('\n--- User Records ---');
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.log(users);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
