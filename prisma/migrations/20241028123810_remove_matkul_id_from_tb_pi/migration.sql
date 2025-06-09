/*
  Warnings:

  - You are about to drop the column `matkul_id` on the `tb_pi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tb_pi` DROP FOREIGN KEY `tb_pi_matkul_id_fkey`;

-- DropIndex
DROP INDEX `tb_pi_matkul_id_pi_id_key` ON `tb_pi`;

-- AlterTable
ALTER TABLE `tb_pi` DROP COLUMN `matkul_id`;
