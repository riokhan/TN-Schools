import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sports data...');

  // Get the first student as our demo student
  const student = await prisma.student.findFirst({
    include: { user: true, school: true }
  });
  
  if (!student) {
    console.error('No student found. Please seed the database with students first.');
    return;
  }

  // Delete existing sports profile if any
  await prisma.sportsProfile.deleteMany({
    where: { studentId: student.id }
  });

  // Create new sports profile
  const sportsProfile = await prisma.sportsProfile.create({
    data: {
      studentId: student.id,
      teams: {
        create: [
          { name: "School Football Team", role: "Midfielder", icon: "⚽", color: "from-blue-500 to-cyan-500", match: "Inter-school Quarterfinals", date: "This Friday, 4:00 PM" },
          { name: "Athletics Club", role: "Sprinter (100m)", icon: "🏃‍♂️", color: "from-orange-500 to-amber-500", match: "District Meet Tryouts", date: "Next Monday, 6:00 AM" },
        ]
      },
      stats: {
        create: [
          { label: "Cardio Endurance", value: "Excellent", score: 92, icon: "🫀", color: "bg-rose-500" },
          { label: "Sprint Speed", value: "12.4s (100m)", score: 85, icon: "⚡", color: "bg-amber-500" },
          { label: "Agility", value: "Above Average", score: 78, icon: "🤸‍♂️", color: "bg-blue-500" },
          { label: "Overall Fitness", value: "Grade A", score: 88, icon: "💪", color: "bg-emerald-500" },
        ]
      },
      events: {
        create: [
          { title: "Annual Sports Day", date: "Nov 15, 2026", type: "School-wide", icon: "🏟️" },
          { title: "Basketball Team Tryouts", date: "Oct 25, 2026", type: "Selection", icon: "🏀" },
          { title: "Fitness Assessment Test", date: "Oct 28, 2026", type: "Mandatory", icon: "📋" },
        ]
      },
      logs: {
        create: [
          { date: "Oct 18", activity: "Football Practice", duration: "1h 30m", calories: 450, intensity: "High" },
          { date: "Oct 16", activity: "Track Training", duration: "45m", calories: 320, intensity: "High" },
          { date: "Oct 15", activity: "Yoga / Stretching", duration: "30m", calories: 120, intensity: "Low" },
          { date: "Oct 14", activity: "Football Match", duration: "2h 00m", calories: 600, intensity: "Maximum" },
        ]
      }
    }
  });

  console.log(`Successfully seeded sports data for student ID: ${student.id} (${student.user?.name || 'Demo Student'})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
