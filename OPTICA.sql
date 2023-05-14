CREATE DATABASE OpticaPopular
GO

/*
USE MASTER

DROP DATABASE OpticaPopular
*/

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
VALUES ('Usuarios', '/Usuario/Listado', 'Acceso', 'usuariosItem', 1),
       ('Roles', '/Rol/Listado', 'Acceso', 'rolItem', 1),
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
GO

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
	CONSTRAINT PK_acce_tbUsuarios_usua_Id  PRIMARY KEY(usua_Id)
);
GO

--********* PROCEDIMIENTO INSERTAR USUARIOS ADMIN**************--
CREATE OR ALTER PROCEDURE acce.UDP_InsertUsuario
	@usua_NombreUsuario NVARCHAR(100),	@usua_Contrasena NVARCHAR(200),
	@usua_EsAdmin BIT,					@role_Id INT, 
	@empe_Id INT										
AS
BEGIN
	DECLARE @password NVARCHAR(MAX)=(SELECT HASHBYTES('Sha2_512', @usua_Contrasena));

	INSERT acce.tbUsuarios(usua_NombreUsuario, usua_Contrasena, usua_EsAdmin, role_Id, empe_Id, usua_UsuCreacion)
	VALUES(@usua_NombreUsuario, @password, @usua_EsAdmin, @role_Id, @empe_Id, 1);
END
GO

EXEC acce.UDP_InsertUsuario 'admin', '123', 1, 1, 1;
GO

--********* ALTERAR TABLA ROLES **************--
--********* AGREGAR CAMPOS AUDITORIA**************--

ALTER TABLE acce.tbRoles
ADD CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuCreacion_usua_Id 	FOREIGN KEY(role_UsuCreacion) REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuModificacion_usua_Id 	FOREIGN KEY(role_UsuModificacion) REFERENCES acce.tbUsuarios(usua_Id);
GO

INSERT INTO acce.tbRoles(role_Nombre, role_UsuCreacion)
VALUES ('Gerencia', 1),
	   ('Ventas', 1),
	   ('Inventario', 1)
GO

--********* ALTERAR TABLA USUARIOS **************--
--********* AGREGAR CAMPO ROL, AUDITORIA**************--

ALTER TABLE acce.tbUsuarios
ADD CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_usua_UsuCreacion_usua_Id  FOREIGN KEY(usua_UsuCreacion) REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_usua_UsuModificacion_usua_Id  FOREIGN KEY(usua_UsuModificacion) REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbRoles_role_Id FOREIGN KEY(role_Id) REFERENCES acce.tbRoles(role_Id)
GO 

ALTER TABLE acce.tbPantallasPorRoles
ADD CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuCreacion_usua_Id FOREIGN KEY(pantrole_UsuCreacion) REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuModificacion_usua_Id FOREIGN KEY(pantrole_UsuModificacion) REFERENCES acce.tbUsuarios(usua_Id)
GO

--*******************************************--
--********TABLA DEPARTAMENTO****************---

