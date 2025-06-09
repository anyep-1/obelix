/*
  Warnings:

  - Added the required column `userPembuatId` to the `tb_monev` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_monev` ADD COLUMN `userPembuatId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_monev` ADD CONSTRAINT `tb_monev_userPembuatId_fkey` FOREIGN KEY (`userPembuatId`) REFERENCES `tb_user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
