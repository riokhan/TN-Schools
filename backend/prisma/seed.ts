import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Teacher", email: "teacher@gmail.com", role: Role.TEACHER, passwordHash: "123456", mobile: "9000000002" },
    { name: "Parent", email: "parent@gmail.com", role: Role.PARENT, passwordHash: "123456", mobile: "9000000003" },
    { name: "Headmaster", email: "headmaster@gmail.com", role: Role.HEADMASTER, passwordHash: "Headmaster@26", mobile: "9000000004" },
    { name: "BEO", email: "beo@gmail.com", role: Role.BEO, passwordHash: "Beo@26", mobile: "9000000005" },
    { name: "DEO", email: "deo@gmail.com", role: Role.DEO, passwordHash: "Deo@26", mobile: "9000000006" },
    { name: "Commissioner", email: "commissioner@gmail.com", role: Role.COMMISSIONER, passwordHash: "Commissioner@26", mobile: "9000000007" },
    { name: "Minister", email: "minister@gmail.com", role: Role.MINISTER, passwordHash: "Minister@26", mobile: "9000000008" },
    { name: "Super Admin", email: "superadmin@gmail.com", role: Role.SUPERADMIN, passwordHash: "123456", mobile: "9000000009" },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({ data: u });
      console.log(`Created user ${u.email}`);
    } else {
      console.log(`User ${u.email} already exists`);
    }
  }

  // Also create a test student
  const studentEmail = "student@gmail.com";
  const existingStudentUser = await prisma.user.findUnique({ where: { email: studentEmail } });
  
  if (!existingStudentUser) {
    const studentUser = await prisma.user.create({
      data: {
        name: "Student",
        email: studentEmail,
        role: Role.STUDENT,
        mobile: "9655258556",
        passwordHash: "123456"
      }
    });

    await prisma.student.create({
      data: {
        userId: studentUser.id,
        rollNumber: "HM10103",
        dob: new Date("2010-01-01"),
        parentMobile: "9655258556",
        emisId: "EMIS10103"
      }
    });
    console.log(`Created student HM10103`);
  } else {
    console.log(`Student HM10103 already exists`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
