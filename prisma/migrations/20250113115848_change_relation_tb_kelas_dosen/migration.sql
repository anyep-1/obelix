/*
  Warnings:

  - You are about to drop the column `kelas_id` on the `tb_kelas_dosen` table. All the data in the column will be lost.
  - Added the required column `matkul_id` to the `tb_kelas_dosen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tb_kelas_dosen` DROP FOREIGN KEY `tb_kelas_dosen_kelas_id_fkey`;

-- DropIndex
DROP INDEX `tb_kelas_dosen_kelas_id_fkey` ON `tb_kelas_dosen`;

-- AlterTable
ALTER TABLE `tb_kelas_dosen` DROP COLUMN `kelas_id`,
    ADD COLUMN `matkul_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_kelas_dosen` ADD CONSTRAINT `tb_kelas_dosen_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
