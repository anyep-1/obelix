-- AlterTable
ALTER TABLE `tb_monev` ADD COLUMN `linkBukti` TEXT NULL;

-- AlterTable
ALTER TABLE `tb_rt` MODIFY `statusImplementasi` VARCHAR(191) NOT NULL DEFAULT 'belum';
