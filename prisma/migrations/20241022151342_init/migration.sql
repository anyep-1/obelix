/*
  Warnings:

  - You are about to drop the `tb_clo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[plo_id,pi_id]` on the table `tb_pi` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE `tb_clo`;

-- CreateIndex
CREATE UNIQUE INDEX `tb_pi_plo_id_pi_id_key` ON `tb_pi`(`plo_id`, `pi_id`);

-- AddForeignKey
ALTER TABLE `tb_pi` ADD CONSTRAINT `tb_pi_plo_id_fkey` FOREIGN KEY (`plo_id`) REFERENCES `tb_plo`(`plo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
