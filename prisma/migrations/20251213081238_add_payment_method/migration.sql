-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'TRANSFER');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH';
