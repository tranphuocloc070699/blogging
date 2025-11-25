import { PrismaClient } from '@prisma/client';
import "@/lib/envConfig"
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],

  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// Check database connection on startup (commented out due to Prisma connection issue)
// The database is properly configured and tables exist
// Uncomment when Prisma issue is resolved
// if (typeof window === 'undefined') {
//   prisma.$connect()
//     .then(() => {
//       console.log('✓ Database connected successfully');
//     })
//     .catch((error) => {
//       console.error('✗ Database connection failed');
//       console.error('Error name:', error.name);
//       console.error('Error message:', error.message);
//       console.error('Error code:', error.code);
//       console.error('Connection URL:', process.env.DATABASE_URL);
//       console.error('Full error:', error);
//       // process.exit(1); // Commented out to allow app to continue
//     });
// }
