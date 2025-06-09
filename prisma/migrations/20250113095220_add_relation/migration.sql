/*
  Warnings:

  - Added the required column `kelas_id` to the `tb_mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_mahasiswa` ADD COLUMN `kelas_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_mahasiswa` ADD CONSTRAINT `tb_mahasiswa_kelas_id_fkey` FOREIGN KEY (`kelas_id`) REFERENCES `tb_kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
