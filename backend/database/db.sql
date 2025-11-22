CREATE DATABASE SaberClick

-- 1
CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    paterno VARCHAR(100) NOT NULL,
    materno VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL,
    celular VARCHAR(100) NOT NULL,
    fecha_naci DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR DEFAULT 'Habilitado'
);

alter table usuario
ADD COLUMN password VARCHAR(60):
--2
CREATE TABLE administrador(
    id_admin SERIAL PRIMARY KEY,
    cargo VARCHAR(50) NOT NULL,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
	estado VARCHAR(20) DEFAULT 'Habilitado'
);
--3
CREATE TABLE tutor(
    id_tutor SERIAL PRIMARY KEY,
    especialidad VARCHAR(100),
    anos_experiencia INT,
    cv TEXT,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario)
    estado VARCHAR(20) DEFAULT 'Habilitado'
);
--4
CREATE TABLE estudiante(
    id_estudiante SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario)
    estado VARCHAR(20) DEFAULT 'Habilitado'
);
--5
CREATE TABLE gerente (
    id_gerente SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    estado VARCHAR(20) DEFAULT 'Habilitado'
);
--6
CREATE TABLE tutoria (
    id_tutoria SERIAL PRIMARY KEY,
    nombre_tutoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo NUMERIC(10, 2) NOT NULL CHECK (costo >= 0)
    id_institucion INT NOT NULL REFERENCES institucion(id_institucion)
);
--7
CREATE TABLE paralelo (
    id_paralelo SERIAL NOT NULL,
    id_tutoria INTEGER NOT NULL, 
    horario TIME NOT NULL, 
    fecha_ini DATE NOT NULL,
    fecha_fin DATE,
    dia VARCHAR(15) NOT NULL, 
    modalidad VARCHAR(50) NOT NULL, 
    enlace VARCHAR(255), 
    id_tutor INTEGER NOT NULL, 
    PRIMARY KEY (id_paralelo, id_tutoria),
    FOREIGN KEY (id_tutoria) REFERENCES tutoria(id_tutoria) ON DELETE CASCADE,
    FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor) ON DELETE RESTRICT
);
--8
CREATE TABLE institucion(
    id_institucion SERIAL PRIMARY KEY,
    id_gerente INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    celular VARCHAR(20),
    descripcion TEXT,
    FOREIGN KEY (id_gerente) REFERENCES gerente(id_gerente) ON DELETE RESTRIC
);
--9
 CREATE TABLE tema (
    id_tema SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    materia JSONB, 
    id_tutoria INTEGER NOT NULL, 
    FOREIGN KEY (id_tutoria) REFERENCES tutoria(id_tutoria) ON DELETE CASCADE
);
--10
CREATE TABLE pago(
    id_pago SERIAL PRIMARY KEY,
    id_inscripcion INTEGER NOT NULL, 
    monto INT NOT NULL,
    metodo_pago VARCHAR(50),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_pago VARCHAR(20)
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion) ON DELETE CASCADE,
);
--11
CREATE TABLE inscripcion (
    id_inscripcion SERIAL PRIMARY KEY,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    hora_inscripcion TIME DEFAULT CURRENT_TIME,
    nota1 NUMERIC(10, 2),
    nota2 NUMERIC(10, 2),
    nota3 NUMERIC(10, 2),
    intento1 NUMERIC(10, 2),
    intento2 NUMERIC(10, 2),
    intento3 NUMERIC(10, 2),
    id_tutoria INT NOT NULL,  
    id_paralelo INT NOT NULL, 
    id_estudiante INT NOT NULL,
   
    FOREIGN KEY (id_tutoria) REFERENCES tutoria(id_tutoria) ON DELETE RESTRICT,
    FOREIGN KEY (id_paralelo, id_tutoria) REFERENCES paralelo(id_paralelo, id_tutoria) ON DELETE RESTRICT,
    FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante) ON DELETE CASCADE
);
--12
CREATE TABLE pregunta (
    id_pregunta SERIAL PRIMARY KEY, 
    nro_pregunta INT NOT NULL,
    enunciado TEXT NOT NULL,
    resp_correcta VARCHAR(255) NOT NULL,
    id_tutoria INT NOT NULL,
	estado VARCHAR DEFAULT 'Habilitado',
    FOREIGN KEY (id_tutoria) REFERENCES tutoria(id_tutoria) ON DELETE CASCADE
);
--13
CREATE TABLE opcion (
    id_opcion SERIAL NOT NULL,
    id_pregunta INTEGER NOT NULL, 
    id_insiso INTEGER NOT NULL,
    contenido TEXT NOT NULL,
    PRIMARY KEY (id_opcion, id_pregunta, id_insiso)
);
--14
CREATE TABLE respuesta_ev (
    id_respuesta SERIAL PRIMARY KEY,
    nro_intentos INT NOT NULL, 
    nro_pregunta INT NOT NULL, 
    inciso VARCHAR(5) NOT NULL, 
    id_inscripcion INT NOT NULL,
    FOREIGN KEY (id_inscripcion) REFERENCES inscripcion(id_inscripcion) ON DELETE CASCADE
);

