/*
  Warnings:

  - Added the required column `matkul_id` to the `tb_monev` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_monev` ADD COLUMN `matkul_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_monev` ADD CONSTRAINT `tb_monev_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
