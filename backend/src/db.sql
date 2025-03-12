CREATE DATABASE  estac;
USE estac;

CREATE TABLE cars(
placa VARCHAR(7) PRIMARY KEY NOT NULL,
motorista VARCHAR(225),
senha VARCHAR(225),
pref VARCHAR(225),
tempo TIME,
entrada TIMESTAMP,
saida TIMESTAMP
);

CREATE TABLE estaciononados(
estac_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
tempo TIME,
entrada TIMESTAMP,
placa VARCHAR(7),
valor INT,

FOREIGN KEY (placa) REFERENCES cars(placa)
);