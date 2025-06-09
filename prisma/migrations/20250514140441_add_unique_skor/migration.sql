/*
  Warnings:

  - A unique constraint covering the columns `[clo_id,template_id]` on the table `tb_skor_clo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tb_skor_clo_clo_id_template_id_key` ON `tb_skor_clo`(`clo_id`, `template_id`);
