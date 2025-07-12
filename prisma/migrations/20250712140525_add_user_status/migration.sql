/*
  Warnings:

  - Added the required column `userStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userStatus" "UserStatus" NOT NULL;
