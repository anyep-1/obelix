/*
  Warnings:

  - You are about to alter the column `dosen_pengampu` on the `tb_template_rubrik` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `tb_template_rubrik` MODIFY `dosen_pengampu` JSON NOT NULL;
