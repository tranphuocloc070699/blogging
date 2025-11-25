import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env["ADMIN_EMAIL"] || 'admin@admin.com'
  const adminPassword = process.env["ADMIN_PASSWORD"] || 'admin'
  const adminUsername = process.env["ADMIN_USERNAME"] || 'admin'

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail,username:adminUsername },
    update: {},
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created/updated:', {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role
  })
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })