/*
  Warnings:

  - You are about to drop the column `tool_id` on the `tb_nilai` table. All the data in the column will be lost.
  - Added the required column `clo_id` to the `tb_nilai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clo_id` to the `tb_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tool_id` to the `tb_question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tb_nilai` DROP FOREIGN KEY `tb_nilai_tool_id_fkey`;

-- DropIndex
DROP INDEX `tb_nilai_tool_id_fkey` ON `tb_nilai`;

-- AlterTable
ALTER TABLE `tb_nilai` DROP COLUMN `tool_id`,
    ADD COLUMN `clo_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tb_question` ADD COLUMN `clo_id` INTEGER NOT NULL,
    ADD COLUMN `tool_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tb_question` ADD CONSTRAINT `tb_question_clo_id_fkey` FOREIGN KEY (`clo_id`) REFERENCES `tb_clo`(`clo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_question` ADD CONSTRAINT `tb_question_tool_id_fkey` FOREIGN KEY (`tool_id`) REFERENCES `tb_tools_assessment`(`tool_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_nilai` ADD CONSTRAINT `tb_nilai_clo_id_fkey` FOREIGN KEY (`clo_id`) REFERENCES `tb_clo`(`clo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
