/*
  Warnings:

  - You are about to drop the column `isRevoced` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "isRevoced",
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "expiresIn" SET DEFAULT NOW() + INTERVAL '7 days';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" VARCHAR(255) NOT NULL;
