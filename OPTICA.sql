CREATE DATABASE OpticaPopular

GO 
USE OpticaPopular
GO

CREATE SCHEMA gral
GO
CREATE SCHEMA acce
GO
CREATE SCHEMA opti
GO


--************CREACION TABLA ROLES******************--
CREATE TABLE acce.tbRoles(
	role_Id					INT IDENTITY,
	role_Nombre				NVARCHAR(100) NOT NULL,
	role_UsuCreacion		INT NOT NULL,
	role_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_role_FechaCreacion DEFAULT(GETDATE()),
	role_UsuModificacion	INT,
	role_FechaModificacion	DATETIME,
	role_Estado				BIT NOT NULL CONSTRAINT DF_role_Estado DEFAULT(1)
	CONSTRAINT PK_acce_tbRoles_role_Id PRIMARY KEY(role_Id)
);
GO


--***********CREACION TABLA PANTALLAS*****************---
CREATE TABLE acce.tbPantallas(
	pant_Id					INT IDENTITY,
	pant_Nombre				NVARCHAR(100) NOT NULL,
	pant_Url				NVARCHAR(300) NOT NULL,
	pant_Menu				NVARCHAR(300) NOT NULL,
	pant_HtmlId				NVARCHAR(80) NOT NULL,
	pant_UsuCreacion		INT NOT NULL,
	pant_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_pant_FechaCreacion DEFAULT(GETDATE()),
	pant_UsuModificacion	INT,
	pant_FechaModificacion	DATETIME,
	pant_Estado				BIT NOT NULL CONSTRAINT DF_pant_Estado DEFAULT(1)
	CONSTRAINT PK_acce_tbPantallas_pant_Id PRIMARY KEY(pant_Id)
);
GO

INSERT INTO acce.tbPantallas(pant_Nombre, pant_Url, pant_Menu, pant_HtmlId, pant_UsuCreacion)
VALUES ('Usuarios', '/Usuario/Listado', 'Seguridad', 'usuariosItem', 1),
       ('Rol', '/Rol/Listado', 'Seguridad', 'rolItem', 1),
       ('Empleados', '/Empleados/Listado', 'Optica', 'empleadosItem', 1),
	   ('Clientes', '/Clientes/Listado', 'Optica', 'clientesItem', 1),
	   ('Proveedores', '/Proveedores/Listado', 'Optica', 'proveedoresItem', 1),
	   ('Citas', '/Citas/Listado', 'Optica', 'opticaItem', 1),
	   ('Consultorio', '/Consultorio/Listado', 'Optica', 'opticaItem', 1),
	   ('Consultas', '/Consultas/Listado','Optica', 'consultasItem', 1),
	   ('Ordenes', '/Ordenes/Listado', 'Optica', 'ordenesItem', 1),
	   ('Aros', '/Aros/Listado', 'Optica', 'arosItem', 1),
	   ('Envios', '/Envios/Listado', 'Optica', 'enviosItem', 1),
	   ('Categorias', '/Categorias/Listado', 'Optica', 'categoriasItem', 1),
	   ('Direcciones', '/Direcciones/Listado', 'Optica', 'direccionItem', 1),
       ('Marca', '/Marca/Listado', 'Optica', 'marcasItem', 1)

--***********CREACION TABLA ROLES/PANTALLA*****************---
CREATE TABLE acce.tbPantallasPorRoles(
	pantrole_Id					INT IDENTITY,
	role_Id						INT NOT NULL,
	pant_Id						INT NOT NULL,
	pantrole_UsuCreacion		INT NOT NULL,
	pantrole_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_pantrole_FechaCreacion DEFAULT(GETDATE()),
	pantrole_UsuModificacion	INT,
	pantrole_FechaModificacion	DATETIME,
	pantrole_Estado				BIT NOT NULL CONSTRAINT DF_pantrole_Estado DEFAULT(1)
	CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbRoles_role_Id FOREIGN KEY(role_Id) REFERENCES acce.tbRoles(role_Id),
	CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbPantallas_pant_Id FOREIGN KEY(pant_Id)	REFERENCES acce.tbPantallas(pant_Id),
	CONSTRAINT PK_acce_tbPantallasPorRoles_pantrole_Id PRIMARY KEY(pantrole_Id),
);
GO


--****************CREACION TABLA USUARIOS****************--
CREATE TABLE acce.tbUsuarios(
	usua_Id 				INT IDENTITY(1,1),
	usua_NombreUsuario		NVARCHAR(100) NOT NULL,
	usua_Contrasena			NVARCHAR(MAX) NOT NULL,
	usua_EsAdmin			BIT,
	role_Id					INT,
	empe_Id					INT,
	usua_UsuCreacion		INT,
	usua_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_usua_FechaCreacion DEFAULT(GETDATE()),
	usua_UsuModificacion	INT,
	usua_FechaModificacion	DATETIME,
	usua_Estado				BIT NOT NULL CONSTRAINT DF_usua_Estado DEFAULT(1)
	CONSTRAINT PK_acce_tbUsuarios_usua_Id  PRIMARY KEY(usua_Id),
);

--********* PROCEDIMIENTO INSERTAR USUARIOS ADMIN**************--
GO
CREATE OR ALTER PROCEDURE acce.UDP_InsertUsuario
	@usua_NombreUsuario NVARCHAR(100),	@usua_Contrasena NVARCHAR(200),
	@usua_EsAdmin BIT,					@role_Id INT, 
	@empe_Id INT										
AS
BEGIN
	DECLARE @password NVARCHAR(MAX)=(SELECT HASHBYTES('Sha2_512', @usua_Contrasena));

	INSERT acce.tbUsuarios(usua_NombreUsuario, usua_Contrasena, usua_EsAdmin, role_Id, empe_Id, usua_UsuCreacion)
	VALUES(@usua_NombreUsuario, @password, @usua_EsAdmin, @role_Id, @empe_Id, 1);
END;


GO
EXEC acce.UDP_InsertUsuario 'admin', '123', 1, NULL, 1;


--********* ALTERAR TABLA ROLES **************--
--********* AGREGAR CAMPOS AUDITORIA**************--
GO
ALTER TABLE acce.tbRoles
ADD CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuCreacion_usua_Id 	FOREIGN KEY(role_UsuCreacion) REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuModificacion_usua_Id 	FOREIGN KEY(role_UsuModificacion) REFERENCES acce.tbUsuarios(usua_Id);




GO
INSERT INTO acce.tbRoles(role_Nombre, role_UsuCreacion)
VALUES ('Vendedor', 1)


--********* ALTERAR TABLA USUARIOS **************--
--********* AGREGAR CAMPO ROL, AUDITORIA**************--
GO
ALTER TABLE [acce].[tbUsuarios]
ADD CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_usua_UsuCreacion_usua_Id  FOREIGN KEY(usua_UsuCreacion) REFERENCES acce.tbUsuarios([usua_Id]),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_usua_UsuModificacion_usua_Id  FOREIGN KEY(usua_UsuModificacion) REFERENCES acce.tbUsuarios([usua_Id]),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbRoles_role_Id FOREIGN KEY(role_Id) REFERENCES acce.tbRoles(role_Id)

GO 
ALTER TABLE [acce].[tbPantallasPorRoles]
ADD CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuCreacion_usua_Id FOREIGN KEY([pantrole_UsuCreacion]) REFERENCES acce.tbUsuarios([usua_Id]),
	CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuModificacion_usua_Id FOREIGN KEY([pantrole_UsuModificacion]) REFERENCES acce.tbUsuarios([usua_Id])

