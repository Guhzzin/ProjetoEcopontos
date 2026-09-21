CREATE DATABASE IF NOT EXISTS ecopontos_db;
USE ecopontos_db;

CREATE TABLE pontos_coleta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT NOT NULL,
    tipo_residuo VARCHAR(100) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    horario_funcionamento VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pontos_coleta (nome, endereco_completo, tipo_residuo, latitude, longitude) VALUES 
('Ecoponto Guaçuí', 'R. Maria Augusta, 1 - Sítio Cercado', 'mistos ou reciclavel', -25.550343, -49.254809),
('Ecoponto Icaraí', 'R. Olindo Caetani, 1330 - Uberaba', 'mistos ou reciclavel', -25.491137, -49.202840),
('Ecoponto Caiuá', 'Av. Juscelino Kubitschek De Oliveira - Ld, 6800 - Cidade Industrial De Curitiba', 'mistos ou reciclavel', -25.490970, -49.345460),
('Ecoponto CIC', 'R. Orestes Thá, 1765 - Cidade Industrial De Curitiba', 'mistos ou reciclavel', -25.512069, -49.331863),
('Ecoponto Sambaqui', 'R. Rad. Souza Moreno, 30 - Sítio Cercado', 'mistos ou reciclavel', -25.554707, -49.266645),
('Ecoponto Jandaia', 'R. Jorn. José Pedro Dos Santos - Pedrinho, 801 - Ganchinho', 'mistos ou reciclavel', -25.554903, -49.244042),
('Ecoponto Metropolitano', 'R. Da Independência, 340 - São Braz', 'mistos ou reciclavel', -25.421032, -49.363778),
('Ecoponto Cajuru', 'R. Neusa Vieira Bet, 255 - Cajuru', 'mistos ou reciclavel', -25.463015, -49.195158),
('Ecoponto Vila Verde', 'R. Lydio Paulo Bettega, 200 - Cidade Industrial De Curitiba', 'mistos ou reciclavel', -25.530151, -49.340384),
('Ecoponto Campo de Santana', 'R. Teresa De Freitas Tavares, 331 - Campo De Santana', 'mistos ou reciclavel', -25.579708, -49.327669),
('Ecoponto Érico Veríssimo', 'R. Cap. Amin Mosse, 557 - Alto Boqueirão', 'mistos ou reciclavel', -25.532033, -49.251294),
('Ecoponto Vila Nova', 'R. Ten. Cel. Vilagran Cabrita, 2495 - Alto Boqueirão', 'mistos ou reciclavel', -25.529422, -49.230470);