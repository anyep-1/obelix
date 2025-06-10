const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const plainPassword = "admin123"; // Ganti jika perlu
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingAdmin = await prisma.tb_user.findUnique({
    where: { username },
  });

  if (!existingAdmin) {
    await prisma.tb_user.create({
      data: {
        username,
        password: hashedPassword,
        role: "Admin",
        nama: "Administrator",
      },
    });
    console.log(`✅ Admin user created: ${username}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
