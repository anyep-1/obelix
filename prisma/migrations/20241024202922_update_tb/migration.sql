/*
  Warnings:

  - A unique constraint covering the columns `[matkul_id,pi_id]` on the table `tb_pi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matkul_id` to the `tb_pi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_pi` ADD COLUMN `matkul_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `tb_pi_matkul_id_pi_id_key` ON `tb_pi`(`matkul_id`, `pi_id`);

-- AddForeignKey
ALTER TABLE `tb_pi` ADD CONSTRAINT `tb_pi_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
