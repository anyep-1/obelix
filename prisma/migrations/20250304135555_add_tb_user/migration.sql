-- CreateTable
CREATE TABLE `tb_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('Admin', 'Kaprodi', 'DosenKoor', 'DosenAmpu', 'GugusKendaliMutu', 'Evaluator') NOT NULL,

    UNIQUE INDEX `tb_user_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
