-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'CUSTOMER');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employee_id" UUID,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "pending_auth" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "auth0_sub" TEXT,
    "auth0_metadata" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);
