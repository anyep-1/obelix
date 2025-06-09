/*
  Warnings:

  - Added the required column `matkul_id` to the `tb_nilai` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_nilai` ADD COLUMN `matkul_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tb_user` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `tb_nilai` ADD CONSTRAINT `tb_nilai_matkul_id_fkey` FOREIGN KEY (`matkul_id`) REFERENCES `tb_matkul`(`matkul_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
