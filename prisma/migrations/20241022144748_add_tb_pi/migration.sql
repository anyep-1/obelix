-- CreateTable
CREATE TABLE `tb_pi` (
    `pi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `deskripsi_pi` VARCHAR(191) NOT NULL,
    `plo_id` INTEGER NOT NULL,

    PRIMARY KEY (`pi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_clo` (
    `clo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_clo` VARCHAR(255) NOT NULL,
    `plo_id` INTEGER NOT NULL,
    `matkul_id` INTEGER NOT NULL,
    `pi_id` INTEGER NOT NULL,

    PRIMARY KEY (`clo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
