import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@tn.gov.in';
  
  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Super Admin already exists:');
    console.log(`Email: ${existingUser.email}`);
    console.log(`Role: ${existingUser.role}`);
    console.log('Password (Hash):', existingUser.passwordHash);
  } else {
    // Create new Super Admin
    const user = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: email,
        mobile: '9999999999',
        passwordHash: 'admin123', // In auth.ts, matchesPassword checks `user.passwordHash === password` directly.
        role: 'SUPERADMIN',
        isActive: true,
      },
    });

    console.log('Super Admin successfully created:');
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.passwordHash}`);
    console.log(`Role: ${user.role}`);
  }
}

main()
  .catch((e) => {
    console.error('Error creating super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
