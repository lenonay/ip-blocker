CREATE TABLE IPs(
id INT PRIMARY KEY AUTO_INCREMENT,
ip VARCHAR(20) UNIQUE,
ratoneo INT NOT NULL DEFAULT 0,
last_ban TIMESTAMP,
malicious_count INT DEFAULT 0
);

CREATE TABLE Peticiones(
id INT PRIMARY KEY AUTO_INCREMENT,
cod_ip INT NOT NULL,
method VARCHAR(20) NOT NULL,
uri VARCHAR(2000) NOT NULL DEFAULT "/",
timestamp TIMESTAMP DEFAULT TIMESTAMP(NOW())
);