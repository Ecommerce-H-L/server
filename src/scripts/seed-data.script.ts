import {
  PermissionAction as Action,
  PermissionFeature as Feature,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import pino from 'pino';

import { HashingService } from '@/common';
import envConfig from '@/config/env';

const prisma = new PrismaClient();
const hashing = new HashingService();
const log = pino({ name: 'seed' });

function rows(role: UserRole, pairs: [Feature, Action][]) {
  return pairs.map(([permissionFeature, permissionAction]) => ({
    role,
    permissionFeature,
    permissionAction,
  }));
}

const SUPER_ADMIN_PERMS: [Feature, Action][] = Object.values(
  Feature as Record<string, Feature>,
).map((f) => [f, Action.MANAGE]);

const ADMIN_PERMS: [Feature, Action][] = [
  // Catalog
  [Feature.PRODUCT, Action.CREATE],
  [Feature.PRODUCT, Action.READ],
  [Feature.PRODUCT, Action.UPDATE],
  [Feature.PRODUCT, Action.DELETE],
  [Feature.PRODUCT, Action.LIST],

  [Feature.PRODUCT_IMAGE, Action.UPLOAD],
  [Feature.PRODUCT_IMAGE, Action.UPDATE],
  [Feature.PRODUCT_IMAGE, Action.DELETE],
  [Feature.PRODUCT_IMAGE, Action.LIST],
  [Feature.PRODUCT_IMAGE, Action.READ],

  [Feature.BRAND, Action.CREATE],
  [Feature.BRAND, Action.READ],
  [Feature.BRAND, Action.UPDATE],
  [Feature.BRAND, Action.DELETE],
  [Feature.BRAND, Action.LIST],

  [Feature.CATEGORY, Action.CREATE],
  [Feature.CATEGORY, Action.READ],
  [Feature.CATEGORY, Action.UPDATE],
  [Feature.CATEGORY, Action.DELETE],
  [Feature.CATEGORY, Action.LIST],

  // Orders
  [Feature.ORDER, Action.LIST],
  [Feature.ORDER, Action.READ],
  [Feature.ORDER, Action.UPDATE],
  [Feature.ORDER_ITEM, Action.READ],
  [Feature.ORDER_ITEM, Action.LIST],

  // Users (browse only)
  [Feature.USER, Action.LIST],
  [Feature.USER, Action.READ],
  [Feature.USER, Action.UPDATE],
  [Feature.USER, Action.DELETE],

  // Carts (support operations)
  [Feature.CART, Action.READ],
  [Feature.CART, Action.LIST],
  [Feature.CART_ITEM, Action.READ],
  [Feature.CART_ITEM, Action.LIST],
];

const USER_PERMS: [Feature, Action][] = [
  // Catalog browsing
  [Feature.PRODUCT, Action.LIST],
  [Feature.PRODUCT, Action.READ],
  [Feature.PRODUCT_IMAGE, Action.READ],
  [Feature.PRODUCT_IMAGE, Action.LIST],
  [Feature.BRAND, Action.LIST],
  [Feature.BRAND, Action.READ],
  [Feature.CATEGORY, Action.LIST],
  [Feature.CATEGORY, Action.READ],

  // Cart
  [Feature.CART, Action.CREATE],
  [Feature.CART, Action.READ],
  [Feature.CART, Action.UPDATE],
  [Feature.CART, Action.DELETE],
  [Feature.CART_ITEM, Action.CREATE],
  [Feature.CART_ITEM, Action.READ],
  [Feature.CART_ITEM, Action.UPDATE],
  [Feature.CART_ITEM, Action.DELETE],

  // Orders
  [Feature.ORDER, Action.CREATE],
  [Feature.ORDER, Action.LIST],
  [Feature.ORDER, Action.READ],
  [Feature.ORDER_ITEM, Action.LIST],
  [Feature.ORDER_ITEM, Action.READ],

  // Profile
  [Feature.USER, Action.READ],
  [Feature.USER, Action.UPDATE],
];

async function seedPermissions() {
  const data = [
    ...rows(UserRole.SUPER_ADMIN, SUPER_ADMIN_PERMS),
    ...rows(UserRole.ADMIN, ADMIN_PERMS),
    ...rows(UserRole.USER, USER_PERMS),
  ];

  const result = await prisma.rolePermission.createMany({
    data,
    skipDuplicates: true,
  });
  log.info(`Permissions seeded/kept: ${result.count}`);
}

async function seedSuperAdmin() {
  const email = envConfig.SUPER_ADMIN_EMAIL.toLowerCase();
  const [firstName = '', lastName = ''] = envConfig.SUPER_ADMIN_NAME.split(' ');
  const passwordHash = await hashing.hash(envConfig.SUPER_ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      firstName,
      lastName,
      role: UserRole.SUPER_ADMIN,
      // keep existing password unless intentionally rotating
    },
    create: {
      email,
      firstName,
      lastName,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
    select: { id: true, email: true, role: true },
  });

  log.info(`Super admin ready: ${admin.email} (${admin.role})`);
}

async function seedAdmin() {
  const email = envConfig.ADMIN_EMAIL.toLowerCase();
  const name = envConfig.ADMIN_NAME;
  const [firstName = '', lastName = ''] = name.split(' ');
  const password = envConfig.ADMIN_PASSWORD;
  const passwordHash = await hashing.hash(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      firstName,
      lastName,
      role: UserRole.ADMIN,
    },
    create: {
      email,
      firstName,
      lastName,
      passwordHash,
      role: UserRole.ADMIN,
    },
    select: { id: true, email: true, role: true },
  });

  log.info(`Admin ready: ${user.email} (${user.role})`);
}

async function seedRegularUser() {
  const email = envConfig.USER_EMAIL.toLowerCase();
  const name = envConfig.USER_NAME;
  const [firstName = '', lastName = ''] = name.split(' ');
  const password = envConfig.USER_PASSWORD;
  const passwordHash = await hashing.hash(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      firstName,
      lastName,
      role: UserRole.USER,
    },
    create: {
      email,
      firstName,
      lastName,
      passwordHash,
      role: UserRole.USER,
    },
    select: { id: true, email: true, role: true },
  });

  log.info(`User ready: ${user.email} (${user.role})`);
}

async function main() {
  await seedPermissions();
  await seedSuperAdmin();
  await seedAdmin();
  await seedRegularUser();
}

main()
  .catch((e) => {
    log.error(e, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
