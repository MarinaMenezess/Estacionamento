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

CREATE TABLE administrador(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(225),
senha VARCHAR(225)
);

CREATE TABLE transacoes (
    transacao_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    placa VARCHAR(7),
    data_entrada TIMESTAMP,
    data_saida TIMESTAMP,
    valor DECIMAL(10, 2),
    pago BOOLEAN DEFAULT FALSE,
    tipo_pagamento ENUM('dinheiro', 'cartao', 'pix'),
    
    FOREIGN KEY (placa) REFERENCES cars(placa)
);