const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('1');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true },
    }));

    console.log('2');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true, questionText: true },
    }));

    console.log('3');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true, questionText: true, options: true },
    }));

    console.log('4');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true, quizId: true },
    }));

    console.log('5');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true, correctIndex: true, difficulty: true, orderIndex: true },
    }));

    console.log('6');
    console.log(await prisma.question.findMany({
      take: 5,
      select: { id: true, quiz: true },
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();