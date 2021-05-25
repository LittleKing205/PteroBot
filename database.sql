CREATE TABLE `guilds` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `prefix` varchar(5) NOT NULL DEFAULT '!',
  `adress` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `guildId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `token` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `guilds`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`guildId`,`userId`);
