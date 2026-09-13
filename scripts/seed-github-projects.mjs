import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Only the 2 projects explicitly selected by @savewaris
const curatedProjects = [
  {
    title: 'Hexagonal Architecture & DDD Blueprint',
    description: 'Enterprise-grade Clean Architecture and Domain-Driven Design (DDD) implementation in TypeScript. Decouples core business domain logic from transport protocols and databases via explicit Ports and Adapters, enabling 100% mocked unit tests and modular framework swappability.',
    tags: 'Architecture, Clean Code, TypeScript, DDD, Ports & Adapters, TDD',
    repoUrl: 'https://github.com/savewaris/hexagonal-architecture',
    demoType: 'architecture',
    demoNote: 'Interactive Architectural Layer Diagram & Code Structure',
    isEmbeddable: false,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: null,
  },
  {
    title: 'Nutrin — Smart Nutrition Assistant',
    description: 'Cross-platform mobile nutrition tracking application built with Flutter and Dart. Empowers users with personalized caloric intake monitoring, daily macronutrient analytics, meal logs, and BMI health tracking.',
    tags: 'Mobile, Flutter, Dart, HealthTech, State Management, Cross-Platform',
    repoUrl: 'https://github.com/savewaris/Nutrition-Assistant-Application-Nutrin-',
    demoType: 'none',
    demoUrl: null,
    demoNote: null,
    isEmbeddable: false,
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    videoPreviewUrl: null,
  },
];

async function seed() {
  console.log('🚀 Seeding 2 Curated GitHub Projects for @savewaris...');

  for (const projectData of curatedProjects) {
    const existing = await prisma.project.findFirst({
      where: {
        OR: [
          { repoUrl: projectData.repoUrl },
          { title: projectData.title },
        ],
      },
    });

    if (existing) {
      const updated = await prisma.project.update({
        where: { id: existing.id },
        data: projectData,
      });
      console.log(`✔ Updated project: "${updated.title}" [${updated.id}]`);
    } else {
      const created = await prisma.project.create({
        data: projectData,
      });
      console.log(`✔ Created project: "${created.title}" [${created.id}]`);
    }
  }

  const total = await prisma.project.count();
  console.log(`\n🎉 Project seeding finished successfully! Total projects in DB: ${total}`);
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
