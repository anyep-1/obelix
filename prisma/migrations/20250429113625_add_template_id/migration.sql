/*
  Warnings:

  - Added the required column `template_id` to the `tb_skor_clo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_skor_clo` ADD COLUMN `template_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_skor_clo` ADD CONSTRAINT `tb_skor_clo_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `tb_template_rubrik`(`template_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
