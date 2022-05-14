-- DROP USER IF EXISTS brayangamboa;
-- CREATE USER brayangamboa; 
-- ALTER USER brayangamboa WITH PASSWORD '0419';
DROP DATABASE IF EXISTS semillero_sas;
CREATE DATABASE semillero_sas WITH ENCODING = 'UTF8';
\c semillero_sas;
DROP TABLE IF EXISTS vehiculo;

DROP TABLE IF EXISTS linea;

DROP TABLE IF EXISTS marca;

DROP TABLE IF EXISTS users;

DROP SEQUENCE IF EXISTS linea_seq;

DROP TYPE IF EXISTS estado;

DROP TYPE IF EXISTS nombre_marca;

DROP TYPE IF EXISTS rol;

CREATE TYPE rol AS ENUM ('admin', 'user');

CREATE TYPE nombre_marca AS ENUM(
    'Mazda',
    'Toyota',
    'Chevrolet',
    'Suzuki',
    'Volkswagen',
    'Audi',
    'BMW',
    'Ford',
    'Mercedes-Benz',
    'Tesla'
);

CREATE TYPE estado AS ENUM ('S', 'N');

CREATE SEQUENCE linea_seq;  
CREATE SEQUENCE user_seq;  

CREATE TABLE users(
    id integer NOT NULL DEFAULT nextval('user_seq'),
    email TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol rol NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (email)
);

CREATE TABLE marca(
    nombre nombre_marca NOT NULL,
    descripcion TEXT NOT NULL,
    estado estado NOT NULL,
    CONSTRAINT pk_name_marca PRIMARY KEY (nombre)
);

CREATE TABLE linea(
    id_linea INT NOT NULL DEFAULT NEXTVAL('linea_seq'),
    descripcion TEXT NOT NULL,
    estado estado NOT NULL,
    nombre_marca nombre_marca NOT NULL UNIQUE,
    CONSTRAINT pk_id_linea PRIMARY KEY (id_linea),
    CONSTRAINT fk_marca_linea FOREIGN KEY (nombre_marca) REFERENCES marca(nombre)
);

CREATE TABLE vehiculo(
    num_placa TEXT NOT NULL,
    modelo DATE NOT NULL,
    fch_vence_seg DATE NOT NULL,
    fch_vence_tecno DATE NOT NULL,
    linea INT NOT NULL,
    url_img TEXT NOT NULL,
    CONSTRAINT pk_placa_vehiculo PRIMARY KEY (num_placa),
    CONSTRAINT fk_marca_vehiculo FOREIGN KEY (linea) REFERENCES linea(id_linea)
);

\ dt;

INSERT INTO
    marca (nombre, descripcion, estado)
VALUES
    (
        'Mazda',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Toyota',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Ford',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Suzuki',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'N'
    ),
    (
        'Chevrolet',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Volkswagen',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Audi',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'BMW',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Mercedes-Benz',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    ),
    (
        'Tesla',
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S'
    );

SELECT
    *
FROM
    marca;

INSERT INTO
    linea (descripcion, estado, nombre_marca)
VALUES
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Tesla'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Mazda'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Mercedes-Benz'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'BMW'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Audi'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Volkswagen'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Chevrolet'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Suzuki'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Toyota'
    ),
    (
        'Lorem sit amet consectetur adipisicing elit. Reprehenderit, eos!',
        'S',
        'Ford'
    );

SELECT
    *
FROM
    linea;

INSERT INTO
    users (email, nombre, apellido, rol)
VALUES
    ('bsgv2005@gmail.com', 'Brayan', 'Gamboa', 'admin');

INSERT INTO
    vehiculo (
        num_placa,
        modelo,
        fch_vence_seg,
        fch_vence_tecno,
        linea,
        url_img
    )
VALUES
    (
        'GGU149',
        '2005-04-19',
        '2005-04-19',
        '2005-04-19',
        6,
        'hola.com'
    ),
    (
        'HUG30F',
        '2022-03-09',
        '2023-03-09',
        '2023-04-29',
        6,
        'Prueba.com'
    ),
    (
        'HUG30G',
        '2022-03-09',
        '2022-03-09',
        '2022-03-09',
        3,
        'Prueba.com'
    ),
    (
        'PEG01E',
        '2022-03-09',
        '2023-03-09',
        '2023-04-29',
        6,
        'Prueba.com'
    ),
    (
        'RI7342',
        '2022-03-09',
        '2023-03-09',
        '2023-04-29',
        6,
        'Prueba.com'
    ),
    (
        'RIY402',
        '2022-03-09',
        '2023-03-09',
        '2023-04-29',
        6,
        'Prueba.com'
    );

SELECT
    *
FROM
    vehiculo;

SELECT
    MIN(modelo)
FROM
    vehiculo;

SELECT
    MAX(modelo)
FROM
    vehiculo;

SELECT
    COUNT(modelo)
FROM
    vehiculo;

-- En postgres no se permite hacer una suma por el campo 'DATE', por ende se debe hacer una suma por el campo 'INTEGER' O 'INT'
SELECT
    SUM(id_linea)
FROM
    linea;

SELECT
    AVG(id_linea)
FROM
    linea;

SELECT
    vehiculo.num_placa,
    vehiculo.modelo,
    linea.descripcion,
    marca.descripcion
FROM
    (
        (
            linea
            INNER JOIN vehiculo ON vehiculo.linea = linea.id_linea
        )
        INNER JOIN marca ON marca.nombre = linea.nombre_marca
    );

SELECT
    COUNT(estado)
FROM
    linea;

SELECT
    *
FROM
    vehiculo
WHERE
    fch_vence_seg >= '2010-03-09'
    AND fch_vence_seg <= '2090-03-09';