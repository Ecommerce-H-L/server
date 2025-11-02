/*
  Warnings:

  - The values [EMPLOYEE,CUSTOMER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auth0_metadata` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `auth0_sub` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pending_auth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('CREATED', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('COD', 'CARD', 'CASH');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'PROCESSING', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ReferenceType" AS ENUM ('PRODUCT_TYPE', 'GIFT_CARD', 'MEMBERSHIP', 'PACKAGE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "auth0_metadata",
DROP COLUMN "auth0_sub",
DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "employee_id",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "pending_auth",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "firstName" VARCHAR NOT NULL,
ADD COLUMN     "lastName" VARCHAR NOT NULL,
ADD COLUMN     "passwordHash" VARCHAR NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" VARCHAR NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "public"."UserLocation" (
    "userLocationId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("userLocationId")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "rolePermissionId" VARCHAR NOT NULL,
    "permissionFeature" VARCHAR NOT NULL,
    "permissionAction" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("rolePermissionId")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "token" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "brandId" VARCHAR NOT NULL,
    "brandName" VARCHAR NOT NULL,
    "description" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" VARCHAR,
    "updatedById" VARCHAR,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("brandId")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "productId" VARCHAR NOT NULL,
    "productName" VARCHAR NOT NULL,
    "productType" VARCHAR NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "usageInstructions" VARCHAR,
    "description" VARCHAR,
    "ingredients" VARCHAR,
    "brandId" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" VARCHAR,
    "updatedById" VARCHAR,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "productImageId" VARCHAR NOT NULL,
    "productId" VARCHAR NOT NULL,
    "imagePath" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" VARCHAR,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" VARCHAR,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("productImageId")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "categoryId" VARCHAR NOT NULL,
    "categoryName" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" VARCHAR,
    "updatedById" VARCHAR,

    CONSTRAINT "category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "public"."ProductCategory" (
    "productCategoryId" VARCHAR NOT NULL,
    "productId" VARCHAR NOT NULL,
    "categoryId" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" VARCHAR,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" VARCHAR,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productCategoryId")
);

-- CreateTable
CREATE TABLE "public"."CartSession" (
    "cartSessionId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "baseTotalPrice" DECIMAL(12,2) NOT NULL,
    "totalTax" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "CartSession_pkey" PRIMARY KEY ("cartSessionId")
);

-- CreateTable
CREATE TABLE "public"."CartItem" (
    "cartItemId" VARCHAR NOT NULL,
    "cartSessionId" VARCHAR NOT NULL,
    "referenceId" VARCHAR NOT NULL,
    "referenceType" "public"."ReferenceType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" VARCHAR,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cartItemId")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "orderId" VARCHAR NOT NULL,
    "userId" VARCHAR NOT NULL,
    "orderStatus" "public"."OrderStatus" NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "evidencePath" VARCHAR,
    "totalTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "baseTotalPrice" DECIMAL(12,2) NOT NULL,
    "totalAmountDue" DECIMAL(12,2) NOT NULL,
    "note" VARCHAR,
    "userPhone" VARCHAR,
    "userAddress" VARCHAR,
    "updatedById" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "orderItemId" VARCHAR NOT NULL,
    "orderId" VARCHAR NOT NULL,
    "orderItemName" VARCHAR NOT NULL,
    "referenceId" VARCHAR NOT NULL,
    "referenceType" "public"."ReferenceType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "note" VARCHAR,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateIndex
CREATE INDEX "UserLocation_userId_idx" ON "public"."UserLocation"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "public"."Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_createdById_idx" ON "public"."Product"("createdById");

-- CreateIndex
CREATE INDEX "Product_updatedById_idx" ON "public"."Product"("updatedById");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "public"."ProductImage"("productId");

-- CreateIndex
CREATE INDEX "ProductImage_createdById_idx" ON "public"."ProductImage"("createdById");

-- CreateIndex
CREATE INDEX "ProductImage_updatedById_idx" ON "public"."ProductImage"("updatedById");

-- CreateIndex
CREATE INDEX "ProductCategory_productId_idx" ON "public"."ProductCategory"("productId");

-- CreateIndex
CREATE INDEX "ProductCategory_categoryId_idx" ON "public"."ProductCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productId_categoryId_key" ON "public"."ProductCategory"("productId", "categoryId");

-- CreateIndex
CREATE INDEX "CartSession_userId_idx" ON "public"."CartSession"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartSessionId_idx" ON "public"."CartItem"("cartSessionId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "public"."Order"("userId");

-- CreateIndex
CREATE INDEX "Order_updatedById_idx" ON "public"."Order"("updatedById");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- AddForeignKey
ALTER TABLE "public"."UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Brand" ADD CONSTRAINT "Brand_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("brandId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category" ADD CONSTRAINT "category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category" ADD CONSTRAINT "category_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategory" ADD CONSTRAINT "ProductCategory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartSession" ADD CONSTRAINT "CartSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_cartSessionId_fkey" FOREIGN KEY ("cartSessionId") REFERENCES "public"."CartSession"("cartSessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
