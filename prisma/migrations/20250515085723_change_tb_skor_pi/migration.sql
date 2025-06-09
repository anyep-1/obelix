/*
  Warnings:

  - A unique constraint covering the columns `[pi_id]` on the table `tb_skor_pi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tb_skor_pi_pi_id_key` ON `tb_skor_pi`(`pi_id`);
