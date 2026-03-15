CREATE TABLE `user_auth` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	CONSTRAINT `user_auth_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_auth_email_unique` UNIQUE(`email`)
);
