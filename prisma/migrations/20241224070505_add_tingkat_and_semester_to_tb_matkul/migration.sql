/*
  Warnings:

  - Added the required column `semester` to the `tb_matkul` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tingkat` to the `tb_matkul` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_matkul` ADD COLUMN `semester` VARCHAR(50) NOT NULL,
    ADD COLUMN `tingkat` VARCHAR(50) NOT NULL;
