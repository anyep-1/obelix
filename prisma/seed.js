// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.tb_nilai_minimum.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nilai_minimum: 3.0,
    },
  });

  console.log("Nilai minimum berhasil diinisialisasi.");
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
