/*
  Warnings:

  - You are about to drop the column `percentage` on the `tb_nilai` table. All the data in the column will be lost.
  - You are about to drop the column `percentage_clo` on the `tb_nilai` table. All the data in the column will be lost.
  - You are about to drop the column `percentage_plo` on the `tb_nilai` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kode_dosen]` on the table `tb_dosen` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tb_nilai` DROP COLUMN `percentage`,
    DROP COLUMN `percentage_clo`,
    DROP COLUMN `percentage_plo`;

-- CreateIndex
CREATE UNIQUE INDEX `tb_dosen_kode_dosen_key` ON `tb_dosen`(`kode_dosen`);