--*******************************************--
--********TABLA DEPARTAMENTO****************---
GO
CREATE TABLE [gral].[tbDepartamentos](
	depa_Id  					CHAR(2) NOT NULL,
	depa_Nombre 				NVARCHAR(100) NOT NULL,
	depa_UsuCreacion			INT NOT NULL,
	depa_FechaCreacion			DATETIME NOT NULL CONSTRAINT DF_depa_FechaCreacion DEFAULT(GETDATE()),
	depa_UsuModificacion		INT,
	depa_FechaModificacion		DATETIME,
	depa_Estado					BIT NOT NULL CONSTRAINT DF_depa_Estado DEFAULT(1)
	CONSTRAINT PK_gral_tbDepartamentos_depa_Id 									PRIMARY KEY(depa_Id),
	CONSTRAINT FK_gral_tbDepartamentos_acce_tbUsuarios_depa_UsuCreacion_usua_Id  		FOREIGN KEY(depa_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_gral_tbDepartamentos_acce_tbUsuarios_depa_UsuModificacion_usua_Id  	FOREIGN KEY(depa_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);


--********TABLA MUNICIPIO****************---
GO
CREATE TABLE gral.tbMunicipios(
	muni_id					CHAR(4)	NOT NULL,
	muni_Nombre				NVARCHAR(80) NOT NULL,
	depa_Id					CHAR(2)	NOT NULL,
	muni_UsuCreacion		INT	NOT NULL,
	muni_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_muni_FechaCreacion DEFAULT(GETDATE()),
	muni_UsuModificacion	INT,
	muni_FechaModificacion	DATETIME,
	muni_Estado				BIT	NOT NULL CONSTRAINT DF_muni_Estado DEFAULT(1)
	CONSTRAINT PK_gral_tbMunicipios_muni_Id 										PRIMARY KEY(muni_Id),
	CONSTRAINT FK_gral_tbMunicipios_gral_tbDepartamentos_depa_Id 				    FOREIGN KEY (depa_Id) 						REFERENCES gral.tbDepartamentos(depa_Id),
	CONSTRAINT FK_gral_tbMunicipios_acce_tbUsuarios_muni_UsuCreacion_usua_Id  		FOREIGN KEY(muni_UsuCreacion) 				REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_gral_tbMunicipios_acce_tbUsuarios_muni_UsuModificacion_usua_Id  	FOREIGN KEY(muni_UsuModificacion) 			REFERENCES acce.tbUsuarios(usua_Id)
);

CREATE TABLE opti.tbCategorias
(
	cate_Id						INT IDENTITY,
	cate_Nombre					NVARCHAR(100) NOT NULL,
	cate_UsuCreacion			INT NOT NULL,
	cate_FechaCreacion			DATETIME NOT NULL CONSTRAINT DF_cate_FechaCreacion DEFAULT(GETDATE()),
	cate_UsuModificacion		INT,
	cate_FechaModificacion		DATETIME,
	cate_Estado					BIT NOT NULL CONSTRAINT DF_cate_Estado DEFAULT(1)

	CONSTRAINT PK_opti_tbCategorias_cate_Id 										    PRIMARY KEY(cate_Id),
	CONSTRAINT FK_opti_tbCategorias_acce_tbUsuarios_cate_UsuCreacion_usua_Id  			FOREIGN KEY(cate_UsuCreacion) 			REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbCategorias_acce_tbUsuarios_cate_UsuModificacion_usua_Id  		FOREIGN KEY(cate_UsuModificacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT UQ_opti_tbCategorias_cate_Nombre UNIQUE(cate_Nombre)
);

CREATE TABLE opti.tbMetodosPago
(
	meto_Id					INT IDENTITY,
	meto_Nombre				NVARCHAR(100)NOT NULL,
	meto_UsuCreacion		INT NOT NULL,
	meto_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_meto_FechaCreacion DEFAULT(GETDATE()),
	meto_UsuModificacion	INT,
	meto_FechaModificacion	DATETIME,
	meto_Estado				BIT NOT NULL CONSTRAINT DF_meto_Estado DEFAULT(1)

	CONSTRAINT PK_opti_tbMetodosPago_meto_Id 												PRIMARY KEY(meto_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_meto_UsuCreacion_usua_Id  				FOREIGN KEY(meto_UsuCreacion) 			REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_meto_UsuModificacion_usua_Id  			FOREIGN KEY(meto_UsuModificacion) 		REFERENCES acce.tbUsuarios(usua_Id)
);

CREATE TABLE opti.tbCargos
(
	carg_Id					INT IDENTITY,
	carg_Nombre				NVARCHAR(100)NOT NULL,
	carg_UsuCreacion		INT NOT NULL,
	carg_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_carg_FechaCreacion DEFAULT(GETDATE()),
	carg_UsuModificacion	INT,
	carg_FechaModificacion	DATETIME,
	carg_Estado				BIT NOT NULL CONSTRAINT DF_carg_Estado DEFAULT(1)
	CONSTRAINT PK_opti_tbMetodosPago_carg_Id 												PRIMARY KEY(carg_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_carg_UsuCreacion_usua_Id  				FOREIGN KEY(carg_UsuCreacion) 			REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_carg_UsuModificacion_usua_Id  			FOREIGN KEY(carg_UsuModificacion) 		REFERENCES acce.tbUsuarios(usua_Id)
);

CREATE TABLE gral.tbEstadosCiviles
(
	estacivi_Id					INT IDENTITY,
	estacivi_Nombre				NVARCHAR(50),
	estacivi_UsuCreacion		INT NOT NULL,
	estacivi_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_estacivi_FechaCreacion DEFAULT(GETDATE()),
	estacivi_UsuModificacion	INT,
	estacivi_FechaModificacion	DATETIME,
	estacivi_Estado				BIT NOT NULL CONSTRAINT DF_estacivi_Estado DEFAULT(1)
   
   CONSTRAINT PK_gral_tbEstadosCiviles 												PRIMARY KEY(estacivi_Id),
   CONSTRAINT FK_gral_tbEstadosCiviles_acce_tbUsuarios_estacivi_UsuCreacion_usua_Id  	FOREIGN KEY(estacivi_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
   CONSTRAINT FK_gral_tbEstadosCiviles_acce_tbUsuarios_estacivi_UsuModificacion_usua_Id  FOREIGN KEY(estacivi_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);

CREATE TABLE opti.tbProveedores
(
	prov_Id						INT IDENTITY,
	prov_Nombre					NVARCHAR(200) NOT NULL,
	prov_Direccion				NVARCHAR(500) NOT NULL,
	prov_CorreoElectronico      NVARCHAR(200) NOT NULL,
	prov_Telefono				NVARCHAR(15)NOT NULL,
	prov_UsuCreacion			INT NOT NULL,
	prov_FechaCreacion			DATETIME NOT NULL CONSTRAINT DF_prov_FechaCreacion DEFAULT(GETDATE()),
	prov_UsuModificacion		INT,
	prov_FechaModificacion		DATETIME,
	prov_Estado					BIT NOT NULL CONSTRAINT DF_prov_Estado DEFAULT(1)

	CONSTRAINT PK_opti_tbProveedores_prov_Id											PRIMARY KEY(prov_Id),
	CONSTRAINT FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuCreacion_usua_Id  			FOREIGN KEY(prov_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT  FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuModificacion_usua_Id 		FOREIGN KEY(prov_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);

--***************TABLA SucursalES*************************--
GO
CREATE TABLE opti.tbSucursales(
    sucu_Id                             INT IDENTITY(1,1), 
    sucu_Descripcion                    NVARCHAR(200) NOT NULL,
    muni_Id                             CHAR(4),
    sucu_DireccionExacta                NVARCHAR(500) NOT NULL,
    sucu_FechaCreacion                  DATETIME NOT NULL CONSTRAINT DF_sucu_FechaCreacion DEFAULT(GETDATE()),
    sucu_UsuCreacion                    INT not null,
    sucu_FechaModificacion              DATETIME,
    sucu_UsuModificacion                INT,
    sucu_Estado                         BIT NOT NULL CONSTRAINT DF_sucu_Estado DEFAULT(1),
    CONSTRAINT PK_opti_tbSucursales_sucu_Id PRIMARY KEY(sucu_Id),
    CONSTRAINT FK_opti_gral_tbSucursales_muni_Id FOREIGN KEY (muni_Id) REFERENCES gral.tbMunicipios (muni_Id),
    CONSTRAINT FK_opti_acce_tbSucursales_usua_Id FOREIGN KEY (sucu_UsuCreacion) REFERENCES acce.tbUsuarios (usua_Id)
);

--********TABLA EMPLEADOS****************---
GO
CREATE TABLE opti.tbEmpleados(
    empe_Id                     INT IDENTITY(1,1),
    empe_Nombres                NVARCHAR(100)  NOT NULL,
    empe_Apellidos              NVARCHAR(100)  NOT NULL,
    empe_Identidad              VARCHAR(13)    NOT NULL,
    empe_FechaNacimiento        DATE           NOT NULL,
    empe_Sexo                   CHAR(1)        NOT NULL,
    estacivi_Id                 INT            NOT NULL,
    empe_Telefono               NVARCHAR(15)   NOT NULL,
    empe_CorreoElectronico      NVARCHAR(200)  NOT NULL,
    sucu_Id                     INT            NOT NULL,
    empe_UsuCreacion            INT            NOT NULL,
    empe_FechaCreacion          DATETIME       NOT NULL CONSTRAINT DF_empe_FechaCreacion DEFAULT(GETDATE()),
    empe_UsuModificacion        INT,
    empe_FechaModificacion      DATETIME,
    empe_Estado                 BIT NOT NULL CONSTRAINT DF_empe_Estado DEFAULT(1),
    
    CONSTRAINT PK_maqu_tbEmpleados_empe_Id                                        PRIMARY KEY(empe_Id),
    CONSTRAINT CK_maqu_tbEmpleados_empe_Sexo                                      CHECK(empe_sexo IN ('F', 'M')),
    CONSTRAINT FK_maqu_tbEmpleados_gral_tbEstadosCiviles_estacivi_Id             FOREIGN KEY(estacivi_Id)                  REFERENCES gral.tbEstadosCiviles(estacivi_Id),        
    CONSTRAINT FK_maqu_tbEmpleados_acce_tbUsuarios_usuaCreate                    FOREIGN KEY(empe_UsuCreacion)             REFERENCES acce.tbUsuarios(usua_Id),
    CONSTRAINT FK_maqu_tbEmpleados_acce_tbUsuarios_usuaUpdate                    FOREIGN KEY(empe_UsuModificacion)         REFERENCES acce.tbUsuarios(usua_Id),
    CONSTRAINT FK_maqu_tbEmpleados_maqu_tbSucursales_sucu_Id                      FOREIGN KEY(sucu_Id)                     REFERENCES opti.tbSucursales(sucu_Id)      
);

--********TABLA Clientes****************---
CREATE TABLE opti.tbClientes
(
	clie_Id						INT IDENTITY,
	clie_Nombres				NVARCHAR(300) NOT NULL,
	clie_Apellidos				NVARCHAR(300) NOT NULL,
	clie_Identidad				VARCHAR(13)	  NOT NULL,
	clie_Sexo					CHAR NOT NULL,
	clie_FechaNacimiento		DATE NOT NULL,
	estacivi_Id					INT	NOT NULL,
	clie_Telefono				NVARCHAR(15) NOT NULL,
	clie_CorreoElectronico		NVARCHAR(150) NOT NULL,
    clie_UsuCreacion			INT				NOT NULL,
	clie_FechaCreacion			DATETIME		NOT NULL CONSTRAINT DF_clie_FechaCreacion DEFAULT(GETDATE()),
	clie_UsuModificacion		INT,
	clie_FechaModificacion		DATETIME,
	clie_Estado					BIT NOT NULL CONSTRAINT DF_clie_Estado DEFAULT(1),

	CONSTRAINT PK_opti_tbClientes_clie_Id 										PRIMARY KEY(clie_Id),
	CONSTRAINT CK_opti_tbClientes_empe_Sexo 									CHECK(clie_sexo IN ('F', 'M')),
	CONSTRAINT FK_opti_tbClientes_gral_tbEstadosCiviles_estacivi_Id				FOREIGN KEY(estacivi_Id)			REFERENCES gral.tbEstadosCiviles(estacivi_Id),		
	CONSTRAINT FK_opti_tbClientes_acce_tbUsuarios_clie_UsuCreacion_usua_Id  	FOREIGN KEY(clie_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbClientes_acce_tbUsuarios_clie_UsuModificacion_usua_Id  FOREIGN KEY(clie_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)		
);

--********TABLA Aros****************---
CREATE TABLE opti.tbAros
(
	aros_Id								INT IDENTITY,
	aros_Descripcion					NVARCHAR(300)NOT NULL,
	aros_CostoUni						DECIMAL(18,2) NOT NULL,
	cate_Id								INT NOT NULL,
	prov_Id								INT NOT NULL,
	marc_Id								INT NOT NULL,
	aros_Stock							INT NOT NULL,
	aros_UsuCreacion					INT NOT NULL,
	aros_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_aros_FechaCreacion DEFAULT(GETDATE()),
	aros_FechaModificacion				DATETIME,
	aros_UsuModificacion				INT,
	aros_Estado							BIT NOT NULL CONSTRAINT DF_aros_Estado DEFAULT(1),

	CONSTRAINT PK_opti_tbAros_aros_Id 											PRIMARY KEY(aros_Id),
	CONSTRAINT FK_opti_tbAros_opti_tbProveedores_prov_Id 						FOREIGN KEY(prov_Id) 				REFERENCES opti.tbProveedores(prov_Id),
	CONSTRAINT FK_opti_tbAros_opti_tbCategorias_cate_Id 						FOREIGN KEY(cate_Id) 				REFERENCES opti.tbCategorias(cate_Id),
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuCreacion_usua_Id  		FOREIGN KEY(aros_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuModificacion_usua_Id  	FOREIGN KEY(aros_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);

--******************************************************TABLE Marcas******************************************************--

CREATE TABLE opti.tbMarcas
(
	marc_Id					INT IDENTITY(1,1),
	marc_Nombre				NVARCHAR(150) NOT NULL,

	marc_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	marc_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	marc_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbMarcas_marc_Id	PRIMARY KEY (marc_Id)
);

ALTER TABLE opti.tbMarcas 
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios(usua_Id)
GO

ALTER TABLE opti.tbMarcas 
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO
--*****************************************************/TABLE Marcas******************************************************--

--**************************************************TABLE Consultorios****************************************************--

CREATE TABLE opti.tbConsultorios
(
	cons_Id					INT IDENTITY(1,1),
	cons_Nombre				NVARCHAR(150) NOT NULL,
	empe_Id					INT NOT NULL,

	cons_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	cons_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	cons_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbConsultorios_cons_Id PRIMARY KEY (cons_Id),
	CONSTRAINT FK_opti_tbConsultorios_empe_Id_opti_tbEmpleados_empe_Id FOREIGN KEY (empe_Id) REFERENCES opti.tbEmpleados (empe_Id)
);
GO

ALTER TABLE opti.tbConsultorios 
ADD CONSTRAINT FK_opti_tbConsultorios_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbConsultorios 
ADD CONSTRAINT FK_opti_tbConsultorios_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO
--*************************************************/TABLE Consultorios****************************************************--

--******************************************************TABLE Citas*******************************************************--

CREATE TABLE opti.tbCitas
(
	cita_Id					INT IDENTITY(1,1),
	clie_Id					INT NOT NULL,
	cons_Id					INT NOT NULL,
	cita_Fecha				DATE NOT NULL,

	cita_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	cita_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	cita_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbCitas_cita_Id	PRIMARY KEY (cita_Id),
	CONSTRAINT FK_opti_tbCitas_cita_Id_opti_tbClientes_clie_Id FOREIGN KEY (clie_Id) REFERENCES opti.tbClientes (clie_Id),
	CONSTRAINT FK_opti_tbCitas_cons_Id_opti_tbConsultorios_cons_Id FOREIGN KEY (cons_Id) REFERENCES opti.tbConsultorios (cons_Id)
);
GO

ALTER TABLE opti.tbCitas 
ADD CONSTRAINT FK_opti_tbCitas_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbCitas 
ADD CONSTRAINT FK_opti_tbCitas_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO
--*****************************************************/TABLE Citas*******************************************************--

--*************************************************TABLE Detalles Citas***************************************************--

CREATE TABLE opti.tbDetallesCitas
(
	deci_Id					INT IDENTITY(1,1),
	cita_Id					INT NOT NULL,
	deci_Costo				DECIMAL(18, 2) NOT NULL,
	deci_HoraInicio			VARCHAR(5) NOT NULL,
	deci_HoraFin			VARCHAR(5) NOT NULL,

	deci_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	deci_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	deci_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbDetallesCitas_ PRIMARY KEY (deci_Id),
	CONSTRAINT FK_opti_tbDetallesCitas_cita_Id_opti_tbCitas_cita_Id FOREIGN KEY (cita_Id) REFERENCES opti.tbCitas (cita_Id) 
);
GO

ALTER TABLE opti.tbDetallesCitas 
ADD CONSTRAINT FK_opti_tbDetallesCitas_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesCitas 
ADD CONSTRAINT FK_opti_tbDetallesCitas_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO
--************************************************/TABLE Detalles Citas***************************************************--

--******************************************************TABLE Ordenes******************************************************--

CREATE TABLE opti.tbOrdenes
(
	orde_Id					INT IDENTITY(1,1),
	clie_Id					INT NOT NULL,
	orde_Fecha				DATE DEFAULT GETDATE(),
    orde_FechaEntrega		DATE NOT NULL,
	orde_FechaEntregaReal	DATE,
	sucu_Id					INT NOT NULL,

	orde_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	orde_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	orde_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbOrdenes_orde_Id PRIMARY KEY (orde_Id),
	CONSTRAINT FK_opti_tbOrdenes_clie_Id_opti_tbClientes_clie_Id FOREIGN KEY (clie_Id) REFERENCES opti.tbClientes (clie_Id),
	CONSTRAINT FK_opti_tbOrdenes_sucu_Id_opti_tbSucursales_sucu_Id FOREIGN KEY (sucu_Id) REFERENCES opti.tbSucursales (sucu_Id)
);
GO

ALTER TABLE opti.tbOrdenes 
ADD CONSTRAINT FK_opti_tbOrdenes_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbOrdenes 
ADD CONSTRAINT FK_opti_tbOrdenes_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--*****************************************************/TABLE Ordenes******************************************************--

--**************************************************TABLE DetallesOrdenes**************************************************--

CREATE TABLE opti.tbDetallesOrdenes
(
	deor_Id					INT IDENTITY(1,1),
	orde_Id					INT NOT NULL,
	aros_Id					INT NOT NULL,
	deor_GraduacionLeft		VARCHAR(10),
	deor_GraduacionRight	VARCHAR(10),
	deor_Precio				DECIMAL(18,2) NOT NULL,
	deor_Cantidad			INT NOT NULL,
	deor_Total				DECIMAL(18,2) NOT NULL,

	orde_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	orde_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	orde_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbDetallesOrdenes_deor_Id PRIMARY KEY (deor_Id),
	CONSTRAINT FK_opti_tbDetallesOrdenes_orde_Id_opti_tbOrdenes_orde_Id FOREIGN KEY (orde_Id) REFERENCES opti.tbOrdenes (orde_Id),
	CONSTRAINT FK_opti_tbDetallesOrdenes_aros_Id_opti_tbAros_aros_Id FOREIGN KEY (aros_Id) REFERENCES opti.tbAros (aros_Id)
);
GO

ALTER TABLE opti.tbDetallesOrdenes 
ADD CONSTRAINT FK_opti_tbDetallesOrdenes_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesOrdenes 
ADD CONSTRAINT FK_opti_tbDetallesOrdenes_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--**************************************************TABLE DetallesOrdenes**************************************************--


--****************************************************TABLE Direcciones****************************************************--

CREATE TABLE opti.tbDirecciones
(
	dire_Id						INT IDENTITY(1,1),
	muni_Id						CHAR(4) NOT NULL,
	dire_DireccionExacta		NVARCHAR(MAX) NOT NULL,
	
	clie_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	clie_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	clie_FechaModificacion		DATETIME DEFAULT NULL,
	CONSTRAINT PK_tbDirecciones_dire_Id PRIMARY KEY (dire_Id),
	CONSTRAINT FK_tbDirecciones_muni_Id_tbMunicipios_muni_Id FOREIGN KEY (muni_Id) REFERENCES gral.tbMunicipios (muni_Id)
);
GO

ALTER TABLE opti.tbDirecciones 
ADD CONSTRAINT FK_opti_tbDirecciones_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDirecciones 
ADD CONSTRAINT FK_opti_tbDirecciones_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--***************************************************/TABLE Direcciones****************************************************--

--***********************************************TABLE DireccionesPorCliente***********************************************--

CREATE TABLE opti.tbDireccionesPorCliente
(
	dicl_Id						INT IDENTITY(1,1),
	clie_Id						INT NOT NULL,
	dire_Id						INT NOT NULL,

	clie_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	clie_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	clie_FechaModificacion		DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbDireccionesPorCliente_dicl_Id PRIMARY KEY (dicl_Id),
	CONSTRAINT FK_opti_tbDireccionesPorCliente_clie_Id_opti_tbClientes_clie_Id FOREIGN KEY (clie_Id) REFERENCES opti.tbClientes (clie_Id),
	CONSTRAINT FK_opti_tbDireccionesPorCliente_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
);
GO

ALTER TABLE opti.tbDireccionesPorCliente 
ADD CONSTRAINT FK_opti_tbDireccionesPorCliente_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDireccionesPorCliente 
ADD CONSTRAINT FK_opti_tbDireccionesPorCliente_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--***********************************************/TABLE DireccionesPorCliente***********************************************--

--*******************************************************TABLE Envios******************************************************--

CREATE TABLE opti.tbEnvios
(
	envi_Id						INT IDENTITY(1,1),
	clie_Id						INT NOT NULL,
	dire_Id						INT NOT NULL,
	envi_Fecha					DATE DEFAULT GETDATE(),
	envi_FechaEntrega			DATE NOT NULL,
	envi_FechaEntregaReal		DATE NOT NULL,

	clie_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	clie_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	clie_FechaModificacion		DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbEnvios_envi_Id PRIMARY KEY (envi_Id),
	CONSTRAINT FK_opti_tbEnvios_clie_Id_opti_tbClientes_clie_Id FOREIGN KEY (clie_Id) REFERENCES opti.tbClientes (clie_Id),
	CONSTRAINT FK_opti_tbDirecciones_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
);
GO

ALTER TABLE opti.tbEnvios 
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbEnvios 
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO


--********TABLA Factura****************---
CREATE TABLE opti.tbFacturas
(
	fact_Id								INT IDENTITY,
	clie_Id								INT NOT NULL,
	fact_Fecha							DATETIME NOT NULL,
	meto_Id								INT NOT NULL,
	empe_Id								INT NOT NULL,
	fact_esEnvio						BIT NOT NULL,
	fact_PrecioTotal					DECIMAL(18,2),
	fact_UsuCreacion					INT NOT NULL,
	fact_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_fact_FechaCreacion DEFAULT(GETDATE()),
	fact_FechaModificacion				DATETIME,
	fact_UsuModificacion				INT,
	fact_Estado							BIT NOT NULL CONSTRAINT DF_fact_Estado DEFAULT(1),

	CONSTRAINT PK_opti_tbFacturas_fact_Id 											PRIMARY KEY(fact_Id),
	CONSTRAINT FK_opti_tbFacturas_opti_tbClientes_clie_Id 							FOREIGN KEY(clie_Id) 				REFERENCES opti.tbClientes(clie_Id),
	CONSTRAINT FK_opti_tbFacturas_opti_tbMetodosPago_meto_Id 						FOREIGN KEY(meto_Id) 				REFERENCES opti.tbMetodosPago(meto_Id),
	CONSTRAINT FK_opti_tbFacturas_opti_tbEmpleados_empe_Id							FOREIGN KEY(empe_Id)				REFERENCES opti.tbEmpleados(empe_Id),
	CONSTRAINT FK_opti_tbFacturas_acce_tbUsuarios_fact_UsuCreacion_usua_Id  		FOREIGN KEY(fact_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbFacturas_acce_tbUsuarios_fact_UsuModificacion_usua_Id  	FOREIGN KEY(fact_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
)

--********TABLA Factura Detalles****************---
CREATE TABLE opti.tbFacturasDetalles
(
	factdeta_Id								INT IDENTITY,
	fact_Id									INT NOT NULL,
	cons_Id									INT NOT NULL,
	aros_Id									INT NOT NULL,
	orde_Id									INT NOT NULL,
	envi_Id									INT NOT NULL,
	factdeta_Precio							DECIMAL(18,2) NOT NULL,
	factdeta_UsuCreacion					INT NOT NULL,
	factdeta_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_factdeta_FechaCreacion DEFAULT(GETDATE()),
	factdeta_FechaModificacion				DATETIME,
	factdeta_UsuModificacion				INT,
	factdeta_Estado							BIT NOT NULL CONSTRAINT DF_factdeta_Estado DEFAULT(1),

	CONSTRAINT PK_opti_tbFacturasDetalles_factdeta_Id 											PRIMARY KEY(factdeta_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_opti_tbFacturas_fact_Id 								FOREIGN KEY(fact_Id) 					REFERENCES opti.tbFacturas(fact_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_opti_tbAros_aros_Id									FOREIGN KEY(aros_Id)					REFERENCES opti.tbAros(aros_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_opti_tbEnvios_envi_Id									FOREIGN KEY(envi_Id)					REFERENCES opti.tbEnvios(envi_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_opti_tbOrdenes_orde_Id								FOREIGN KEY(orde_Id)					REFERENCES opti.tbOrdenes(orde_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuCreacion_usua_Id  		FOREIGN KEY(factdeta_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuModificacion_usua_Id  	FOREIGN KEY(factdeta_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);

--******************************************************/TABLE Envios******************************************************--

--***************************************************TABLE DetallesEnvios**************************************************--

CREATE TABLE opti.tbDetallesEnvios
(
	deen_Id		INT IDENTITY(1,1),
	envi_Id		INT NOT NULL,
	orde_Id		INT NOT NULL,

	clie_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	clie_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	clie_FechaModificacion		DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbDetallesEnvios_deen_Id PRIMARY KEY (deen_Id),
	CONSTRAINT FK_opti_tbDetallesEnvios_envi_Id_opti_tbEnvios_envi_Id FOREIGN KEY (envi_Id) REFERENCES opti.tbEnvios (envi_Id),
	CONSTRAINT FK_opti_tbDetallesEnvios_orde_Id_opti_tbOrdenes_orde_Id FOREIGN KEY (orde_Id) REFERENCES opti.tbOrdenes (orde_Id)
);
GO

ALTER TABLE opti.tbDetallesEnvios 
ADD CONSTRAINT FK_opti_tbDetallesEnvios_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesEnvios 
ADD CONSTRAINT FK_opti_tbDetallesEnvios_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--**************************************************/TABLE DetallesEnvios**************************************************--


--*****PROCEDIMIENTOS ALMACENADOS*****--

---------- USUARIOS -----------

--Iniciar sesion
GO
CREATE OR ALTER PROCEDURE UDP_Login 
	@usua_Nombre NVARCHAR(100), 
	@usua_Contrasena NVARCHAR(200)
AS
BEGIN

	DECLARE @contraEncriptada NVARCHAR(MAX) = HASHBYTES('SHA2_512', @usua_Contrasena);

	SELECT [usua_Id], [usua_NombreUsuario], [role_Id], usua_EsAdmin, role_Id, empe_NombreCompleto
	FROM acce.VW_tbUsuarios
	WHERE [usua_Contrasena] = @contraEncriptada
	AND [usua_NombreUsuario] = @usua_Nombre
	AND [usua_Estado] = 1
END

/*UDP para vista de usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_VW_tbUsuarios
	@usua_Id INT
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios WHERE usua_Id = @usua_Id
END

/*Vista usuarios*/
GO
CREATE OR ALTER VIEW acce.VW_tbUsuarios
AS
	SELECT t1.usua_Id, 
		   t1.usua_NombreUsuario, 
		   t1.usua_Contrasena, 
		   t1.usua_EsAdmin, 
		   t1.role_Id,
		   t2.role_Nombre, 
		   t1.empe_Id,
		   (SELECT t3.empe_Nombres + ' '+ empe_Apellidos) AS empe_NombreCompleto, 
		   t1.usua_UsuCreacion, 
		   t4.usua_NombreUsuario AS usua_UsuCreacion_Nombre,
		   t1.usua_FechaCreacion, 
	       t1.usua_UsuModificacion,
		   t5.usua_NombreUsuario AS usua_UsuModificacion_Nombre, 
		   t1.usua_FechaModificacion,
		   t1.usua_Estado,
		   sucu_Id 
		   FROM acce.tbUsuarios t1 LEFT JOIN acce.tbRoles t2
		   ON t1.role_Id = t2.role_Id
		   LEFT JOIN opti.tbEmpleados t3
		   ON t3.empe_Id = t1.empe_Id 
		   LEFT JOIN acce.tbUsuarios t4
		   ON t1.usua_UsuCreacion = T4.usua_Id
		   LEFT JOIN acce.tbUsuarios t5
		   ON t1.usua_UsuModificacion = t5.usua_Id

/*Insertar Usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_Insert
	@usua_NombreUsuario NVARCHAR(150),
	@usua_Contrasena NVARCHAR(MAX),
	@usua_EsAdmin BIT,
	@role_Id INT, 
	@empe_Id INT,
	@usua_usuCreacion INT
AS 
BEGIN
	
	BEGIN TRY
		
		DECLARE @password NVARCHAR(MAX)=(SELECT HASHBYTES('Sha2_512', @usua_Contrasena));

		IF NOT EXISTS (SELECT * FROM acce.tbUsuarios
						WHERE @usua_NombreUsuario = usua_NombreUsuario)
		BEGIN
			INSERT INTO acce.tbUsuarios
			VALUES(@usua_NombreUsuario,@password,@usua_EsAdmin,@role_Id,@empe_Id,@usua_usuCreacion,GETDATE(),NULL,NULL,1)

			SELECT 'El usuario se ha insertado'
		END
		ELSE IF EXISTS (SELECT * FROM acce.tbUsuarios
						WHERE @usua_NombreUsuario = usua_NombreUsuario
							  AND usua_Estado = 1)

			SELECT 'Este usuario ya existe'
		ELSE
			BEGIN
				UPDATE acce.tbUsuarios
				SET usua_Estado = 1,
					usua_Contrasena = @password,
					usua_EsAdmin = @usua_EsAdmin,
					role_Id = @role_Id,
					empe_Id = @empe_Id
				WHERE usua_NombreUsuario = @usua_NombreUsuario

				SELECT 'El usuario se ha insertado'
			END
	END TRY
	BEGIN CATCH
		SELECT 0
	END CATCH 
END

/*Listar Usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_List
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios
END

/*Editar usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_UPDATE
	@usua_Id					INT,
	@usua_EsAdmin				BIT,
	@role_Id					INT,
	@empe_Id					INT,
	@usua_UsuModificacion		INT
AS
BEGIN
	BEGIN TRY
		UPDATE acce.tbUsuarios
		SET usua_EsAdmin = @usua_EsAdmin,
			role_Id = @role_Id,
			empe_Id = @empe_Id,
			usua_UsuModificacion = @usua_UsuModificacion,
			usua_FechaModificacion = GETDATE()
		WHERE usua_Id = @usua_Id

		SELECT 'El usuario ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_DELETE
	@usua_Id	INT
AS
BEGIN
	BEGIN TRY
		UPDATE acce.tbUsuarios
		SET usua_Estado = 0
		WHERE usua_Id = @usua_Id

		SELECT 'El usuario ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- CARGOS -----------

/*UDP para vista de cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_VW_tbCargos 
	@carg_Id INT
AS
BEGIN
	SELECT * FROM opti.VW_tbCargos WHERE carg_Id = @carg_Id
END

/*Vista cargos*/
GO
CREATE OR ALTER VIEW opti.VW_tbCargos
AS
	SELECT t1.carg_Id, 
		   t1.carg_Nombre,
		   t1.carg_UsuCreacion, 
		   t2.usua_NombreUsuario AS usua_UsuCreacion_Nombre,
		   t1.carg_FechaCreacion, 
	       t1.carg_UsuModificacion,
		   t3.usua_NombreUsuario AS usua_UsuModificacion_Nombre, 
		   t1.carg_FechaModificacion,
		   t1.carg_Estado
		   FROM opti.tbCargos t1 INNER JOIN acce.tbUsuarios t2
		   ON t1.carg_UsuCreacion = T2.usua_Id
		   LEFT JOIN acce.tbUsuarios t3
		   ON t1.carg_UsuModificacion = t3.usua_Id
		   WHERE carg_Estado = 1

/*Insertar Cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCargos_Insert
	@carg_Nombre		NVARCHAR(150),
	@carg_UsuCreacion   INT
AS 
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbCargos 
						WHERE carg_Nombre = @carg_Nombre)
			BEGIN
			INSERT INTO opti.tbCargos(carg_Nombre, carg_UsuCreacion)
			VALUES(@carg_Nombre, @carg_UsuCreacion)
			
			SELECT 'El cargo ha sido insertado'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbCargos 
						WHERE carg_Nombre = @carg_Nombre
						AND carg_Estado = 0)
			BEGIN
				UPDATE opti.tbCargos 
				SET carg_Estado = 1
				WHERE carg_Nombre = @carg_Nombre

				SELECT 'El cargo ha sido insertado'
			END
		ELSE
			SELECT 'Este cargo ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Listar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCargos_List
AS
BEGIN
	SELECT carg_Id, carg_Nombre 
	FROM opti.VW_tbCargos
END

/*Editar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCargos_Update
	@carg_Id					INT,
	@carg_Nombre				NVARCHAR(150),
	@carg_UsuModificacion		INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbCargos 
						WHERE @carg_Nombre = [carg_Nombre])
		BEGIN			
			UPDATE opti.tbCargos
			SET 	[carg_Nombre] = @carg_Nombre,
					[carg_UsuModificacion] = @carg_UsuModificacion,
					[carg_FechaModificacion] = GETDATE()
			WHERE 	[carg_Id] = @carg_Id

			SELECT 'El cargo ha sido editado'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbCargos
						WHERE @carg_Nombre = [carg_Nombre]
							  AND carg_Estado = 1
							  AND [carg_Id] != @carg_Id)

			SELECT 'El cargo ya existe'
		ELSE
			UPDATE opti.tbCargos
			SET carg_Estado = 1,
			    [carg_UsuModificacion] = @carg_UsuModificacion,
				[carg_FechaModificacion] = GETDATE()
			WHERE @carg_Nombre = [carg_Nombre]

			SELECT 'El cargo ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCargos_Delete
	@carg_Id	INT
AS
BEGIN
	BEGIN TRY
		UPDATE opti.tbCargos
		SET carg_Estado = 0
		WHERE carg_Id = @carg_Id

		SELECT 'El cargo ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- CATEGORÍAS -----------
GO
CREATE OR ALTER VIEW opti.VW_tbCategorias
AS
	SELECT cate_Id, 
		   cate_Nombre, 
		   cate_UsuCreacion,
		   [usua1].usua_NombreUsuario AS cate_UsuCreacion_Nombre, 
		   cate_FechaCreacion, 
		   cate_UsuModificacion,
		   [usua2].usua_NombreUsuario AS cate_UsuModificacion_Nombre, 
		   cate_FechaModificacion, 
		   cate_Estado
FROM opti.tbCategorias cate INNER JOIN acce.tbUsuarios [usua1]
ON cate.cate_UsuCreacion = [usua1].usua_Id LEFT JOIN acce.tbUsuarios [usua2]
ON cate.cate_UsuModificacion = [usua2].usua_Id
WHERE cate.cate_Estado = 1

/*Vista Categorias UDP*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_VW_tbCategorias
AS
BEGIN
	SELECT * FROM opti.VW_tbCategorias
END

/*Listado de categorias*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCategorias_List
AS
BEGIN
	SELECT [cate_Id], [cate_Nombre] 
	FROM opti.VW_tbCategorias
END

/*Insertar categoria*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCategorias_Insert
	@cate_Nombre 			NVARCHAR(100),
	@cate_UsuCreacion 		INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.[tbCategorias] 
						WHERE cate_Nombre = @cate_Nombre)
			BEGIN
			INSERT INTO opti.[tbCategorias](cate_Nombre, cate_UsuCreacion)
			VALUES(@cate_Nombre, @cate_UsuCreacion)
			
			SELECT 'La categoría ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM opti.[tbCategorias] 
						WHERE cate_Nombre = @cate_Nombre
						AND cate_Estado = 0)
			BEGIN
				UPDATE [maqu].[tbCategorias]
				SET cate_Estado = 1
				WHERE cate_Nombre = @cate_Nombre

				SELECT 'La categoría ha sido insertada con éxito'
			END
		ELSE
			SELECT 'La categoría ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar categoria*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCategorias_Update
	@cate_Id					INT,
	@cate_Nombre 				NVARCHAR(100),
	@cate_UsuModificacion 		INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.[tbCategorias]
						WHERE @cate_Nombre = [cate_Nombre])
		BEGIN			
			UPDATE opti.[tbCategorias]
			SET 	[cate_Nombre] = @cate_Nombre,
					[cate_UsuModificacion] = @cate_UsuModificacion,
					[cate_FechaModificacion] = GETDATE()
			WHERE 	[cate_Id] = @cate_Id
			SELECT 'La categoría ha sido editada con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM [maqu].[tbCategorias]
						WHERE @cate_Nombre = [cate_Nombre]
							  AND cate_Estado = 1
							  AND [cate_Id] != @cate_Id)
			SELECT 'La categoría ya existe'
		ELSE
			UPDATE [maqu].[tbCategorias]
			SET cate_Estado = 1,
			   cate_UsuModificacion = @cate_UsuModificacion
			WHERE [cate_Nombre] = @cate_Nombre

			SELECT 'La categoría ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar categoria*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbCategorias_Delete 
	@cate_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbAros WHERE cate_Id = @cate_Id)
			BEGIN
				UPDATE opti.[tbCategorias]
				SET cate_Estado = 0
				WHERE cate_Id = @cate_Id

				SELECT 'La categoría ha sido eliminada'
			END
		ELSE
			SELECT 'La categoría no puede ser eliminada ya que está siendo usada'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- CLIENTES -----------

/*Vista clientes*/
GO
CREATE OR ALTER VIEW opti.VW_tbClientes
AS
	SELECT [clie_Id], 
		   [clie_Nombres], 
		   [clie_Apellidos],
		   ([clie_Nombres] + ' ' + [clie_Apellidos]) AS clie_NombreCompleto,
		   [clie_Identidad], 
		   CASE WHEN [clie_Sexo] = 'F' THEN 'Femenino'
				ELSE 'Masculino'
		   END AS clie_Sexo,
		   [clie_FechaNacimiento], 
		   T1.[estacivi_Id], 
		   t4.estacivi_Nombre AS clie_EstadoCivilNombre,
		   [clie_Telefono], 
		   [clie_CorreoElectronico], 
		   [clie_UsuCreacion], 
		   T2.usua_NombreUsuario AS clie_NombreUsuarioCreacion,
		   [clie_FechaCreacion], 
		   [clie_UsuModificacion], 
		   T3.usua_NombreUsuario AS clie_NombreUsuarioModificacion,
		   [clie_FechaModificacion], 
		   [clie_Estado]
	FROM opti.tbClientes T1 INNER JOIN acce.tbUsuarios T2
	ON T1.clie_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.clie_UsuModificacion = T3.usua_Id INNER JOIN gral.tbEstadosCiviles T4
	ON T1.estacivi_Id = T4.estacivi_Id

	

/*List vista clientes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbClientes_List
AS
BEGIN
	SELECT * FROM opti.VW_tbClientes
END

/*Insertar clientes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbClientes_Insert
	@clie_Nombres				NVARCHAR(300), 
	@clie_Apellidos				NVARCHAR(300), 
	@clie_Identidad				NVARCHAR(13), 
	@clie_Sexo					CHAR, 
	@clie_FechaNacimiento		DATE, 
	@estacivi_Id				INT, 
	@clie_Telefono				NVARCHAR(15), 
	@clie_CorreoElectronico		NVARCHAR(150), 
	@clie_UsuCreacion			INT
AS
BEGIN
	BEGIN TRY

		IF NOT EXISTS (SELECT clie_Identidad FROM opti.tbClientes
						WHERE clie_Identidad = @clie_Identidad)
			BEGIN
				INSERT INTO opti.tbClientes([clie_Nombres], 
											[clie_Apellidos], [clie_Identidad], 
											[clie_Sexo], [clie_FechaNacimiento], 
											[estacivi_Id], [clie_Telefono], 
											[clie_CorreoElectronico], 
											[clie_UsuCreacion])
				VALUES(@clie_Nombres, @clie_Apellidos,
					   @clie_Identidad, @clie_Sexo,
					   @clie_FechaNacimiento, @estacivi_Id,
					   @clie_Telefono, @clie_CorreoElectronico,
					   @clie_UsuCreacion)

				SELECT 'El cliente ha sido ingresado con éxito'

			END
		ELSE IF EXISTS (SELECT clie_Identidad FROM opti.tbClientes
						WHERE clie_Identidad = @clie_Identidad
						AND clie_Estado = 1)

			SELECT 'Ya existe un cliente con este número de identidad'
		ELSE
			BEGIN
				UPDATE opti.tbClientes
				SET clie_Estado = 1,
					[clie_Nombres] = @clie_Nombres, 
					[clie_Apellidos] = @clie_Apellidos, 
					[clie_Identidad] = @clie_Identidad, 
					[clie_Sexo] = @clie_Sexo, 
					[clie_FechaNacimiento] = @clie_FechaNacimiento, 
					[estacivi_Id] = @estacivi_Id, 
					[clie_Telefono] = @clie_Telefono, 
					[clie_CorreoElectronico] = @clie_CorreoElectronico 
				WHERE clie_Identidad = @clie_Identidad

				SELECT 'El cliente ha sido ingresado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Editar Cliente*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbClientes_Update
	@clie_Id					INT,
	@clie_Nombres				NVARCHAR(300), 
	@clie_Apellidos				NVARCHAR(300), 
	@clie_Identidad				NVARCHAR(13), 
	@clie_Sexo					CHAR, 
	@clie_FechaNacimiento		DATE, 
	@estacivi_Id				INT, 
	@clie_Telefono				NVARCHAR(15), 
	@clie_CorreoElectronico		NVARCHAR(150), 
	@clie_UsuModificacion		INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.[tbClientes]
						WHERE @clie_Identidad = clie_Identidad)
		BEGIN	
			UPDATE opti.[tbClientes]
					   SET clie_Nombres = @clie_Nombres,
						clie_Apellidos = @clie_Apellidos,
						clie_Identidad = @clie_Identidad,
						clie_Sexo = @clie_Sexo,
						[clie_FechaNacimiento] = @clie_FechaNacimiento,
						[estacivi_Id] = @estacivi_Id, 
						clie_Telefono = @clie_Telefono,
						clie_CorreoElectronico = @clie_CorreoElectronico,
						clie_UsuModificacion = @clie_UsuModificacion,
						clie_FechaModificacion = GETDATE()
				WHERE   clie_Id = @clie_Id	

			SELECT 'El cliente ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.[tbClientes]
						WHERE @clie_Identidad = clie_Identidad
							  AND clie_Estado = 1
							  AND clie_Id != @clie_Id)

			SELECT 'Ya existe un cliente con este número de identidad'
		ELSE
			BEGIN
				UPDATE opti.[tbClientes]
				SET clie_Estado = 1,
				    clie_UsuCreacion = @clie_UsuModificacion,
					clie_Nombres = @clie_Nombres,
					clie_Apellidos = @clie_Apellidos,
					clie_Identidad = @clie_Identidad,
					clie_Sexo = @clie_Sexo,
					[clie_FechaNacimiento] = @clie_FechaNacimiento,
					[estacivi_Id] = @estacivi_Id, 
					clie_Telefono = @clie_Telefono,
					clie_CorreoElectronico = @clie_CorreoElectronico
				WHERE clie_Identidad = @clie_Identidad

				SELECT 'El cliente ha sido editado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Cliente*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbClientes_Delete
	@clie_Id INT
AS
BEGIN
	
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.[tbFacturas] WHERE clie_Id = @clie_Id AND fact_Estado = 1)
			BEGIN
				UPDATE opti.[tbClientes] 
				SET clie_Estado = 0
				WHERE clie_Id = @clie_Id
				
				SELECT 'El cliente ha sido eliminado'
			END
		ELSE
			SELECT 'El cliente no puede ser eliminado ya que está siendo utilizado en otro registro'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- Empleados -----------

/*Vista Empleadaos*/
GO
CREATE OR ALTER VIEW opti.VW_tbEmpleados
AS
	SELECT T1.empe_Id, 
	       empe_Nombres, 
		   empe_Apellidos, 
		   ([empe_Nombres] + ' ' + [empe_Apellidos]) AS empe_NombreCompleto,
		   empe_Identidad, 
		   empe_FechaNacimiento, 
		   CASE WHEN  empe_Sexo = 'F' THEN 'Femenino'
				ELSE 'Masculino'
		   END AS  empe_Sexo,
		   T1.estacivi_Id, 
		   T4.estacivi_Nombre AS Empe_EstadoCivilNombre,
		   empe_Telefono, 
		   empe_CorreoElectronico, 
		   T1.sucu_Id,
		   T5.sucu_Descripcion AS Empe_SucursalNombre,
		   empe_UsuCreacion, 
		   T2.user_NombreUsuario AS Empe_NombreUsuarioCreacion,
		   empe_FechaCreacion, 
		   empe_UsuModificacion, 
		   T3.user_NombreUsuario AS Empe_NombreUsuarioModificacion,
		   empe_FechaModificacion, 
		   empe_Estado
	FROM [opti].[tbEmpleados] T1  INNER JOIN acce.tbUsuarios T2
	ON T1.empe_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.empe_UsuModificacion = T3.usua_Id INNER JOIN gral.tbEstadosCiviles T4
	ON T1.estacivi_Id = T4.estacivi_Id INNER JOIN opti.tbSucursales T5
	ON T1.sucu_Id = T5.sucu_Id

/*List vista Empleados*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEmpleados_List
AS
BEGIN
	SELECT * FROM opti.VW_tbEmpleados
END	

/*Insertar Empleados*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEmpleados_Insert 
	 @empe_Nombres                 NVARCHAR(100), 
	 @empe_Apellidos               NVARCHAR(100), 
	 @empe_Identidad               VARCHAR(13), 
	 @empe_FechaNacimiento         DATE, 
	 @empe_Sexo                    CHAR(1), 
	 @estacivi_Id                  INT, 
	 @empe_Telefono                NVARCHAR(15), 
	 @empe_CorreoElectronico       NVARCHAR(200), 
	 @sucu_Id                      INT, 
	 @empe_UsuCreacion             INT

AS
BEGIN
	BEGIN TRY

		IF NOT EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad)
			BEGIN
				INSERT INTO opti.tbEmpleados(empe_Nombres, 
				                             empe_Apellidos, 
											 empe_Identidad, 
											 empe_FechaNacimiento, 
											 empe_Sexo, 
											 estacivi_Id, 
											 empe_Telefono, 
											 empe_CorreoElectronico, 
											 sucu_Id, 
											 empe_UsuCreacion)
				VALUES(@empe_Nombres,@empe_Apellidos,@empe_Identidad, @empe_FechaNacimiento,         
	                   @empe_Sexo, @estacivi_Id, @empe_Telefono, @empe_CorreoElectronico,       
	                   @sucu_Id, @empe_UsuCreacion)

				SELECT 'El Empleado ha sido ingresado con éxito'

			END
		ELSE IF EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad
						AND empe_Estado = 1)

			SELECT 'Ya existe un Empleado con este número de identidad'
		ELSE
			BEGIN
				UPDATE opti.tbEmpleados
				SET [empe_Estado] = 1,
					[empe_Nombres] = @empe_Nombres, 
					[empe_Apellidos] = @empe_Apellidos, 
					[empe_Identidad] = @empe_Identidad, 
					[empe_FechaNacimiento] = @empe_FechaNacimiento, 
					[empe_Sexo] = @empe_Sexo, 
					[estacivi_Id] = @estacivi_Id, 
					[empe_Telefono] = @empe_Telefono, 
					[empe_CorreoElectronico] = @empe_CorreoElectronico 
				WHERE empe_Identidad = @empe_Identidad

				SELECT 'El Empleado ha sido ingresado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Editar Empleados*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEmpleados_Update 
	 @empe_Id				       INT,
	 @empe_Nombres                 NVARCHAR(100), 
	 @empe_Apellidos               NVARCHAR(100), 
	 @empe_Identidad               VARCHAR(13), 
	 @empe_FechaNacimiento         DATE, 
	 @empe_Sexo                    CHAR(1), 
	 @estacivi_Id                  INT, 
	 @empe_Telefono                NVARCHAR(15), 
	 @empe_CorreoElectronico       NVARCHAR(200), 
	 @sucu_Id                      INT, 
	 @empe_UsuModificacion         INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad)
		BEGIN	
			UPDATE opti.tbEmpleados
					   SET empe_Nombres = @empe_Nombres, 
					       empe_Apellidos = @empe_Apellidos, 
						   empe_Identidad = @empe_Identidad, 
						   empe_FechaNacimiento = @empe_FechaNacimiento, 
						   empe_Sexo= @empe_Sexo, 
						   estacivi_Id = @estacivi_Id, 
						   empe_Telefono = @empe_Telefono, 
						   empe_CorreoElectronico = @empe_CorreoElectronico, 
						   sucu_Id = @sucu_Id, 						   
						   empe_UsuModificacion = @empe_UsuModificacion
				       WHERE  empe_Id = @empe_Id

			SELECT 'El Empleado ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbEmpleados
						WHERE @empe_Identidad = empe_Identidad
							  AND empe_Estado = 1
							  AND empe_Id != @empe_Id)

			SELECT 'Ya existe un Empleado con este número de identidad'
		ELSE
			BEGIN
				UPDATE opti.tbEmpleados
				SET [empe_Estado] = 1,
				    [empe_UsuCreacion] = @empe_UsuModificacion,
					[empe_Nombres] = @empe_Nombres, 
					[empe_Apellidos] = @empe_Apellidos, 
					[empe_Identidad] = @empe_Identidad, 
					[empe_FechaNacimiento] = @empe_FechaNacimiento, 
					[empe_Sexo] = @empe_Sexo, 
					[estacivi_Id] = @estacivi_Id, 
					[empe_Telefono] = @empe_Telefono, 
					[empe_CorreoElectronico] = @empe_CorreoElectronico 
				WHERE empe_Identidad = @empe_Identidad

				SELECT 'El Empleado ha sido editado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Empleados*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEmpleados_Delete 
	@empe_Id INT
AS
BEGIN
	
	BEGIN TRY
			BEGIN
				UPDATE opti.tbEmpleados 
				SET empe_Estado = 0
				WHERE [empe_Id] = @empe_Id
				
				SELECT 'El Empleado ha sido eliminado'
			END
		
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- PROVEEDORES -----------

/*Vista Proveedores*/
GO
CREATE OR ALTER VIEW opti.VW_tbProveedores
AS
	SELECT prov_Id, 
	       prov_Nombre, 
		   prov_Direccion, 
		   prov_CorreoElectronico, 
		   prov_Telefono, 
		   prov_UsuCreacion, 
		   T2.user_NombreUsuario AS prov_NombreUsuCreacion,
		   prov_FechaCreacion, 
		   prov_UsuModificacion, 
		   T3.user_NombreUsuario AS prov_NombreUsuModificacion,
		   prov_FechaModificacion, 
		   prov_Estado
	FROM opti.tbProveedores T1 INNER JOIN acce.tbUsuarios T2
	ON T1.prov_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.prov_UsuModificacion = T3.usua_Id

GO

/*List vista Proveedores*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbProveedore_List
AS
BEGIN
	SELECT * FROM opti.VW_tbProveedores
END	

/*Insertar Proveedor*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbProveedor_Insert
	@prov_Nombre                NVARCHAR(100),
    @prov_Direccion             NVARCHAR(500),
    @prov_CorreoElectronico     NVARCHAR(200),
    @prov_Telefono              NVARCHAR(15),
    @prov_UsuCreacion           INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbProveedores 
						WHERE prov_Nombre = @prov_Nombre)
			BEGIN
			INSERT INTO opti.tbProveedores(prov_Nombre,prov_Direccion,prov_CorreoElectronico,prov_Telefono,prov_UsuCreacion)
			VALUES(@prov_Nombre,@prov_Direccion,@prov_CorreoElectronico,@prov_Telefono,@prov_UsuCreacion)
			
			SELECT 'El proveedor ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbProveedores 
						WHERE prov_Nombre = @prov_Nombre
						AND prov_Estado = 0)
			BEGIN
				UPDATE opti.tbProveedores
				SET prov_Estado = 1
				WHERE prov_Nombre = @prov_Nombre

				SELECT 'El proveedor ha sido insertada con éxito'
			END
		ELSE
			SELECT 'El proveedor ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Editar Proveedor*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbProveedor_Update
	@prov_Id					INT,
    @prov_Nombre                NVARCHAR(200),
    @prov_Direccion             NVARCHAR(500),
    @prov_CorreoElectronico     NVARCHAR(200),
    @prov_Telefono              NVARCHAR(15),
    @prov_UsuModificacion       INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbProveedores
						WHERE @prov_Nombre = [prov_Nombre])
		BEGIN			
			UPDATE opti.tbProveedores
			SET 	[prov_Nombre] = @prov_Nombre,
			        [prov_Direccion] = @prov_Direccion,
                    [prov_CorreoElectronico] = @prov_CorreoElectronico,
                    [prov_Telefono] = @prov_Telefono,
                    [prov_UsuModificacion] = @prov_UsuModificacion,
                    [prov_FechaModificacion] = GETDATE()
			WHERE 	[prov_Id] = @prov_Id
			SELECT 'El Proveedor ha sido editada con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbProveedores
						WHERE @prov_Nombre = [prov_Nombre]
							  AND  [prov_Estado] = 1
							  AND [prov_Id] != @prov_Id)
			SELECT 'EL Proveedor ya existe'
		ELSE
			UPDATE opti.tbProveedores
			SET prov_Estado = 1,
			  [prov_UsuModificacion] = @prov_UsuModificacion
			WHERE [prov_Nombre] = @prov_Nombre

			SELECT 'El proveedor ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Proveedor*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbProveedor_Delete 
	@prov_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbAros WHERE prov_Id = @prov_Id)
			BEGIN
				UPDATE opti.tbProveedores
				SET prov_Estado = 0
				WHERE prov_Id = @prov_Id

				SELECT 'El Proveedor ha sido eliminado'
			END
		ELSE
			SELECT 'El proveedor no puede ser eliminado ya que está siendo usado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- AROS -----------

/*Vista Aros*/
GO
CREATE OR ALTER VIEW opti.VW_tbAros
AS
	SELECT aros_Id, 
	       aros_Descripcion, 
		   aros_CostoUni, 
		   T1.cate_Id, 
		   T4.cate_Nombre AS aros_NombreCategoria,
		   T1.prov_Id, 
		   T5.prov_Nombre AS aros_NombreProveedor,
		   T1.marc_Id, 
		   T6.marc_Nombre AS aros_NombreMarca,
		   aros_Stock, 
		   aros_UsuCreacion, 
		   T2.user_NombreUsuario AS aros_NombreUsuarioCreacion,
		   aros_FechaCreacion, 
		   aros_FechaModificacion, 
		   aros_UsuModificacion, 
		   T3.usua_NombreUsuario AS aros_NombreUsuarioModificacion,
		   aros_Estado
	FROM opti.tbAros T1 INNER JOIN acce.tbUsuarios T2
	ON T1.aros_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.aros_UsuModificacion = T3.usua_Id INNER JOIN opti.tbCategorias T4
	ON T1.cate_Id = T4.cate_Id INNER JOIN opti.tbProveedores T5 
	ON T1.prov_Id = T5.prov_Id INNER JOIN opti.tbMarcas T6
	ON T1.marc_Id = T6.marc_Id

GO

/*List vista Aros*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbAros_List
AS
BEGIN
	SELECT * FROM opti.VW_tbAros
END	

/*Insertar Proveedor*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbAros_Insert
	@aros_Descripcion              NVARCHAR(300),
    @aros_CostoUni                 DECIMAL(18,2),
    @cate_Id                       INT,
	@prov_Id                       INT,
    @marc_Id                       INT,
    @aros_Stock                    INT,
    @aros_UsuCreacion              INT

AS
BEGIN
	BEGIN TRY
		
			BEGIN
			INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_Stock, aros_UsuCreacion)
			VALUES(@aros_Descripcion, @aros_CostoUni, @cate_Id, @prov_Id, @marc_Id, @aros_Stock, @aros_UsuCreacion)
			
			SELECT 'El Aro ha sido insertada con éxito'
			END
		 IF EXISTS (SELECT * FROM opti.tbAros
						WHERE aros_Descripcion = @aros_Descripcion
						AND aros_Estado = 0)
			BEGIN
				UPDATE opti.tbAros
				SET aros_Estado = 1
				WHERE @aros_Descripcion = @aros_Descripcion

				SELECT 'El Aro ha sido insertada con éxito'
			END
		ELSE
			SELECT 'El Aro ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Editar Aro*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbAros_Update
	@aros_Id                 INT,
    @aros_Descripcion        NVARCHAR(300), 
	@aros_CostoUni           DECIMAL(18,2), 
	@cate_Id                 INT, 
	@prov_Id                 INT, 
	@marc_Id                 INT, 
	@aros_Stock              INT, 
	@aros_UsuModificacion    INT
	 
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbAros
						WHERE @aros_Descripcion = [aros_Descripcion])
		BEGIN			
			UPDATE opti.tbAros
			SET   aros_Descripcion = @aros_Descripcion, 
			      aros_CostoUni = @aros_CostoUni, 
				  cate_Id = @cate_Id, 
				  prov_Id = @prov_Id, 
				  marc_Id = @marc_Id, 
				  aros_Stock = @aros_Stock, 
				  aros_FechaModificacion = GETDATE(), 
				  aros_UsuModificacion = @aros_UsuModificacion
			WHERE 	aros_Id = @aros_Id
			SELECT 'El Aro ha sido editada con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbAros
						WHERE @aros_Descripcion = [aros_Descripcion]
							  AND  [aros_Estado] = 1
							  AND [aros_Id] != @aros_Id)
			SELECT 'EL Aro ya existe'
		ELSE
			UPDATE opti.tbAros
			SET aros_Estado = 1,
			  aros_UsuModificacion = @aros_UsuModificacion
			WHERE [aros_Descripcion] = @aros_Descripcion

			SELECT 'El Aro ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Aros*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbAros_Delete 
	@aros_Id	INT
AS
BEGIN
	BEGIN TRY
		
			BEGIN
				UPDATE opti.tbAros
				SET aros_Estado = 0
				WHERE aros_Id = @aros_Id

				SELECT 'El Aro ha sido eliminado'
			END
		
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- DIRECCIONES -----------

/*Vista Direcciones*/
GO
CREATE OR ALTER VIEW opti.VW_tbDirecciones
AS
	SELECT dire_Id,
	       T1.muni_Id, 
		   T4.muni_Nombre AS muni_NombreMunicipio,
		   dire_DireccionExacta, 
		   clie_Estado, 
		   usua_IdCreacion, 
		   t2.usua_NombreUsuario AS dire_UsuarioCreacion,
		   clie_FechaCreacion, 
		   usua_IdModificacion, 
		   T3.usua_NombreUsuario AS dire_UsuarioModificacion,
		   clie_FechaModificacion
		   FROM opti.tbDirecciones T1 INNER JOIN acce.tbUsuarios T2
		   ON T1.usua_IdCreacion = T2.usua_Id
		   LEFT JOIN acce.tbUsuarios T3
		   ON T1.usua_IdModificacion = T3.usua_Id INNER JOIN gral.tbMunicipios T4
		   ON T1.muni_Id = T4.muni_Nombre
		   

/*Insertar Direcciones*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDirecciones_Insert
	@muni_Id                INT, 
	@dire_DireccionExacta   NVARCHAR(300), 
	@usua_IdCreacion        INT
AS 
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbDirecciones
						WHERE dire_DireccionExacta = @dire_DireccionExacta)
			BEGIN
			INSERT INTO opti.tbDirecciones(muni_Id,dire_DireccionExacta,usua_IdCreacion)
			VALUES(@muni_Id,@dire_DireccionExacta,@usua_IdCreacion)
			
			SELECT 'La direccion ha sido insertado'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbDirecciones 
						WHERE dire_DireccionExacta = @dire_DireccionExacta
						AND clie_Estado = 0)
			BEGIN
				UPDATE opti.tbDirecciones 
				SET clie_Estado = 1
				WHERE dire_DireccionExacta = @dire_DireccionExacta

				SELECT 'La direccion ha sido insertado'
			END
		ELSE
			SELECT 'La direccion ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END



/*Editar Direccion*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDirecciones_Update
    @dire_Id                INT,
	@muni_Id                INT, 
	@dire_DireccionExacta   NVARCHAR(300), 
	@usua_IdModificacion        INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbDirecciones 
						WHERE @dire_DireccionExacta = [dire_DireccionExacta])
		BEGIN			
			UPDATE opti.tbDirecciones
			SET 	muni_Id  = @muni_Id,
			        dire_DireccionExacta = @dire_DireccionExacta,
					usua_IdModificacion = @usua_IdModificacion, 
					clie_FechaModificacion = GETDATE()
			WHERE 	[dire_Id] = @dire_Id

			SELECT 'La direccion ha sido editado'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbDirecciones
						WHERE @dire_DireccionExacta = [dire_DireccionExacta]
							  AND clie_Estado = 1
							  AND [dire_Id] != @dire_Id)

			SELECT 'La direccion ya existe'
		ELSE
			UPDATE opti.tbDirecciones
			SET clie_Estado = 1,
			    [usua_IdModificacion] = @usua_IdModificacion,
				[clie_FechaModificacion] = GETDATE()
			WHERE @dire_DireccionExacta = [dire_DireccionExacta]

			SELECT 'La dirreccion ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Direccion*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDireccion_Delete
	@dire_Id	INT
AS
BEGIN
	BEGIN TRY
		UPDATE opti.tbDirecciones
		SET clie_Estado = 0
		WHERE dire_Id = @dire_Id

		SELECT 'La direccion ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- Direcciones Por Clientes  -----------


/*Vista direcciones por cliente*/
GO
CREATE OR ALTER VIEW opti.VW_tbDireccionesPorClientes
AS
	SELECT dicl_Id,
	       t1.clie_Id, 
		   T4.clie_Nombres AS dicl_NombreClientes,
		   T1.dire_Id,
		   t5.dire_DireccionExacta AS dicl_DireccionExacta, 
		   t1.clie_Estado, 
		   T1.usua_IdCreacion, 
		   t2.user_NombreUsuario AS dicl_NombreUsuarioCreacion,
		   t1.clie_FechaCreacion, 
		   T1.usua_IdModificacion, 
		   t3.user_NombreUsuario AS dicl_NombreUsuarioModificacion,
		   t1.clie_FechaModificacion
		   FROM opti.tbDireccionesPorCliente t1 INNER JOIN acce.tbUsuarios t2
		   ON t1.usua_IdCreacion = T2.usua_Id
		   LEFT JOIN acce.tbUsuarios t3
		   ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbClientes T4
		   ON T1.clie_Id = T4.clie_Id INNER JOIN opti.tbDirecciones t5
		   ON T1.dire_Id = T5.dire_Id
		   WHERE T1.clie_Estado = 1

/*Insertar Direcciones por Cliente*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDireccionesPorClientes_Insert
    @clie_Id           INT, 
	@dire_Id           INT, 
	@usua_IdCreacion   INT
	
AS 
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbDireccionesPorCliente 
						WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id)
			BEGIN
			INSERT INTO opti.tbDireccionesPorCliente(clie_Id,dire_Id,usua_IdCreacion)
			VALUES(@clie_Id,@dire_Id,@usua_IdCreacion)
			
			SELECT 'La direccion ha sido insertado'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbDireccionesPorCliente
						WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id
						AND clie_Estado = 0)
			BEGIN
				UPDATE opti.tbDireccionesPorCliente 
				SET clie_Estado = 1
				WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id

				SELECT 'La direccion ha sido insertado'
			END
		ELSE
			SELECT 'Eata direccion ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Listar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDireccionPorCliente_List
AS
BEGIN
	SELECT * 
	From opti.VW_tbDireccionesPorClientes
END

/*Editar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDireccionPorCliente_Update
	@dicl_Id              INT, 
	@clie_Id              INT, 
	@dire_Id              INT, 
	@usua_IdModificacion  INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbDireccionesPorCliente 
						WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id)
		BEGIN			
			UPDATE opti.tbDireccionesPorCliente
			SET 	[clie_Id] = @clie_Id,
                    [dire_Id] = @dire_Id,
                    [usua_IdModificacion] = @usua_IdModificacion,
					[clie_FechaModificacion] = GETDATE()
			WHERE 	[dicl_Id] = @dicl_Id

			SELECT 'La direción ha sido editado'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbDireccionesPorCliente
						WHERE @dire_Id = dire_Id
						      AND @clie_Id = clie_Id
							  AND clie_Estado = 1
							  AND [dicl_Id] != @dicl_Id)

			SELECT 'La dirección ya existe'
		ELSE
			UPDATE opti.tbDireccionesPorCliente
			SET clie_Estado = 1,
			    [usua_IdModificacion] = @usua_IdModificacion,
				[clie_FechaModificacion] = GETDATE()
			WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id

			SELECT 'La direccioon ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar cargos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDireccionesPorCliente_Delete
	@dicl_Id   INT
AS
BEGIN
	BEGIN TRY
		UPDATE opti.tbDireccionesPorCliente
		SET clie_Estado = 0
		WHERE dicl_Id = @dicl_Id

		SELECT 'La direccion ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- Marcas -----------
GO
CREATE OR ALTER VIEW opti.VW_tbMarcas
AS
	SELECT marc_Id,
	       marc_Nombre,
		   marc_Estado, 
		   usua_IdCreacion,
		   T2.user_NombreUsuario AS marc_NombreUsuarioCreacion, 
		   marc_FechaCreacion 
		   usua_IdModificacion,
		   t3.user_NombreUsuario AS marc_NombreUsuarioModificacion, 
		   marc_FechaModificacion
FROM opti.tbMarcas T1 INNER JOIN acce.tbUsuarios T2
ON T1.usua_IdCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.usua_IdModificacion = T3.usua_Id
WHERE t1.marc_Estado = 1


/*Listado de Marca*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMarca_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbMarcas
END

/*Insertar categoria*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMarcas_Insert
    @marc_Nombre       NVARCHAR(150),
    @usua_IdCreacion   INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbMarcas 
						WHERE marc_Nombre = @marc_Nombre)
			BEGIN
			INSERT INTO opti.tbMarcas(marc_Nombre,usua_IdCreacion)
			VALUES(@marc_Nombre,@usua_IdCreacion)
			
			SELECT 'La Marca ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbMarcas
						WHERE marc_Nombre = @marc_Nombre
						AND marc_Estado = 0)
			BEGIN
				UPDATE opti.tbMarcas
				SET marc_Estado = 1
				WHERE marc_Nombre = @marc_Nombre

				SELECT 'La marca ha sido insertada con éxito'
			END
		ELSE
			SELECT 'La marca ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Marca*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMarcas_Update
	@marc_Id              INT,
    @marc_Nombre          NVARCHAR(150), 
	@usua_IdModificacion  INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbMarcas
						WHERE @marc_Nombre = marc_Nombre)
		BEGIN			
			UPDATE opti.tbMarcas
			SET 	marc_Nombre = @marc_Nombre,
					usua_IdModificacion = @usua_IdModificacion,
					marc_FechaModificacion = GETDATE()
			WHERE 	marc_Id = @marc_Id
			SELECT 'La marca ha sido editada con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbMarcas
						WHERE @marc_Nombre = [marc_Nombre]
							  AND marc_Estado = 1
							  AND marc_Id != @marc_Id)
			SELECT 'La marca ya existe'
		ELSE
			UPDATE opti.tbMarcas
			SET marc_Estado = 1,
			   usua_IdModificacion = @usua_IdModificacion
			WHERE [marc_Nombre] = @marc_Nombre

			SELECT 'La marca ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Marcas*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMarcas_Delete 
	@marc_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbAros WHERE marc_Id = @marc_Id)
			BEGIN
				UPDATE opti.tbMarcas
				SET marc_Estado = 0
				WHERE marc_Id = @marc_Id

				SELECT 'La marca ha sido eliminada'
			END
		ELSE
			SELECT 'La marca no puede ser eliminada ya que está siendo usada'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- METODO DE PAGO -----------
GO
CREATE OR ALTER VIEW opti.VW_tbMetodosPagos
AS
	SELECT meto_Id, 
	       meto_Nombre, 
		   meto_UsuCreacion, 
		   T2.user_NombreUsuario AS meto_NombreUsuarioCreacion,
		   meto_FechaCreacion, 
		   meto_UsuModificacion, 
		   t3.user_NombreUsuario AS meto_NombreUsuarioModificacion,
		   meto_FechaModificacion, 
		   meto_Estado
FROM opti.tbMetodosPago t1 INNER JOIN acce.tbUsuarios T2
ON T1.meto_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.meto_UsuModificacion = T3.usua_Id
WHERE T1.meto_Estado = 1


/*Listado de metodos de pago*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMetodosPagos_List
AS
BEGIN
	SELECT * 
	FROM opti.VW_tbMetodosPagos
END

/*Insertar Metodos de pagos*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMetodosPagos_Insert
	@meto_Nombre       NVARCHAR(100),
	@meto_UsuCreacion  INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbMetodosPago 
						WHERE meto_Nombre = @meto_Nombre)
			BEGIN
			INSERT INTO opti.tbMetodosPago([meto_Nombre],[meto_UsuCreacion])
			VALUES(@meto_Nombre, @meto_UsuCreacion)
			
			SELECT 'El metodo de pago ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbMetodosPago 
						WHERE meto_Nombre = @meto_Nombre
						AND meto_Estado = 0)
			BEGIN
				UPDATE opti.tbMetodosPago
				SET meto_Estado = 1
				WHERE meto_Nombre = @meto_Nombre

				SELECT 'El metodo de pago ha sido insertada con éxito'
			END
		ELSE
			SELECT 'El metodo de pago ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Metodo de pago*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMetodosPagos_Update
	@meto_Id               INT,
	@meto_Nombre           NVARCHAR(100),
	@meto_UsuModificacion  INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbMetodosPago
						WHERE @meto_Nombre = [meto_Nombre])
		BEGIN			
			UPDATE opti.tbMetodosPago
			SET 	meto_Nombre = @meto_Nombre,
					meto_UsuModificacion = @meto_UsuModificacion,
					meto_FechaModificacion = GETDATE()
			WHERE 	meto_Id = @meto_Id
			SELECT 'El metodo de pago ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbMetodosPago
						WHERE @meto_Nombre = meto_Nombre
							  AND meto_Estado = 1
							  AND meto_Id != @meto_Id)
			SELECT 'El metodo de pago ya existe'
		ELSE
			UPDATE opti.tbMetodosPago
			SET meto_Estado = 1,
			   meto_UsuModificacion = @meto_UsuModificacion
			WHERE meto_Nombre = @meto_Nombre

			SELECT 'El metodo de pago ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar metodo de pago*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbMetodosPagos_Delete 
	@meto_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbFacturas WHERE meto_Id = @meto_Id)
			BEGIN
				UPDATE opti.tbMetodosPago
				SET meto_Estado = 0
				WHERE meto_Id = @meto_Id

				SELECT 'El metodo de pago ha sido eliminado'
			END
		ELSE
			SELECT 'El metodo de pago no puede ser eliminado ya que está siendo usado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- Pantallas -----------
GO
CREATE OR ALTER VIEW acce.VW_tbPantallas
AS
	SELECT  pant_Id,
	        pant_Nombre, 
			pant_Url, 
			pant_Menu, 
			pant_HtmlId, 
			pant_UsuCreacion, 
			T2.user_NombreUsuario AS pant_NombreUsuarioCreacion,
			pant_FechaCreacion, 
			pant_UsuModificacion,
			T3.user_NombreUsuario AS pant_NombreUsuarioModificacio, 
			pant_FechaModificacion, 
			pant_Estado
FROM [acce].[tbPantallas] t1 INNER JOIN acce.tbUsuarios T2
ON T1.[pant_UsuCreacion] = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.[pant_UsuModificacion] = T3.usua_Id 

WHERE [pant_Estado] = 1


/*Listado de Pantallas*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbPantallas_List
AS
BEGIN
	SELECT * 
	FROM acce.VW_tbPantallas
END

/*Insertar Pantallas*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbPantallas_Insert
	@pant_Nombre          NVARCHAR(100), 
	@pant_Url             NVARCHAR(300), 
	@pant_Menu            NVARCHAR(300), 
	@pant_HtmlId          NVARCHAR(80), 
	@pant_UsuCreacion     INT 

AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM acce.tbPantallas
						WHERE pant_Nombre = @pant_Nombre)
			BEGIN
			INSERT INTO [acce].[tbPantallas](pant_Nombre, pant_Url, pant_Menu, pant_HtmlId, pant_UsuCreacion)
			VALUES(@pant_Nombre, @pant_Url, @pant_Menu, @pant_HtmlId, @pant_UsuCreacion)
			
			SELECT 'La pantalla ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM [acce].[tbPantallas]
						WHERE [pant_Nombre] = @pant_Nombre AND
						[pant_Estado]  = 0)
			BEGIN
				UPDATE [acce].[tbPantallas]
				SET [pant_Estado] = 1
				WHERE  [pant_Nombre] = @pant_Nombre

				SELECT 'La pantalla ha sido insertada con éxito'
			END
		ELSE
			SELECT 'La pantalla ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Pantallas*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbPantallas_Update
	@pant_Id               INT,
	@pant_Nombre           NVARCHAR(100), 
	@pant_Url              NVARCHAR(300), 
	@pant_Menu             NVARCHAR(300), 
	@pant_HtmlId           NVARCHAR(80), 
	@pant_UsuModificacion   INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM [acce].[tbPantallas]
						WHERE @pant_Nombre = [pant_Nombre])
		BEGIN			
			UPDATE  [acce].[tbPantallas]
			SET 	[pant_Nombre] = @pant_Nombre,
			        [pant_Url] = @pant_Url,
                    [pant_Menu] = @pant_Menu,
					[pant_HtmlId] = @pant_HtmlId,
					[pant_UsuModificacion]= @pant_UsuModificacion,
					[pant_FechaModificacion] = GETDATE()
			WHERE 	[pant_Id] = @pant_Id
			SELECT 'La pantalla ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM [acce].[tbPantallas]
						WHERE @pant_Nombre = [pant_Nombre]
							  AND [pant_Estado] = 1
							  AND [pant_Id] != @pant_Id)
			SELECT 'La pantalla ya existe'
		ELSE
			UPDATE [acce].[tbPantallas]
			SET [pant_Estado] = 1,
			    [pant_UsuModificacion]  = @pant_UsuModificacion,
			    [pant_Url] = @pant_Url,
                [pant_Menu] = @pant_Menu,
				[pant_HtmlId] = @pant_HtmlId,
				[pant_UsuModificacion]= @pant_UsuModificacion,
				[pant_FechaModificacion] = GETDATE()
			WHERE  [pant_Nombre] = @pant_Nombre

			SELECT 'La pantalla ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar pantalla*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbPantallas_Delete 
	@pant_Id     INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [acce].[tbPantallasPorRoles] WHERE [pant_Id] = @pant_Id)
			BEGIN
				UPDATE [acce].[tbPantallas]
				SET [pant_Estado] = 0
				WHERE  [pant_Id]= @pant_Id

				SELECT 'La pantalla ha sido eliminada'
			END
		ELSE
			SELECT 'La pantalla no puede ser eliminada ya que está siendo usada'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- SUCURSALES -----------
GO
CREATE OR ALTER VIEW opti.VW_tbSucursales
AS
	SELECT  sucu_Id, 
	        sucu_Descripcion, 
			t1.muni_Id,
			T4.muni_Nombre AS sucu_MunicipioNombre, 
			sucu_DireccionExacta, 
			sucu_FechaCreacion, 
			sucu_UsuCreacion, 
			t2.user_NombreUsuario AS sucu_NombreUsuarioCreacion,
			sucu_FechaModificacion,
			t3.user_UsuModificacion AS sucu_NombreUsuarioModifica, 
			sucu_UsuModificacion, 
			sucu_Estado
FROM [opti].[tbSucursales] t1 INNER JOIN acce.tbUsuarios T2
ON T1.sucu_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.sucu_UsuModificacion = T3.usua_Id INNER JOIN gral.tbMunicipios T4
ON T1.muni_Id = T4.muni_Id

WHERE T1.sucu_Estado = 1


/*Listado de Sucursales*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbSucursales_List
AS
BEGIN
	SELECT * 
	FROM opti.VW_tbSucursales
END

/*Insertar Sucursales*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbSucursales_Insert
	@sucu_Descripcion     NVARCHAR(200),
	@muni_Id              INT,
	@sucu_DireccionExacta NVARCHAR(500),
    @sucu_UsuCreacion     INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbSucursales
						WHERE sucu_Descripcion = @sucu_Descripcion)
			BEGIN
			INSERT INTO opti.tbSucursales(sucu_Descripcion,muni_Id,sucu_DireccionExacta,sucu_UsuCreacion)
			VALUES(@sucu_Descripcion,@muni_Id,@sucu_DireccionExacta,@sucu_UsuCreacion)
			
			SELECT 'La sucursal ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM opti.tbSucursales 
						WHERE sucu_Descripcion = @sucu_Descripcion
						AND sucu_Estado = 0)
			BEGIN
				UPDATE opti.tbSucursales
				SET sucu_Estado = 1
				WHERE sucu_Descripcion = @sucu_Descripcion

				SELECT 'La Sucursal ha sido insertada con éxito'
			END
		ELSE
			SELECT 'La sucursal ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Sucursal*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbSucursal_Update
	@sucu_Id                 INT,
    @sucu_Descripcion        NVARCHAR(200), 
	@muni_Id                 INT, 
	@sucu_DireccionExacta    NVARCHAR(500),  
	@sucu_UsuModificacion    INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM opti.tbSucursales
						WHERE @sucu_Descripcion = [sucu_Descripcion])
		BEGIN			
			UPDATE opti.tbSucursales
			SET 	sucu_Descripcion = @sucu_Descripcion,
					muni_Id = @muni_Id,
					sucu_DireccionExacta = @sucu_DireccionExacta,
					sucu_UsuModificacion = @sucu_UsuModificacion,
					sucu_FechaModificacion = GETDATE()
			WHERE 	sucu_Id = @sucu_Id
			SELECT 'La sucursal ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbSucursales
						WHERE @sucu_Descripcion = sucu_Descripcion
							  AND sucu_Estado = 1
							  AND sucu_Id != @sucu_Id)
			SELECT 'La sucursal ya existe'
		ELSE
			UPDATE opti.tbSucursales
			SET sucu_Estado = 1,
			   sucu_UsuModificacion = @sucu_UsuModificacion
			WHERE sucu_Descripcion = @sucu_Descripcion

			SELECT 'La sucursal ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


/*Eliminar Sucursal*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbSucursales_Delete 
	@sucu_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbOrdenes WHERE sucu_Id = @sucu_Id)
			BEGIN
				UPDATE opti.tbSucursales
				SET sucu_Estado = 0
				WHERE sucu_Id = @sucu_Id

				SELECT 'La sucursal ha sido eliminada'
			END
		ELSE
			SELECT 'La sucursal no puede ser eliminada ya que está siendo usada'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END



---------- Pantallas Por Roles -----------
GO
CREATE OR ALTER VIEW acce.VW_tbPantallasPorRoles
AS
	SELECT pantrole_Id,
	       T1.role_Id, 
		   T4.role_Nombre AS pantrole_NombreRol,
		   T1.pant_Id,
		   t5.pant_Nombre AS pantrole_NombrePantalla, 
		   pantrole_UsuCreacion, 
		   pantrole_FechaCreacion, 
		   pantrole_UsuModificacion, 
		   pantrole_FechaModificacion, 
		   pantrole_Estado
FROM [acce].[tbPantallasPorRoles] T1 INNER JOIN acce.tbUsuarios T2
ON T1.pantrole_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.pantrole_UsuModificacion = t3.usua_Id INNER JOIN [acce].[tbRoles] T4
ON T1.role_Id = T4.role_Id INNER JOIN [acce].[tbPantallas] T5
ON T1.pant_Id = T5.pant_Id
WHERE T1.pantrole_Estado = 1


/*Listado de Pantallas por rol*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbPantallasPorRoles_List
AS
BEGIN
	SELECT * 
	FROM acce.VW_tbPantallasPorRoles
END

/*Insertar pantallas por roles*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbPantallasPorRoles_Insert
	@role_Id               INT, 
	@pant_Id               INT, 
	@pantrole_UsuCreacion  INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM acce.tbPantallasPorRoles 
						WHERE pant_Id = @pant_Id AND role_Id = @role_Id)
			BEGIN
			INSERT INTO acce.tbPantallasPorRoles(role_Id,pant_Id,pantrole_UsuCreacion)
			VALUES(@role_Id,@pant_Id,@pantrole_UsuCreacion)
			
			SELECT 'La pantalla ha sido insertada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM acce.tbPantallasPorRoles 
						WHERE pant_Id = @pant_Id AND role_Id = @role_Id
						AND pantrole_Estado = 0)
			BEGIN
				UPDATE [acce].[tbPantallasPorRoles]
				SET [pantrole_Estado] = 1
				WHERE pant_Id = @pant_Id AND role_Id = @role_Id

				SELECT 'La pantalla ha sido insertada con éxito'
			END
		ELSE
			SELECT 'La pantalla ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar categoria*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbPantallaPorRol_Update
	@pantrole_Id                INT, 
	@role_Id                    INT, 
	@pant_Id                    INT,  
	@pantrole_UsuModificacion   INT
AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM [acce].[tbPantallasPorRoles]
						WHERE @role_Id = role_Id AND 
						      @pant_Id = pant_Id)
		BEGIN			
			UPDATE [acce].[tbPantallasPorRoles]
			SET 	role_Id = @role_Id,
			        pant_Id = @pant_Id,
					pantrole_UsuModificacion = GETDATE()
			WHERE 	pantrole_Id = @pantrole_Id
			SELECT 'La pantalla ha sido editada con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM [acce].[tbPantallasPorRoles]
						WHERE @pant_Id = pant_Id
						      AND @role_Id = role_Id
							  AND pantrole_Estado = 1
							  AND pantrole_Id != @pantrole_Id)
			SELECT 'La pantalla ya existe'
		ELSE
			UPDATE [acce].[tbPantallasPorRoles]
			SET pantrole_Estado = 1,
			    pantrole_UsuModificacion = @pantrole_UsuModificacion
			WHERE @role_Id = role_Id AND 
						      @pant_Id = pant_Id

			SELECT 'La pantalla ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar categoria*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbPantallaPorRoles_Delete 
	@pantrole_Id	INT
AS
BEGIN
	BEGIN TRY
			BEGIN
				UPDATE [acce].[tbPantallasPorRoles]
				SET pantrole_Estado = 0
				WHERE pantrole_Id = @pantrole_Id

				SELECT 'La pantalla ha sido eliminada'
			END
		
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END



---------- Consultorios -----------
GO
CREATE OR ALTER VIEW opti.VW_tbConsultorios
AS
	SELECT  cons_Id, 
	        cons_Nombre, 
			T1.empe_Id, 
			T4.empe_Nombres AS cons_NombreEmpleado,
			cons_Estado, 
			usua_IdCreacion, 
			t2.user_NombreUsuario AS cons_NombreUsuarioCreacion, 
			cons_FechaCreacion, 
			usua_IdModificacion,
			t3.user_NombreUsuario AS cons_NombreUsuarioModificacion, 
			cons_FechaModificacion
FROM opti.tbConsultorios t1  INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbEmpleados t4
ON t1.empe_Id = t4.empe_Id 




/*Listado de Consultorios*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbConsultorios_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbConsultorios
	WHERE cons_Estado = 1
END

/*Insertar CONSULTORIOS*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbConsultorios_Insert
	 @cons_Nombre        NVARCHAR(150), 
	 @empe_Id            INT,
	 @usua_IdCreacion    INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [opti].[tbConsultorios]
						WHERE [cons_Nombre] = @cons_Nombre)
			BEGIN
			INSERT INTO [opti].[tbConsultorios](cons_Nombre, empe_Id, usua_IdCreacion)
			VALUES(@cons_Nombre, @empe_Id, @usua_IdCreacion)
			
			SELECT 'El Consultorio ha sido insertado con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM  [opti].[tbConsultorios]
						WHERE cons_Nombre = @cons_Nombre 
						AND [cons_Estado] = 0)
			BEGIN
				UPDATE [opti].[tbConsultorios]
				SET [cons_Estado] = 1
				WHERE  [cons_Nombre] = @cons_Nombre

				SELECT 'El Consultorio ha sido insertado con éxito'
			END
		ELSE
			SELECT 'El Consultorio ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Consultorios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbConsultorios_Update
	@cons_Id                 INT,
	@cons_Nombre             NVARCHAR(150), 
	@empe_Id                 INT, 
	@usua_IdModificacion     INT

AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM [opti].[tbConsultorios]
						WHERE [cons_Nombre] = @cons_Nombre AND empe_Id = @empe_Id)
		BEGIN			
			UPDATE  [opti].[tbConsultorios]
			SET 	[cons_Nombre] = @cons_Nombre,
			        [empe_Id] = @empe_Id,
                    [usua_IdModificacion] = @usua_IdModificacion,
					[cons_FechaModificacion] = GETDATE()
			WHERE 	[cons_Id] = @cons_Id
			SELECT 'El Consultorio ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM [opti].[tbConsultorios]
						WHERE @cons_Nombre = cons_Nombre
						      AND @empe_Id = @empe_Id
							  AND cons_Estado = 1
							  AND cons_Id != @cons_Id)
			SELECT 'El consultorio ya existe'
		ELSE
			UPDATE [opti].[tbConsultorios]
			SET cons_Estado = 1,
			    empe_Id = @empe_Id,
			    usua_IdModificacion = @usua_IdModificacion
			WHERE  cons_Nombre = @cons_Nombre

			SELECT 'El Consultorio ha sido editado con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Consultorio*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbConsultorio_Delete 
	@cons_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [opti].[tbCitas] WHERE [cons_Id] = @cons_Id)
			BEGIN
				UPDATE [opti].[tbConsultorios]
				SET [cons_Estado] = 0
				WHERE [cons_Id] = @cons_Id

				SELECT 'El consultorio ha sido eliminado'
			END
		ELSE
			SELECT 'El consultorio no puede ser eliminado ya que está siendo usado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- ROLES -----------
GO
CREATE OR ALTER VIEW acce.VW_tbRoles
AS
	SELECT t1.role_Id,
	       role_Nombre, 
		   role_UsuCreacion,
		   t2.user_NombreUsuario AS role_NombreUsuarioCreacion, 
		   role_FechaCreacion, 
		   role_UsuModificacion,
		   t3.user_NombreUsuario AS role_NombreUsuarioModificacion, 
		   role_FechaModificacion, 
		   role_Estado
FROM acce.tbRoles t1  INNER JOIN acce.tbUsuarios t2
ON t1.role_UsuCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.role_UsuModificacion = t3.usua_Id 
WHERE t1.role_Estado = 1



/*Listado de roles*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbRoles_List
AS
BEGIN
	SELECT *
	FROM acce.VW_tbRoles
END

/*Insertar roles*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbRoles_Insert
	@role_Nombre         NVARCHAR(100),
	@role_UsuCreacion    INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [acce].[tbRoles]
						WHERE [role_Nombre] = @role_Nombre)
			BEGIN
			INSERT INTO [acce].[tbRoles](role_Nombre, role_UsuCreacion)
			VALUES(@role_Nombre, @role_UsuCreacion)
			
			SELECT 'El rol ha sido insertado con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM  [acce].[tbRoles]
						WHERE role_Nombre = @role_Nombre
						AND role_Estado = 0)
			BEGIN
				UPDATE [acce].[tbRoles]
				SET [role_Estado] = 1
				WHERE [role_Nombre] = @role_Nombre

				SELECT 'El rol ha sido insertado con éxito'
			END
		ELSE
			SELECT 'El rol ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar roles*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbRoles_Update
	@role_Id                  INT,
	@role_Nombre              NVARCHAR(100),  
	@role_UsuModificacion     INT

AS
BEGIN 
	BEGIN TRY
	IF NOT EXISTS (SELECT * FROM [acce].[tbRoles]
						WHERE @role_Nombre = role_Nombre)
		BEGIN			
			UPDATE  [acce].[tbRoles]
			SET 	[role_Nombre] = @role_Nombre,
			        [role_UsuModificacion] = @role_UsuModificacion,
					[role_FechaModificacion] = GETDATE()
			WHERE 	[role_Id] = @role_Id
			SELECT 'El rol ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM [acce].[tbRoles]
						WHERE @role_Nombre = role_Nombre
							  AND role_Estado = 1
							  AND role_Id != @role_Id)
			SELECT 'El rol ya existe'
		ELSE
			UPDATE [acce].[tbRoles]
			SET role_Estado = 1,
			    role_UsuModificacion = @role_UsuModificacion
			WHERE role_Nombre = @role_Nombre

			SELECT 'El rol ha sido editado con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Rol*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbRoles_Delete 
	@role_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [acce].[tbPantallasPorRoles] WHERE [role_Id] = @role_Id)
			BEGIN
				UPDATE [acce].[tbRoles]
				SET role_Estado = 0
				WHERE role_Id = @role_Id

				SELECT 'El rol ha sido eliminado'
			END
		ELSE
			SELECT 'El rol no puede ser eliminado ya que está siendo usado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- DETALLE CITAS -----------
GO
CREATE OR ALTER VIEW opti.VW_tbDetallesCitas
AS
	SELECT deci_Id,
	       t1.cita_Id, 
		   deci_Costo, 
		   deci_HoraInicio, 
		   deci_HoraFin, 
		   deci_Estado, 
		   t1.usua_IdCreacion, 
		   t2.user_NombreUsuario AS deci_NombreUsuarioCreacion,
		   deci_FechaCreacion, 
		   t1.usua_IdModificacion, 
		   t3.user_NombreUsuario AS deci_NombreUsuarioModificacion,
		   deci_FechaModificacion
FROM opti.tbDetallesCitas t1  INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id 




/*Listado de detalles citas*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDetallesCitas_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbDetallesCitas
END

/*Insertar roles*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbDetallesCitas_Insert
	 @cita_Id            INT, 
	 @deci_Costo         DECIMAL(18,2), 
	 @deci_HoraInicio    VARCHAR(5), 
	 @deci_HoraFin       VARCHAR(5), 
	 @usua_IdCreacion    INT
AS
BEGIN
	BEGIN TRY

			BEGIN
			INSERT INTO [opti].[tbDetallesCitas] (deci_Id, cita_Id, deci_Costo, deci_HoraInicio, deci_HoraFin, usua_IdCreacion)
			VALUES(@cita_Id, @deci_Costo, @deci_HoraInicio, @deci_HoraFin, @usua_IdCreacion)
			
			SELECT 'El Detalle de la cita ha sido insertado con éxito'
			END
		
			BEGIN
			IF EXISTS (SELECT * FROM  [opti].[tbDetallesCitas]
						WHERE  [cita_Id] = @cita_Id AND
						       [deci_HoraInicio] = @deci_HoraInicio 
						      AND deci_Estado = 0)
				UPDATE  [opti].[tbDetallesCitas]
				SET deci_Estado = 1,
                    [deci_Costo] = @deci_Costo,
                    [deci_HoraFin] = @deci_HoraFin,
                    [usua_IdCreacion] = @usua_IdCreacion
				WHERE  [cita_Id] = @cita_Id AND
					   [deci_HoraInicio] = @deci_HoraInicio 

				SELECT 'El detalle de la cita ha sido insertado con éxito'
			END
		
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar detalle cita*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_tbDetallesCitas_Update
	@deci_Id               INT, 
	@cita_Id               INT, 
	@deci_Costo            DECIMAL(18,2), 
	@deci_HoraInicio       VARCHAR(5), 
	@deci_HoraFin          VARCHAR(5), 
	@usua_IdModificacion   INT

AS
BEGIN 
	BEGIN TRY

		BEGIN			
			UPDATE  [opti].[tbDetallesCitas]([cita_Id],[deci_Costo],[deci_HoraInicio],[deci_HoraFin],[usua_IdModificacion])
			SET 	[cita_Id] = @cita_Id,
			        [deci_Costo]=@deci_Costo,
					[deci_HoraInicio]= @deci_HoraInicio,
					[deci_HoraFin]= @deci_HoraFin,
			        [usua_IdModificacion]=@usua_IdModificacion,
					[deci_FechaModificacion]= GETDATE()
			WHERE 	[deci_Id]= deci_Id
			SELECT 'El detalle ha sido editado con éxito'
		END
	      
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Detalle Cita*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbRoles_Delete 
	@deci_Id	INT
AS
BEGIN
	BEGIN TRY
			BEGIN
				UPDATE [opti].[tbDetallesCitas]
				SET [deci_Estado] = 0
				WHERE [deci_Id] = @deci_Id

				SELECT 'El detalle ha sido eliminado'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END


---------- Ordenes -----------
GO
CREATE OR ALTER VIEW opti.VW_tbOrdenes
AS
	SELECT  orde_Id,
	        T1.clie_Id,
			T4.clie_Nombres
		    orde_Fecha, 
			orde_FechaEntrega, 
			orde_FechaEntregaReal, 
			T1.sucu_Id,
			T5.sucu_Descripcion 
			orde_Estado, 
			usua_IdCreacion, 
			orde_FechaCreacion, 
			usua_IdModificacion, 
			orde_FechaModificacion 
FROM opti.tbOrdenes t1 INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbClientes T4
ON T1.clie_Id = T4.clie_Id INNER JOIN opti.tbSucursales T5
ON T1.sucu_Id = T5.sucu_Id


/*Listado de Ordenes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbOrdenes_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbOrdenes
END

/*Insertar Ordenes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbOrdenes_Insert
	 @clie_Id               INT, 
	 @orde_Fecha            DATE, 
	 @orde_FechaEntrega     DATE, 
	 @orde_FechaEntregaReal DATE, 
	 @sucu_Id               INT, 
	 @usua_IdCreacion       INT
	 
AS
BEGIN
	BEGIN TRY
			BEGIN
			INSERT INTO [opti].[tbOrdenes](clie_Id, orde_Fecha, orde_FechaEntrega, orde_FechaEntregaReal, sucu_Id, usua_IdCreacion)
			VALUES(@clie_Id, @orde_Fecha, @orde_FechaEntrega, @orde_FechaEntregaReal, @sucu_Id, @usua_IdCreacion)
			
			SELECT 'La orden ha sido insertada con éxito'
			END

	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Ordenes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbOrdenes_Update
	@orde_Id            INT, 
	@clie_Id            INT, 
	@orde_Fecha         DATE, 
	@orde_FechaEntrega  DATE, 
	@orde_FechaEntregaReal DATE, 
	@sucu_Id             INT, 
	@usua_IdModificacion INT
AS
BEGIN 
	BEGIN TRY
		BEGIN			
			UPDATE  [opti].[tbOrdenes] 
			SET 	clie_Id = @clie_Id,
			        orde_Fecha = @orde_Fecha,
					orde_FechaEntrega = @orde_FechaEntrega,
					orde_FechaEntregaReal = @orde_FechaEntregaReal,
					sucu_Id = sucu_Id,
					usua_IdModificacion = usua_IdModificacion,
                    orde_FechaModificacion = GETDATE()
			WHERE 	orde_Id  = @orde_Id 
			SELECT 'La Orden ha sido editada con éxito'
		  END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Ordenes*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbOrdenes_Delete 
	@orde_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbFacturasDetalles WHERE orde_Id  = @orde_Id )
			BEGIN
				UPDATE [opti].[tbOrdenes]
				SET [orde_Estado] = 0
				WHERE orde_Id = @orde_Id 

				SELECT 'La Orden ha sido eliminada'
			END
		ELSE
			SELECT 'La orden no puede ser eliminada ya que está siendo usada'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

---------- Envios -----------
GO
CREATE OR ALTER VIEW opti.VW_tbEnvio
AS
	SELECT  envi_Id, 
	        t1.clie_Id, 
			t4.clie_Nombres
			dire_Id,
			t5.dire_DireccionExacta, 
			envi_Fecha, 
			envi_FechaEntrega, 
			envi_FechaEntregaReal, 
			t1.clie_Estado, 
			t1.usua_IdCreacion,
			T2.user_NombreUsuario AS envi_NombreUsuarioCreacion, 
			t1.clie_FechaCreacion, 
			t1.usua_IdModificacion,
			t3.user_NombreUsuario AS envi_NombreUsuarioModificacion, 
			t1.clie_FechaModificacion
FROM opti.tbEnvios t1 INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbClientes T4
ON T1.clie_Id = T4.clie_Id INNER JOIN opti.tbDirecciones t5
ON T1.dire_Id = T5.dire_Id

/*Listado de Envio*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEnvio_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbEnvio
END

/*Insertar Envio*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEnvios_Insert
	 @clie_Id              INT, 
	 @dire_Id              INT, 
	 @envi_Fecha           DATE, 
	 @envi_FechaEntrega    DATE, 
	 @envi_FechaEntregaReal DATE, 
	 @usua_IdCreacion      INT
	 
AS
BEGIN
	BEGIN TRY
			BEGIN
			INSERT INTO [opti].[tbEnvios](clie_Id, dire_Id, envi_Fecha, envi_FechaEntrega, envi_FechaEntregaReal, usua_IdCreacion)
			VALUES(@clie_Id, @dire_Id, @envi_Fecha, @envi_FechaEntrega, @envi_FechaEntregaReal, @usua_IdCreacion)
			
			SELECT 'El envio ha sido insertado con éxito'
			END

	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Envio*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEnvios_Update
	@envi_Id                 INT, 
	@clie_Id                 INT, 
	@dire_Id                 INT, 
	@envi_Fecha              DATE, 
	@envi_FechaEntrega       DATE, 
	@envi_FechaEntregaReal   DATE, 
    @usua_IdModificacion     INT
AS
BEGIN 
	BEGIN TRY
		BEGIN			
			UPDATE   [opti].[tbEnvios]
			SET 	[clie_Id] = @clie_Id,
			        dire_Id = @dire_Id,
					 envi_Fecha = @envi_Fecha,
                     envi_FechaEntrega = @envi_FechaEntrega,
                     envi_FechaEntregaReal = @envi_FechaEntregaReal,
					 usua_IdModificacion = @usua_IdModificacion , 
                     [clie_FechaModificacion] = GETDATE()
			WHERE envi_Id = @envi_Id	
			SELECT 'El envio ha sido editado con éxito'
		  END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar Envio*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_tbEnvio_Delete 
	@envi_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [opti].[tbDetallesEnvios] WHERE [envi_Id] = @envi_Id)
			BEGIN
				UPDATE [opti].[tbEnvios]
				SET [clie_Estado] = 0
				WHERE envi_Id = @envi_Id 

				SELECT 'El envio ha sido eliminado'
			END
		ELSE
			SELECT 'El envio no puede ser eliminado ya que está siendo usado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END






/*
INSERT DE LA BASE DE DATOS
*/

GO
INSERT gral.tbDepartamentos(depa_Id, depa_Nombre, depa_UsuCreacion)
VALUES('01','Atlantida', 1),
      ('02','Colon', 1),
	  ('03','Comayagua', 1),
	  ('04','Copan', 1),
	  ('05','Cortes', 1),
	  ('06','Choluteca', 1),
	  ('07','El Paraiso', 1),
	  ('08','Francisco Morazan', 1),
	  ('09','Gracias a Dios', 1),
	  ('10','Intibuca', 1),
	  ('11','Islas de La Bahia', 1),
	  ('12','La Paz', 1),
	  ('13','Lempira', 1),
	  ('14','Ocotepeque', 1),
	  ('15','Olancho', 1),
	  ('16','Santa Barbara', 1),
	  ('17','Valle', 1),
	  ('18','Yoro', 1);

GO
INSERT gral.tbMunicipios(muni_id, muni_Nombre, depa_Id, muni_UsuCreacion)
VALUES('0101','La Ceiba ','01', 1),
      ('0102','El Porvenir','01', 1), 
	  ('0103','Jutiapa','01', 1),
	  ('0104','Jutiapa','01', 1),
	  ('0105','La Masica','01', 1),
	  ('0201','Trujillo','02', 1),
	  ('0202','Balfate','02', 1),
	  ('0203','Iriona','02', 1),
	  ('0204','Limon','02', 1),
	  ('0205','Saba','02', 1),
	  ('0301','Comayagua','03', 1),
	  ('0302','Ajuterique','03', 1),
      ('0303','El Rosario','03', 1),
	  ('0304','Esquias','03', 1),
      ('0305','Humuya','03', 1),
	  ('0401','Santa Rosa de Copan','04', 1),
	  ('0402','Cabanas','04', 1),
      ('0403','Concepcion','04', 1),
	  ('0404','Copan Ruinas','04', 1),
      ('0405','Corquin','04', 1),
	  ('0501','San Pedro Sula ','05', 1),
      ('0502','Choloma ','05', 1),
      ('0503','Omoa','05', 1),
      ('0504','Pimienta','05', 1),
	  ('0505','Potrerillos','05', 1),
	  ('0506','Puerto Cortes','05', 1),
	  ('0601','Choluteca','06', 1),
      ('0602','Apacilagua','06', 1),
      ('0603','Concepcion de Maria','06', 1),
      ('0604','Duyure','06', 1),
	  ('0605','El Corpus','07', 1),
	  ('0701','Yuscaran','07', 1),
      ('0702','Alauca','07', 1),
      ('0703','Danli','07', 1),
	  ('0704','El Paraiso','07', 1),
      ('0705','Ghinope','07', 1),
	  ('0801','Distrito Central (Comayaguela y Tegucigalpa)','08', 1),
      ('0802','Alubaran','08', 1),
      ('0803','Cedros','08', 1),
      ('0804','Curaron','08', 1),
	  ('0805','El Porvenir','08', 1),
	  ('0901','Puerto Lempira','09', 1),
      ('0902','Brus Laguna','09', 1),
      ('0903','Ahuas','09', 1),
	  ('0904','Juan Francisco Bulnes','09', 1),
      ('0905','Villeda Morales','09', 1),
	  ('1001','La Esperanza','10', 1),
      ('1002','Camasca','10', 1),
      ('1003','Colomoncagua','10', 1),
	  ('1004','Concepcion','10', 1),
      ('1005','Dolores','10', 1),
	  ('1101','Roatan','11', 1),
      ('1102','Guanaja','11', 1),
      ('1103','Jose Santos Guardiola','11', 1),
	  ('1104','Utila','11', 1),
	  ('1201','La Paz','12', 1),
      ('1202','Aguanqueterique','12', 1),
      ('1203','Cabanas','12', 1),
	  ('1204','Cane','12', 1),
      ('1205','Chinacla','12', 1),
	  ('1301','Gracias','13', 1),
      ('1302','Belen','13', 1),
      ('1303','Candelaria','13', 1),
	  ('1304','Cololaca','13', 1),
      ('1305','Erandique','13', 1),
	  ('1401','Ocotepeque','14', 1),
      ('1402','Belen Gualcho','14', 1),
      ('1403','Concepcion','14', 1),
	  ('1404','Dolores Merendon','14', 1),
      ('1405','Fraternidad','14', 1),
	  ('1501','Juticalpa','15', 1),
      ('1502','Campamento','15', 1),
      ('1503','Catacamas','15', 1),
	  ('1504','Concordia','15', 1),
      ('1505','Dulce Nombre de Culmo','15', 1),
	  ('1601','Santa Barbara','16', 1),
      ('1602','Arada','16', 1),
      ('1603','Atima','16', 1),
	  ('1604','Azacualpa','16', 1),
      ('1605','Ceguaca','16', 1),
	  ('1701','Nacaome','17', 1),
      ('1702','Alianza','17', 1),
      ('1703','Amapala','17', 1),
	  ('1704','Aramecina','17', 1),
      ('1705','Caridad','17', 1),
	  ('1801','Yoro','18', 1),
      ('1802','Arenal','18', 1),
      ('1803','El Negrito','18', 1),
	  ('1804','El Progreso','18', 1),
      ('1805','Jocon','18', 1)

	
	--********INSERT TABLA Cargos****************---
GO
INSERT INTO opti.tbCargos(carg_Nombre,carg_UsuCreacion)
VALUES('Oftalmólogos',1)

	  
--********INSERT TABLA Categorias****************---
GO
INSERT INTO opti.tbCategorias(cate_Nombre, cate_UsuCreacion)
VALUES('Aros de metal',1),
      ('Aros de acetato',1),
	  ('Aros semirrígidos',1),
	  ('Aros de titanio',1),
	  ('Aros deportivos',1),
	  ('Aros de diseño',1)


--********INSERT TABLA METODOS DE PAGOS****************---
GO
INSERT INTO opti.tbMetodosPago(meto_Nombre, meto_UsuCreacion)
VALUES('Efectivo',1),
      ('Tarjeta',1)

--********INSERT TABLA Estados Civiles****************---
GO
INSERT INTO gral.tbEstadosCiviles(estacivi_Nombre,estacivi_UsuCreacion)
VALUES('Soltero(a)',1),
      ('Casado(a)',1),
	  ('Divorciado(a)',1),
	  ('Union Libre',1)

--********INSERT TABLA Estados Proveedores****************---
INSERT INTO opti.tbProveedores(prov_Nombre,prov_Direccion,prov_CorreoElectronico,prov_Telefono,prov_UsuCreacion)
VALUES('Optica Universal','2 Calle 6 Avenida N.O. B�, Guamilito, 6 Avenida','Optica_Universal@hotmail.com','2550-1550',1),
      ('Optica Optimas','Barrio Medina 3ra ave, entre 10 y 11 Calle','Optica.Optimas@hotmail.com','9928-0486',1),
	  ('Optica Buena Esperanza','Barrio El entro 3ra ave','buenaEsperanza@hotmail.com','9928-0486',1),
	  ('PRODIST','la región de La Pobla De Vallbona (Valencia)','prodist@hotmail.com','34628-0486',1),
	  ('Prosun','Barcelona','prosun@hotmail.com','23528-0486',1),
	  ('Missandtrendy Sunglasses | London','Londres','Missandtrendy@hotmail.com','23528-0486',1)

	  --********INSERT TABLA SUCURSALES****************---
INSERT INTO opti.tbSucursales(sucu_Descripcion,muni_Id,sucu_DireccionExacta,sucu_UsuCreacion)
VALUES('Optica Popular Mall Multiplaza','0801','Mall Multiplaza',1),
      ('Optica Popular Mall Plaza Miraflores','0801','Mall Plaza Miraflores',1),
	  ('Optica Popular City Mall','0501','City Mall',1),
	  ('Optica Popular Mall Las Americas','0502','Mall Las Americas',1),
	  ('Optica Popular City Mall','0801','City Mall',1)

	   --********INSERT TABLA Empleados****************---
INSERT INTO opti.tbEmpleados( empe_Nombres, empe_Apellidos, empe_Identidad, empe_FechaNacimiento, empe_Sexo, estacivi_Id, empe_Telefono, empe_CorreoElectronico, sucu_Id, empe_UsuCreacion)
VALUES('Clara','Gomez','1234567890123','05-12-2003','F',1,'98107260','gomez23.e@gmail.com',1,1),
      ('Maria Lucero','Ramirez','452879612354','02-12-2003','F',1,'97260425','maria.lucero@gmail.com',1,1),
	  ('Karla Elisa','Ramirez','859679612354','02-02-2000','F',1,'98107260','karlaramirez@gmail.com',1,1),
	  ('Manuel','Cardona','8759632415785','05-05-2001','M',1,'97307260','manuel@gmail.com',1,1),
	  ('Mauricio','Mendosa','0529632415785','15-05-2001','M',1,'99307260','mMENDOZA@gmail.com',1,1),
	  ('Rafael','Alvarado','0529582415785','05-05-2000','M',1,'99307260','mMENDOZA@gmail.com',1,1),
	  ('Carlos','Amaya','0569582415785','04-05-2000','M',1,'99307260','amayacarlos@gmail.com',1,1),
	  ('Jose Manuel','Hernadez','0569582415712','14-05-2004','M',1,'33207260','josemanuel12@gmail.com',1,1),
	  ('Samuel','Bautista','0561272415712','14-04-2007','M',1,'32007260','samuel12@gmail.com',1,1),
	  ('Erick','Hernadez','0561272415799','30-04-2007','M',1,'92007930','erickhernadez@gmail.com',1,1)

  --********INSERT TABLA Clientes****************---
INSERT INTO [opti].[tbClientes](clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, clie_UsuCreacion)
VALUES('Juan','Perez','1234567890123','08-02-2000','M',2,'12345678','juan.perez@example.com',1),
      ('María','Gómez','9876543210987','06-06-2004','F',1,'98765432','maria.gomez@example.com',1),
      ('Pedro','González','4567890123456','05-02-2006','M',1,'45678901','pedro.gonzalez@example.com',1),
	  ('Ana','Fernández','7654321098765','25-12-2009','F',1,'76543210','ana.fernandez@example.com',1),
	  ('Carlos','López','9876543212345','28-02-2003','M',1,'98765432','carlos.lopez@example.com',1),
	  ('Laura','Martínez','5678901234567','05-12-2003','F',1,'56789012','laura.martinez@example.com',1),
      ('Manuel','Díaz','3456789012345','05-12-2007','M',1,'34567890','manuel.diaz@example.com',1),
	  ('David','Hernández','5678901234567','05-12-2008','M',1,'55400045','david.hernandez@example.com',1)

--********INSERT TABLA Marcas****************---
INSERT INTO opti.tbMarcas(marc_Nombre , usua_IdCreacion)
VALUES('Ray-Ban',1),
      ('Oakley',1),
	  ('Maui Jim',1),
	  ('American Optical',1),
	  ('Tom Ford',1),
	  ('Prada',1),
	  ('Oliver Peoples',1)


 --********INSERT TABLA AROS****************---
INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_Stock, aros_UsuCreacion)
VALUES('Deportivo',120,1,1,1,100,1),
      ('Clubmaster',220,1,1,2,100,1),
      ('Cuadrado',220,1,1,3,100,1),
	  ('Redondo',220,1,1,4,100,1),
	  ('Cat Eye',220,1,1,5,100,1),
	  ('Ovalado',220,1,1,6,100,1),
	  ('Rectangular',220,1,1,7,100,1),
	  ('Al Aire',220,1,1,6,100,1)

 --********INSERT TABLA Consultorio****************---
INSERT INTO opti.tbConsultorios(cons_Nombre,empe_Id,usua_IdCreacion)
VALUES('Consultorio 1',1,1),
      ('Consultorio 2',2,1),
	  ('Consultorio 3',3,1)