CREATE TABLE gral.tbDepartamentos(
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
GO

--********TABLA MUNICIPIO****************---
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
GO


--****************************************************TABLE Direcciones****************************************************--

CREATE TABLE opti.tbDirecciones
(
	dire_Id						INT IDENTITY(1,1),
	muni_Id						CHAR(4) NOT NULL,
	dire_DireccionExacta		NVARCHAR(MAX) NOT NULL,
	
	dire_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	dire_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	dire_FechaModificacion		DATETIME DEFAULT NULL,
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
GO

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
GO

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
GO

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
GO

CREATE TABLE opti.tbProveedores
(
	prov_Id						INT IDENTITY,
	prov_Nombre					NVARCHAR(200) NOT NULL,
	prov_CorreoElectronico      NVARCHAR(200) NOT NULL,
	prov_Telefono				NVARCHAR(15)NOT NULL,
	dire_Id						INT NOT NULL,
	prov_UsuCreacion			INT NOT NULL,
	prov_FechaCreacion			DATETIME NOT NULL CONSTRAINT DF_prov_FechaCreacion DEFAULT(GETDATE()),
	prov_UsuModificacion		INT,
	prov_FechaModificacion		DATETIME,
	prov_Estado					BIT NOT NULL CONSTRAINT DF_prov_Estado DEFAULT(1)

	CONSTRAINT PK_opti_tbProeedores_prov_Id											PRIMARY KEY(prov_Id),
	CONSTRAINT FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuCreacion_usua_Id  			FOREIGN KEY(prov_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuModificacion_usua_Id 		FOREIGN KEY(prov_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);
GO

ALTER TABLE  opti.tbProveedores ADD CONSTRAINT FK_opti_tbProveedores_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
GO

--***************TABLA Sucursales*************************--
CREATE TABLE opti.tbSucursales(
    sucu_Id                             INT IDENTITY(1,1), 
    sucu_Descripcion                    NVARCHAR(200) NOT NULL,
	dire_Id								INT NOT NULL,
    sucu_UsuCreacion                    INT not null,
	sucu_FechaCreacion                  DATETIME NOT NULL CONSTRAINT DF_sucu_FechaCreacion DEFAULT(GETDATE()),
    sucu_UsuModificacion                INT,
	sucu_FechaModificacion              DATETIME,
    sucu_Estado                         BIT NOT NULL CONSTRAINT DF_sucu_Estado DEFAULT(1),
    CONSTRAINT PK_opti_tbSucursales_sucu_Id PRIMARY KEY(sucu_Id),
    CONSTRAINT FK_opti_acce_tbSucursales_sucu_UsuCreacion FOREIGN KEY (sucu_UsuCreacion) REFERENCES acce.tbUsuarios (usua_Id),
	CONSTRAINT FK_opti_acce_tbSucursales_sucu_UsuModificacion FOREIGN KEY (sucu_UsuModificacion) REFERENCES acce.tbUsuarios (usua_Id)
);
GO

ALTER TABLE opti.tbSucursales ADD CONSTRAINT FK_opti_tbSucursales_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
GO

--********TABLA EMPLEADOS****************---
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
	dire_Id						INT			   NOT NULL,
	carg_Id						INT			   NOT NULL,
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
    CONSTRAINT FK_maqu_tbEmpleados_maqu_tbSucursales_sucu_Id                     FOREIGN KEY(sucu_Id)                     REFERENCES opti.tbSucursales(sucu_Id), 
    CONSTRAINT FK_maqu_tbEmpleados_maqu_tbCargos_carg_Id						 FOREIGN KEY(carg_Id)                     REFERENCES opti.tbCargos(carg_Id)      
);
GO

ALTER TABLE opti.tbEmpleados ADD CONSTRAINT FK_opti_tbEmpleados_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
GO

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
	dire_Id						INT NOT NULL,
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
GO

ALTER TABLE opti.tbClientes ADD CONSTRAINT FK_opti_tbClientes_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
GO

--***********************************************TABLE DireccionesPorCliente***********************************************--

CREATE TABLE opti.tbDireccionesPorCliente
(
	dicl_Id						INT IDENTITY(1,1),
	clie_Id						INT NOT NULL,
	dire_Id						INT NOT NULL,

	dicl_Estado					BIT DEFAULT 1,
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
GO

ALTER TABLE opti.tbMarcas 
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios(usua_Id)
GO

ALTER TABLE opti.tbMarcas 
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--*****************************************************/TABLE Marcas******************************************************--

--********TABLA Aros****************---
CREATE TABLE opti.tbAros
(
	aros_Id								INT IDENTITY,
	aros_Descripcion					NVARCHAR(300)NOT NULL,
	aros_CostoUni						DECIMAL(18,2) NOT NULL,
	cate_Id								INT NOT NULL,
	prov_Id								INT NOT NULL,
	marc_Id								INT NOT NULL,
	aros_UsuCreacion					INT NOT NULL,
	aros_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_aros_FechaCreacion DEFAULT(GETDATE()),
	aros_FechaModificacion				DATETIME,
	aros_UsuModificacion				INT,
	aros_Estado							BIT NOT NULL CONSTRAINT DF_aros_Estado DEFAULT(1),
	CONSTRAINT PK_opti_tbAros_aros_Id 											PRIMARY KEY(aros_Id),
	CONSTRAINT FK_opti_tbAros_opti_tbProveedores_prov_Id 						FOREIGN KEY(prov_Id) 				REFERENCES opti.tbProveedores(prov_Id),
	CONSTRAINT FK_opti_tbAros_opti_tbCategorias_cate_Id 						FOREIGN KEY(cate_Id) 				REFERENCES opti.tbCategorias(cate_Id),
	CONSTRAINT FK_opti_tbAros_opti_tbMarcas_marc_Id 							FOREIGN KEY(marc_Id) 				REFERENCES opti.tbMarcas(marc_Id),
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuCreacion_usua_Id  		FOREIGN KEY(aros_UsuCreacion) 		REFERENCES acce.tbUsuarios(usua_Id),
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuModificacion_usua_Id  	FOREIGN KEY(aros_UsuModificacion) 	REFERENCES acce.tbUsuarios(usua_Id)
);
GO

CREATE TABLE opti.tbStockArosPorSucursal
(
	stsu_Id					INT IDENTITY(1,1),
	sucu_Id					INT NOT NULL,
	aros_Id					INT NOT NULL,
	stsu_Stock				INT NOT NULL,
	
	stsu_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	stsu_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	stsu_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbStockArosPorSucursal_stsu_Id PRIMARY KEY (stsu_Id),
	CONSTRAINT FK_opti_tbStockArosPorSucursal_sucu_Id_opti_tbSucursales_sucu_Id FOREIGN KEY (sucu_Id) REFERENCES opti.tbSucursales (sucu_Id),
	CONSTRAINT FK_opti_tbStockArosPorSucursal_aros_Id_opti_tbAros_aros_Id FOREIGN KEY (aros_Id) REFERENCES opti.tbAros (aros_Id)
);
GO

ALTER TABLE opti.tbStockArosPorSucursal 
ADD CONSTRAINT FK_opti_tbStockArosPorSucursal_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios(usua_Id)
GO

ALTER TABLE opti.tbStockArosPorSucursal 
ADD CONSTRAINT FK_opti_tbStockArosPorSucursal_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

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
	clie_Id					INT,
	cita_Id					INT,
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
	CONSTRAINT FK_opti_tbOrdenes_cita_Id_opti_tbCitas_cita_Id FOREIGN KEY (cita_Id) REFERENCES opti.tbCitas (cita_Id),
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
	aros_Id					INT,
	deor_GraduacionLeft		VARCHAR(10),
	deor_GraduacionRight	VARCHAR(10),
	deor_Transition			BIT DEFAULT 0,
	deor_FiltroLuzAzul		BIT DEFAULT 0,
	deor_Precio				DECIMAL(18,2) NOT NULL,
	deor_Cantidad			INT NOT NULL,
	deor_Total				DECIMAL(18,2) NOT NULL,

	deor_Estado				BIT DEFAULT 1,
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

--******************************************************TABLE Facturas******************************************************--
CREATE TABLE opti.tbFacturas
(
	fact_Id								INT IDENTITY(1,1),
	cita_Id								INT,
	fact_Fecha							DATE DEFAULT GETDATE(),
	meto_Id								INT NOT NULL,
	empe_Id								INT NOT NULL,
	fact_Total							DECIMAL(18,2) NOT NULL,

	fact_Estado							BIT DEFAULT 1,	
	usua_IdCreacion						INT NOT NULL,
	fact_FechaCreacion					DATETIME DEFAULT GETDATE(),
	usua_IdModificacion					INT,
	fact_FechaModificacion				DATETIME,
	CONSTRAINT PK_opti_tbFacturas_fact_Id PRIMARY KEY(fact_Id),
	CONSTRAINT FK_opti_tbFacturas_cita_Id_opti_tbCitas_cita_Id FOREIGN KEY (cita_Id) REFERENCES opti.tbCitas (cita_Id),
	CONSTRAINT FK_opti_tbFacturas_meto_Id_opti_tbMetodosPago_meto_Id FOREIGN KEY (meto_Id) REFERENCES opti.tbMetodosPago (meto_Id),
	CONSTRAINT FK_opti_tbFacturas_empe_Id_opti_tbEmpleados_empe_Id FOREIGN KEY (empe_Id) REFERENCES opti.tbEmpleados (empe_Id)
);
GO

ALTER TABLE opti.tbFacturas 
ADD CONSTRAINT FK_opti_tbFacturas_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbFacturas 
ADD CONSTRAINT FK_opti_tbFacturas_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--*****************************************************/TABLE Facturas******************************************************--

--*******************************************************TABLE Envios******************************************************--

CREATE TABLE opti.tbEnvios
(
	envi_Id						INT IDENTITY(1,1),
	fact_Id						INT NOT NULL,
	dire_Id						INT NOT NULL,
	envi_Fecha					DATE DEFAULT GETDATE(),
	envi_FechaEntrega			DATE NOT NULL,
	envi_FechaEntregaReal		DATE NOT NULL,

	envi_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	envi_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	envi_FechaModificacion		DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbEnvios_envi_Id PRIMARY KEY (envi_Id),
	CONSTRAINT FK_opti_tbEnvios_fact_Id_opti_tbFacturas_fact_Id FOREIGN KEY (fact_Id) REFERENCES opti.tbFacturas (fact_Id),
	CONSTRAINT FK_opti_tbEnvios_dire_Id_opti_tbDirecciones_dire_Id FOREIGN KEY (dire_Id) REFERENCES opti.tbDirecciones (dire_Id)
);
GO

ALTER TABLE opti.tbEnvios 
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbEnvios 
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

--******************************************************/TABLE Envios******************************************************--

--***************************************************TABLE DetallesEnvios**************************************************--

CREATE TABLE opti.tbDetallesEnvios
(
	deen_Id		INT IDENTITY(1,1),
	envi_Id		INT NOT NULL,
	orde_Id		INT NOT NULL,

	deen_Estado					BIT DEFAULT 1,
	usua_IdCreacion				INT NOT NULL,
	deen_FechaCreacion			DATETIME DEFAULT GETDATE(),
	usua_IdModificacion			INT DEFAULT NULL,
	deen_FechaModificacion		DATETIME DEFAULT NULL,
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

--**************************************************TABLE Detalles Factura******************************************************--

CREATE TABLE opti.tbDetallesFactura
(
	defa_Id									INT IDENTITY(1,1),
	fact_Id									INT NOT NULL,
	orde_Id									INT,
	envi_Id									INT,
	defa_Total								DECIMAL(18,2) NOT NULL,

	defa_Estado								BIT DEFAULT 1,
	usua_IdCreacion							INT NOT NULL,
	defa_FechaCreacion						DATETIME DEFAULT GETDATE(),
	usua_IdModificacion						INT,
	defa_FechaModificacion					DATETIME,
	CONSTRAINT PK_opti_tbDetallesFactura_defa_Id PRIMARY KEY(defa_Id),
	CONSTRAINT FK_opti_tbDetallesFactura_fact_Id_opti_tbFacturas_fact_Id FOREIGN KEY (fact_Id) REFERENCES opti.tbFacturas (fact_Id),
	CONSTRAINT FK_opti_tbDetallesFactura_orde_Id_opti_tbOrdenes_orde_Id FOREIGN KEY (orde_Id) REFERENCES opti.tbOrdenes (orde_Id),
	CONSTRAINT FK_opti_tbDetallesFactura_envi_Id_opti_tbEnvios_envi_Id FOREIGN KEY(envi_Id) REFERENCES opti.tbEnvios (envi_Id)
);
GO

ALTER TABLE opti.tbDetallesFactura 
ADD CONSTRAINT FK_opti_tbDetallesFactura_usua_IdCreacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdCreacion) REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesFactura 
ADD CONSTRAINT FK_opti_tbDetallesFactura_usua_IdModificacion_acce_tbUsuarios_usua_Id FOREIGN KEY (usua_IdModificacion) REFERENCES acce.tbUsuarios (usua_Id)
GO
--**************************************************TABLE Detalles Factura******************************************************--


--******************************************TRIGGERS tbSucursales******************************************--

--CREATE TRIGGER 'TRG_tbSucursales_StockArosPorSucursal'
CREATE OR ALTER TRIGGER opti.TRG_tbSucursales_StockArosPorSucursal
ON opti.tbSucursales
AFTER INSERT
AS
BEGIN
	DECLARE @sucu_Id AS INT, @usua_IdCreacion AS INT;

	SELECT @sucu_Id  = sucu_Id,
		   @usua_IdCreacion = sucu_usuCreacion
	  FROM inserted

	DECLARE @aros_Id AS INT
	
	DECLARE aros_Id CURSOR FOR SELECT aros_Id FROM opti.tbAros
	OPEN aros_Id
	FETCH NEXT FROM aros_Id INTO @aros_Id 
	WHILE @@fetch_status = 0
	BEGIN
		INSERT INTO opti.tbStockArosPorSucursal (aros_Id, sucu_Id, stsu_Stock, usua_IdCreacion)
		VALUES(@aros_Id, @sucu_Id, 0, @usua_IdCreacion);
	
	    FETCH NEXT FROM aros_Id INTO @aros_Id 
	END
	CLOSE aros_Id
	DEALLOCATE aros_Id
END
GO

--*****************************************/TRIGGERS tbSucursales******************************************--

--**************************************TRIGGERS tbAros*******************************************--

--CREATE TRIGGER 'TRG_tbAros_StockPorAros'
CREATE OR ALTER TRIGGER opti.TRG_tbAros_StockPorAros
ON opti.tbAros
AFTER INSERT
AS
BEGIN
	DECLARE @aros_Id AS INT, @usua_IdCreacion AS INT;

	SELECT @aros_Id = aros_Id,
		   @usua_IdCreacion = aros_usuCreacion
	  FROM inserted

	DECLARE @sucu_Id AS INT
	
	DECLARE sucuId CURSOR FOR SELECT sucu_Id FROM opti.tbSucursales
	OPEN sucuId
	FETCH NEXT FROM sucuId INTO @sucu_Id 
	WHILE @@fetch_status = 0
	BEGIN
		INSERT INTO opti.tbStockArosPorSucursal (aros_Id, sucu_Id, stsu_Stock, usua_IdCreacion)
		VALUES(@aros_Id, @sucu_Id, 0, @usua_IdCreacion);
	
	    FETCH NEXT FROM sucuId INTO @sucu_Id 
	END
	CLOSE sucuId
	DEALLOCATE sucuId
END
GO

--***********************************************TRIGGERS tbAros*******************************************--


--******************************************TRIGGERS tbDetallesOrdenes*******************************************--

CREATE OR ALTER TRIGGER opti.TRG_tbDetallesOrdenes_Total
ON [opti].[tbDetallesOrdenes]
AFTER INSERT
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN
			DECLARE @aros_CostoUni DECIMAL(18,2), @deor_Transition DECIMAL(18,2), @deor_FiltroLuzAzul DECIMAL(18,2), @deor_Precio DECIMAL(18,2)

			SELECT @aros_CostoUni = [aros_CostoUni] FROM [opti].[tbAros] WHERE [aros_Id] = (SELECT [aros_Id] from inserted)

			IF (SELECT [deor_Transition] FROM inserted) = 1
			BEGIN
				SET @deor_Transition = 820
			END
			ELSE
			BEGIN
				SET @deor_Transition = 0
			END

			IF (SELECT [deor_FiltroLuzAzul] FROM inserted) = 1
			BEGIN
				SET @deor_FiltroLuzAzul = 750
			END
			ELSE
			BEGIN
				SET @deor_FiltroLuzAzul = 0
			END

			IF (SELECT [deor_Precio] FROM inserted) > 0
			BEGIN
				SET @deor_Precio = @deor_Transition + @deor_FiltroLuzAzul + @aros_CostoUni + (SELECT [deor_Precio] FROM inserted)
				UPDATE [opti].[tbDetallesOrdenes]
				SET [deor_Precio] = @deor_Precio,
					[deor_Total] = [deor_Cantidad] * @deor_Precio
				WHERE [deor_Id] = (SELECT [deor_Id] FROM inserted)
			END
			ELSE
			BEGIN
				SET @deor_Precio = @deor_Transition + @deor_FiltroLuzAzul + @aros_CostoUni + 600
				UPDATE [opti].[tbDetallesOrdenes]
				SET [deor_Precio] = @deor_Precio,
					[deor_Total] = [deor_Cantidad] * @deor_Precio
				WHERE [deor_Id] = (SELECT [deor_Id] FROM inserted)
			END
		COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK
	END CATCH
END
GO

CREATE OR ALTER TRIGGER opti.TRG_tbClientes_Direcciones
ON [opti].[tbClientes]
AFTER INSERT
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN
			DECLARE @clie_Id INT, @dire_Id INT, @usua_IdCreacion INT

			SELECT @clie_Id = [clie_Id],
				   @dire_Id = [dire_Id],
				   @usua_IdCreacion = clie_UsuCreacion
			  FROM inserted

			INSERT INTO [opti].[tbDireccionesPorCliente] ([clie_Id], [dire_Id], [usua_IdCreacion])
			VALUES (@clie_Id, @dire_Id, @usua_IdCreacion)

		COMMIT
	END TRY
	BEGIN CATCH
		ROLLBACK
	END CATCH
END
GO

--*****************************************/TRIGGERS tbDetallesOrdenes*******************************************--

/*TRIGGER AROS*/
CREATE OR ALTER TRIGGER opti.trg_tbDetallesOrdenes_ReducirStock
ON [opti].[tbDetallesOrdenes]
AFTER INSERT
AS
BEGIN
	UPDATE [opti].[tbStockArosPorSucursal]
	SET [stsu_Stock] = [stsu_Stock] - (SELECT [deor_Cantidad] FROM inserted)
	WHERE [aros_Id] = (SELECT [aros_Id] FROM inserted)
	AND [sucu_Id] = (SELECT [sucu_Id] FROM [opti].[tbOrdenes] WHERE [orde_Id] = (SELECT [orde_Id] FROM inserted))
END
GO

CREATE OR ALTER TRIGGER opti.trg_tbDetallesOrdenes_ReducirStock2
ON [opti].[tbDetallesOrdenes]
AFTER UPDATE
AS
BEGIN
	UPDATE [opti].[tbStockArosPorSucursal]
	SET [stsu_Stock] = [stsu_Stock] - ((SELECT [deor_Cantidad] FROM inserted) - (SELECT [deor_Cantidad] FROM deleted))
	WHERE [aros_Id] = (SELECT [aros_Id] FROM inserted)
	AND [sucu_Id] = (SELECT [sucu_Id] FROM [opti].[tbOrdenes] WHERE [orde_Id] = (SELECT [orde_Id] FROM inserted))
END
GO

CREATE OR ALTER TRIGGER opti.trg_tbDetallesOrdenes_AumentarStock
ON [opti].[tbDetallesOrdenes]
AFTER DELETE
AS
BEGIN
	UPDATE [opti].[tbStockArosPorSucursal]
	SET [stsu_Stock] = [stsu_Stock] + (SELECT [deor_Cantidad] FROM deleted)
	WHERE [aros_Id] = (SELECT [aros_Id] FROM deleted)
	AND [sucu_Id] = (SELECT [sucu_Id] FROM [opti].[tbOrdenes] WHERE [orde_Id] = (SELECT [orde_Id] FROM deleted))
END
GO

--INSERT DE LA BASE DE DATOS
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
	  ('0103','Esparta','01', 1),
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
GO

--********INSERT TABLA Cargos****************---
INSERT INTO opti.tbCargos(carg_Nombre,carg_UsuCreacion)
VALUES('Oftalmólogo',1)
GO
	  
--********INSERT TABLA Categorias****************---
INSERT INTO opti.tbCategorias(cate_Nombre, cate_UsuCreacion)
VALUES('Aros de metal',1),
      ('Aros de acetato',1),
	  ('Aros semirrígidos',1),
	  ('Aros de titanio',1),
	  ('Aros deportivos',1),
	  ('Aros de diseño',1)
GO

--********INSERT TABLA METODOS DE PAGOS****************---
INSERT INTO opti.tbMetodosPago(meto_Nombre, meto_UsuCreacion)
VALUES('Efectivo',1),
      ('Tarjeta',1)
GO

--********INSERT TABLA Estados Civiles****************---
INSERT INTO gral.tbEstadosCiviles(estacivi_Nombre,estacivi_UsuCreacion)
VALUES('Soltero(a)',1),
      ('Casado(a)',1),
	  ('Divorciado(a)',1),
	  ('Union Libre',1)
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0501', '2 Calle 6 Avenida N.O. B�, Guamilito, 6 Avenida', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0501', 'Barrio Medina 3ra ave, entre 10 y 11 Calle', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0501', 'Barrio El centro 3ra ave', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0601', 'Col. Moderna 12 ave, entre 3ra y 4ta calle', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0701', 'Barrio Barandillas 7ave entre 2da y 3ra calle', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0801', 'Col. La libertad 2ave entre 5ta y 6ta calle', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0801', 'Mall Multiplaza', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0801','Mall Plaza Miraflores', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0501','City Mall', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0502','Mall Las Americas', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0801','City Mall', 1);
GO


INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0101', 'Col. La primavera', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0201', 'Res. Monte Alegre', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0301', 'Aldea. Los capulines', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0401', 'Barrio Medina', 1);
GO

INSERT INTO opti.tbDirecciones (muni_Id, dire_DireccionExacta, usua_IdCreacion)
VALUES('0501', 'Col. El pedregal', 1);
GO

--********INSERT TABLA Estados Proveedores****************---
INSERT INTO opti.tbProveedores(prov_Nombre, dire_Id, prov_CorreoElectronico,prov_Telefono,prov_UsuCreacion)
VALUES('Optica Universal', 1,'Optica_Universal@hotmail.com','2550-1550',1),
      ('Optica Optimas', 2,'Optica.Optimas@hotmail.com','9928-0486',1),
	  ('Optica Buena Esperanza', 3,'buenaEsperanza@hotmail.com','9928-0486',1),
	  ('PRODIST', 4,'prodist@hotmail.com','34628-0486',1),
	  ('Prosun', 5,'prosun@hotmail.com','23528-0486',1),
	  ('Missandtrendy Sunglasses', 6,'Missandtrendy@hotmail.com','23528-0486',1)
GO

	  --********INSERT TABLA SUCURSALES****************---
INSERT INTO opti.tbSucursales(sucu_Descripcion, dire_Id, sucu_UsuCreacion)
VALUES('Optica Popular Mall Multiplaza', 7, 1),
      ('Optica Popular Mall Plaza Miraflores', 8, 1),
	  ('Optica Popular City Mall', 9, 1),
	  ('Optica Popular Mall Las Americas', 10,1)
GO

--INSERT TABLA Empleados********---
INSERT INTO opti.tbEmpleados(empe_Nombres, empe_Apellidos, empe_Identidad, empe_FechaNacimiento, empe_Sexo, estacivi_Id, empe_Telefono, empe_CorreoElectronico, dire_Id, carg_Id, sucu_Id, empe_UsuCreacion)
VALUES('Clara','Gomez','1234567890123','2003-12-05','F',1,'98107260','gomez23.e@gmail.com', 12, 1, 1,1),
('Maria Lucero','Ramirez','452879612354','2003-12-02','F',1,'97260425','maria.lucero@gmail.com', 13, 1, 1,1),
('Karla Elisa','Ramirez','859679612354','2000-02-02','F',1,'98107260','karlaramirez@gmail.com', 14, 1,1,1),
('Manuel','Cardona','8759632415785','2001-05-05','M',1,'97307260','manuel@gmail.com', 15, 1, 1,1),
('Mauricio','Mendosa','0529632415785','2001-05-15','M',1,'99307260','mMENDOZA@gmail.com', 16, 1, 2,1),
('Rafael','Alvarado','0529582415785','2000-05-05','M',1,'99307260','alvarado@gmail.com', 12, 1, 2,1),
('Carlos','Amaya','0569582415785','2000-05-04','M',1,'99307260','amayacarlos@gmail.com', 13, 1, 2,1),
('Jose Manuel','Hernadez','0569582415712','2004-05-14','M',1,'33207260','josemanuel12@gmail.com', 14, 1,3,1),
('Samuel','Bautista','0561272415712','2007-04-14','M',1,'32007260','samuel12@gmail.com', 15, 1,3,1),
('Erick','Hernadez','0561272415799','2007-04-30','M',1,'92007930','erickhernadez@gmail.com', 16, 1,3,1)
GO

ALTER TABLE acce.tbUsuarios 
ADD CONSTRAINT FK_acce_tbUsuarios_opti_tbEmpleados_empe_Id FOREIGN KEY(empe_Id) REFERENCES opti.tbEmpleados(empe_Id) 
GO

  --********INSERT TABLA Clientes****************---
INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES('Juan','Perez','1234567890123','M','2000-02-08',2,'12345678','juan.perez@example.com', 16, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('María','Gómez','9876543210987','F','2004-06-06',1,'98765432','maria.gomez@example.com', 15, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('Pedro','González','4567890123456','M','2006-02-05',1,'45678901','pedro.gonzalez@example.com', 14, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('Ana','Fernández','7654321098765','F','2009-12-25',1,'76543210','ana.fernandez@example.com', 13, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('Carlos','López','9876543212345','M','2003-02-28',1,'98765432','carlos.lopez@example.com', 12, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('Laura','Martínez','5678901234567','F','2003-12-05',1,'56789012','laura.martinez@example.com', 16, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('Manuel','Díaz','3456789012345','M','2007-12-05',1,'34567890','manuel.diaz@example.com', 15, 1)
GO

INSERT INTO opti.tbClientes(clie_Nombres, clie_Apellidos, clie_Identidad, clie_Sexo, clie_FechaNacimiento, estacivi_Id, clie_Telefono, clie_CorreoElectronico, dire_Id, clie_UsuCreacion)
VALUES ('David','Hernández','5678901234567','M','2008-12-05',1,'55400045','david.hernandez@example.com', 14, 1)
GO

--********INSERT TABLA Marcas****************---
INSERT INTO opti.tbMarcas(marc_Nombre, usua_IdCreacion)
VALUES('Ray-Ban',1),
      ('Oakley',1),
	  ('Maui Jim',1),
	  ('American Optical',1),
	  ('Tom Ford',1),
	  ('Prada',1),
	  ('Oliver Peoples',1)
GO

 --********INSERT TABLA AROS****************---
INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES('Deportivo',800,1,1,1,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Clubmaster',1250,1,1,2,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Cuadrado',1000,1,1,3,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Redondo',560,1,1,4,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Cat Eye',2100,1,1,5,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Ovalado',1220,1,1,6,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Rectangular',3220,1,1,7,1)
GO

INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
VALUES ('Al Aire',4220,1,1,6,1)
GO

--********************************INSERTS tbStockArosPorSucursal**************************************--
UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 1
   AND sucu_Id = 1
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 2
   AND sucu_Id = 1
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 3
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 4
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 5
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 6
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 7
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 8
   AND sucu_Id = 1
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 1
   AND sucu_Id = 2
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 2
   AND sucu_Id = 2
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 3
   AND sucu_Id = 2
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 4
   AND sucu_Id = 2
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 5
   AND sucu_Id = 2
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 6
   AND sucu_Id = 2
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 7
   AND sucu_Id = 2
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 8
   AND sucu_Id = 2
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 1
   AND sucu_Id = 3
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 2
   AND sucu_Id = 3
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 3
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 4
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 5
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 6
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 7
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 8
   AND sucu_Id = 3
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 1
   AND sucu_Id = 4
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 2
   AND sucu_Id = 4
GO

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 3
   AND sucu_Id = 4
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 4
   AND sucu_Id = 4
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 5
   AND sucu_Id = 4
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 6
   AND sucu_Id = 4
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 7
   AND sucu_Id = 4
GO 

UPDATE opti.tbStockArosPorSucursal
   SET stsu_Stock = 100,
	   usua_IdModificacion = 1,
	   stsu_FechaModificacion = GETDATE()
 WHERE aros_Id = 8
   AND sucu_Id = 4
GO 

--********************************************/INSERTS tbStockArosPorSucursal**************************************--

 --********INSERT TABLA Consultorio****************---
INSERT INTO opti.tbConsultorios(cons_Nombre,empe_Id,usua_IdCreacion)
VALUES('Consultorio 1',1,1),
      ('Consultorio 2',2,1),
	  ('Consultorio 3',3,1),
	  ('Consultorio 4',4,1),
	  ('Consultorio 5',5,1),
      ('Consultorio 6',6,1),
	  ('Consultorio 7',7,1),
	  ('Consultorio 8',8,1),
      ('Consultorio 9',9,1),
	  ('Consultorio 10',10,1)
GO


--*************************************************INSERTS tbCitas*************************************************--
INSERT INTO [opti].[tbCitas] ([clie_Id], [cons_Id], [cita_Fecha], [usua_IdCreacion])
VALUES (1, 2, GETDATE(), 1)
GO

INSERT INTO [opti].[tbCitas] ([clie_Id], [cons_Id], [cita_Fecha], [usua_IdCreacion])
VALUES (2, 2, '05-08-2023', 1)
GO
--************************************************/INSERTS tbCitas*************************************************--

--*********************************************INSERTS tbDetallesCitas*************************************************--
INSERT INTO [opti].[tbDetallesCitas] ([cita_Id], [deci_Costo], [deci_HoraInicio], [deci_HoraFin], [usua_IdCreacion])
VALUES (1, 450.00, '10:20', '10:40', 1)
GO

INSERT INTO [opti].[tbDetallesCitas] ([cita_Id], [deci_Costo], [deci_HoraInicio], [deci_HoraFin], [usua_IdCreacion])
VALUES (2, 450.00, '11:20', '12:00', 1)
GO
--********************************************/INSERTS tbDetallesCitas*************************************************--

INSERT INTO [opti].[tbOrdenes] ([clie_Id], [cita_Id], [sucu_Id], [orde_FechaEntrega], [usua_IdCreacion])
VALUES (null, 1, 1, '06-02-2023', 1)
GO

INSERT INTO [opti].[tbOrdenes] ([clie_Id], [cita_Id], [sucu_Id], [orde_FechaEntrega], [usua_IdCreacion])
VALUES (2, null, 1, '06-03-2023', 1)
GO

INSERT INTO [opti].[tbOrdenes] ([clie_Id], [cita_Id], [sucu_Id], [orde_FechaEntrega], [usua_IdCreacion])
VALUES (null, 1, 1, '06-10-2023', 1)
GO

INSERT INTO [opti].[tbOrdenes] ([clie_Id], [cita_Id], [sucu_Id], [orde_FechaEntrega], [usua_IdCreacion])
VALUES (null, 2, 3, '06-09-2023', 1)
GO

INSERT INTO [opti].[tbOrdenes] ([clie_Id], [cita_Id], [sucu_Id], [orde_FechaEntrega], [usua_IdCreacion])
VALUES (2, null, 2, '06-30-2023', 1)
GO

--********************************************INSERTS tbDetallesOrdenes*************************************************--
INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (1, 2, '-0.125', '-0.301', 1, 1, 0, 1, 0, 1)
GO

INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (1, 3, '-0.125', '-0.301', 1, 0, 0, 1, 0, 1)
GO

INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (2, 3, '+1.000', '+1.150', 0, 0, 800, 1, 0, 1)
GO

INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (3, 1, '-0.250', '-1.000', 1, 0, 0, 2, 0, 1)
GO

INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (4, 4, '+2.000', '+1.300', 1, 0, 0, 1, 0, 1)
GO

INSERT INTO [opti].[tbDetallesOrdenes]([orde_Id], [aros_Id], [deor_GraduacionLeft], [deor_GraduacionRight], [deor_Transition], [deor_FiltroLuzAzul], [deor_Precio], [deor_Cantidad], [deor_Total], [usua_IdCreacion])
VALUES (5, 5, '+1.010', '+1.320', 1, 1, 0, 2, 0, 1)
GO

--********************************************INSERTS tbDetallesOrdenes*************************************************--
