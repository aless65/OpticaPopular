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
	user_Id 				INT IDENTITY(1,1),
	user_NombreUsuario		NVARCHAR(100) NOT NULL,
	user_Contrasena			NVARCHAR(MAX) NOT NULL,
	user_EsAdmin			BIT,
	role_Id					INT,
	empe_Id					INT,
	user_UsuCreacion		INT,
	user_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_user_FechaCreacion DEFAULT(GETDATE()),
	user_UsuModificacion	INT,
	user_FechaModificacion	DATETIME,
	user_Estado				BIT NOT NULL CONSTRAINT DF_user_Estado DEFAULT(1)
	CONSTRAINT PK_acce_tbUsuarios_user_Id  PRIMARY KEY(user_Id),
);

--********* PROCEDIMIENTO INSERTAR USUARIOS ADMIN**************--
GO
CREATE OR ALTER PROCEDURE acce.UDP_InsertUsuario
	@user_NombreUsuario NVARCHAR(100),	@user_Contrasena NVARCHAR(200),
	@user_EsAdmin BIT,					@role_Id INT, 
	@empe_Id INT										
AS
BEGIN
	DECLARE @password NVARCHAR(MAX)=(SELECT HASHBYTES('Sha2_512', @user_Contrasena));

	INSERT acce.tbUsuarios(user_NombreUsuario, user_Contrasena, user_EsAdmin, role_Id, empe_Id, user_UsuCreacion)
	VALUES(@user_NombreUsuario, @password, @user_EsAdmin, @role_Id, @empe_Id, 1);
END;


GO
EXEC acce.UDP_InsertUsuario 'admin', '123', 1, NULL, 1;


--********* ALTERAR TABLA ROLES **************--
--********* AGREGAR CAMPOS AUDITORIA**************--
GO
ALTER TABLE acce.tbRoles
ADD CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuCreacion_user_Id 	FOREIGN KEY(role_UsuCreacion) REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_acce_tbRoles_acce_tbUsuarios_role_UsuModificacion_user_Id 	FOREIGN KEY(role_UsuModificacion) REFERENCES acce.tbUsuarios(user_Id);




GO
INSERT INTO acce.tbRoles(role_Nombre, role_UsuCreacion)
VALUES ('Vendedor', 1)


--********* ALTERAR TABLA USUARIOS **************--
--********* AGREGAR CAMPO ROL, AUDITORIA**************--
GO
ALTER TABLE [acce].[tbUsuarios]
ADD CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_user_UsuCreacion_user_Id  FOREIGN KEY(user_UsuCreacion) REFERENCES acce.tbUsuarios([user_Id]),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbUsuarios_user_UsuModificacion_user_Id  FOREIGN KEY(user_UsuModificacion) REFERENCES acce.tbUsuarios([user_Id]),
	CONSTRAINT FK_acce_tbUsuarios_acce_tbRoles_role_Id FOREIGN KEY(role_Id) REFERENCES acce.tbRoles(role_Id)

GO 
ALTER TABLE [acce].[tbPantallasPorRoles]
ADD CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuCreacion_user_Id FOREIGN KEY([pantrole_UsuCreacion]) REFERENCES acce.tbUsuarios([user_Id]),
	CONSTRAINT FK_acce_tbPantallasPorRoles_acce_tbUsuarios_pantrole_UsuModificacion_user_Id FOREIGN KEY([pantrole_UsuModificacion]) REFERENCES acce.tbUsuarios([user_Id])

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
	CONSTRAINT FK_gral_tbDepartamentos_acce_tbUsuarios_depa_UsuCreacion_user_Id  		FOREIGN KEY(depa_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_gral_tbDepartamentos_acce_tbUsuarios_depa_UsuModificacion_user_Id  	FOREIGN KEY(depa_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
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
	CONSTRAINT FK_gral_tbMunicipios_acce_tbUsuarios_muni_UsuCreacion_user_Id  		FOREIGN KEY(muni_UsuCreacion) 				REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_gral_tbMunicipios_acce_tbUsuarios_muni_UsuModificacion_user_Id  	FOREIGN KEY(muni_UsuModificacion) 			REFERENCES acce.tbUsuarios(user_Id)
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
	CONSTRAINT FK_opti_tbCategorias_acce_tbUsuarios_cate_UsuCreacion_user_Id  			FOREIGN KEY(cate_UsuCreacion) 			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbCategorias_acce_tbUsuarios_cate_UsuModificacion_user_Id  		FOREIGN KEY(cate_UsuModificacion) 		REFERENCES acce.tbUsuarios(user_Id),
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
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_meto_UsuCreacion_user_Id  				FOREIGN KEY(meto_UsuCreacion) 			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_meto_UsuModificacion_user_Id  			FOREIGN KEY(meto_UsuModificacion) 		REFERENCES acce.tbUsuarios(user_Id)
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
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_carg_UsuCreacion_user_Id  				FOREIGN KEY(carg_UsuCreacion) 			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbMetodosPago_acce_tbUsuarios_carg_UsuModificacion_user_Id  			FOREIGN KEY(carg_UsuModificacion) 		REFERENCES acce.tbUsuarios(user_Id)
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
   CONSTRAINT FK_gral_tbEstadosCiviles_acce_tbUsuarios_estacivi_UsuCreacion_user_Id  	FOREIGN KEY(estacivi_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
   CONSTRAINT FK_gral_tbEstadosCiviles_acce_tbUsuarios_estacivi_UsuModificacion_user_Id  FOREIGN KEY(estacivi_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
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
	CONSTRAINT FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuCreacion_user_Id  			FOREIGN KEY(prov_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT  FK_opti_tbProveedores_acce_tbUsuarios_prov_UsuModificacion_user_Id 		FOREIGN KEY(prov_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
);

--***************TABLA SucursalES*************************--
GO
CREATE TABLE opti.tbSucursales(
    sucu_Id                             INT IDENTITY(1,1), 
    sucu_Descripcion                    NVARCHAR(200) NOT NULL,
    muni_Id                             CHAR(4),
	sucu_DireccionExacta				NVARCHAR(500) NOT NULL,
    sucu_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_sucu_FechaCreacion DEFAULT(GETDATE()),
    sucu_UsuCreacion					INT not null,
    sucu_FechaModificacion				DATETIME,
    sucu_UsuModificacion				INT,
    sucu_Estado							BIT NOT NULL CONSTRAINT DF_sucu_Estado DEFAULT(1),
    CONSTRAINT PK_opti_tbSucursales_sucu_Id PRIMARY KEY(sucu_Id),
	CONSTRAINT FK_opti_gral_tbSucursales_muni_Id FOREIGN KEY (muni_Id) REFERENCES gral.tbMunicipios (muni_Id),
	CONSTRAINT FK_opti_acce_tbSucursales_user_Id FOREIGN KEY (sucu_UsuCreacion) REFERENCES acce.tbUsuarios (user_id)
);

--********TABLA EMPLEADOS****************---
GO
CREATE TABLE opti.tbEmpleados(
	empe_Id						INT IDENTITY(1,1),
	empe_Nombres				NVARCHAR(100)	NOT NULL,
	empe_Apellidos				NVARCHAR(100)	NOT NULL,
	empe_Identidad				VARCHAR(13)		NOT NULL,
	empe_FechaNacimiento		DATE			NOT NULL,
	empe_Sexo					CHAR(1)			NOT NULL,
	estacivi_Id					INT				NOT NULL,
	empe_Telefono				NVARCHAR(15)	NOT NULL,
	empe_CorreoElectronico		NVARCHAR(200)	NOT NULL,
	carg_Id						INT				NOT NULL,
	sucu_Id						INT				NOT NULL,
	empe_Salario				DECIMAL(18,2)	NOT NULL,
	empe_UsuCreacion			INT				NOT NULL,
	empe_FechaCreacion			DATETIME		NOT NULL CONSTRAINT DF_empe_FechaCreacion DEFAULT(GETDATE()),
	empe_UsuModificacion		INT,
	empe_FechaModificacion		DATETIME,
	empe_Estado					BIT NOT NULL CONSTRAINT DF_empe_Estado DEFAULT(1),
	
	CONSTRAINT PK_opti_tbEmpleados_empe_Id 										PRIMARY KEY(empe_Id),
	CONSTRAINT CK_opti_tbEmpleados_empe_Sexo									CHECK(empe_sexo IN ('F', 'M')),
	CONSTRAINT FK_opti_tbEmpleados_gral_tbEstadosCiviles_estacivi_Id			FOREIGN KEY(estacivi_Id)					REFERENCES gral.tbEstadosCiviles(estacivi_Id),		
	CONSTRAINT FK_opti_tbEmpleados_opti_tbCargos_carg_Id						FOREIGN KEY(carg_Id)						REFERENCES opti.tbCargos(carg_Id),
	CONSTRAINT FK_opti_tbEmpleados_acce_tbUsuarios_UserCreate					FOREIGN KEY(empe_UsuCreacion)				REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbEmpleados_acce_tbUsuarios_UserUpdate					FOREIGN KEY(empe_UsuModificacion)			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbEmpleados_opti_tbSucursales_sucu_Id					FOREIGN KEY(sucu_Id)						REFERENCES opti.tbSucursales(sucu_Id)		
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
	--muni_Id						CHAR(4) NOT NULL,
	--clie_DireccionExacta		NVARCHAR(500) NOT NULL,
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
	CONSTRAINT FK_opti_tbClientes_acce_tbUsuarios_clie_UsuCreacion_user_Id  	FOREIGN KEY(clie_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbClientes_acce_tbUsuarios_clie_UsuModificacion_user_Id  FOREIGN KEY(clie_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id),
	--CONSTRAINT FK_opti_tbClientes_gral_tbMunicipios_muni_Id						FOREIGN KEY(muni_Id)				REFERENCES gral.tbMunicipios(muni_Id)			
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
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuCreacion_user_Id  		FOREIGN KEY(aros_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbAros_acce_tbUsuarios_clie_UsuModificacion_user_Id  	FOREIGN KEY(aros_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
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
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbMarcas 
ADD CONSTRAINT FK_opti_tbMarcas_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
ADD CONSTRAINT FK_opti_tbConsultorios_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbConsultorios 
ADD CONSTRAINT FK_opti_tbConsultorios_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
ADD CONSTRAINT FK_opti_tbCitas_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbCitas 
ADD CONSTRAINT FK_opti_tbCitas_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
ADD CONSTRAINT FK_opti_tbDetallesCitas_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesCitas 
ADD CONSTRAINT FK_opti_tbDetallesCitas_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO
--************************************************/TABLE Detalles Citas***************************************************--

--*******************************************************TABLE Cargos******************************************************--

CREATE TABLE opti.tbCargos
(
	carg_Id					INT IDENTITY(1,1),
	carg_Nombre				NVARCHAR(150) NOT NULL,

	carg_Estado				BIT DEFAULT 1,
	usua_IdCreacion			INT NOT NULL,
	carg_FechaCreacion		DATETIME DEFAULT GETDATE(),
	usua_IdModificacion		INT DEFAULT NULL,
	carg_FechaModificacion  DATETIME DEFAULT NULL,
	CONSTRAINT PK_opti_tbCargos_carg_Id PRIMARY KEY (carg_Id)
);
GO

ALTER TABLE opti.tbCargos 
ADD CONSTRAINT FK_opti_tbCargos_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbCargos 
ADD CONSTRAINT FK_opti_tbCargos_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

--******************************************************/TABLE Cargos******************************************************--

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
ADD CONSTRAINT FK_opti_tbOrdenes_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbOrdenes 
ADD CONSTRAINT FK_opti_tbOrdenes_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
ADD CONSTRAINT FK_opti_tbDetallesOrdenes_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesOrdenes 
ADD CONSTRAINT FK_opti_tbDetallesOrdenes_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

--**************************************************TABLE DetallesOrdenes**************************************************--

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
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbEnvios 
ADD CONSTRAINT FK_opti_tbEnvios_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
	CONSTRAINT FK_opti_tbFacturas_acce_tbUsuarios_fact_UsuCreacion_user_Id  		FOREIGN KEY(fact_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbFacturas_acce_tbUsuarios_fact_UsuModificacion_user_Id  	FOREIGN KEY(fact_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
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
	CONSTRAINT FK_opti_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuCreacion_user_Id  		FOREIGN KEY(factdeta_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_opti_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuModificacion_user_Id  	FOREIGN KEY(factdeta_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
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
ADD CONSTRAINT FK_opti_tbDetallesEnvios_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDetallesEnvios 
ADD CONSTRAINT FK_opti_tbDetallesEnvios_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

--**************************************************/TABLE DetallesEnvios**************************************************--

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
ADD CONSTRAINT FK_opti_tbDirecciones_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDirecciones 
ADD CONSTRAINT FK_opti_tbDirecciones_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
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
ADD CONSTRAINT FK_opti_tbDireccionesPorCliente_usua_IdCreacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

ALTER TABLE opti.tbDireccionesPorCliente 
ADD CONSTRAINT FK_opti_tbDireccionesPorCliente_usua_IdModificacion_acce_tbUsuarios_usua_Id REFERENCES acce.tbUsuarios (usua_Id)
GO

--***********************************************TABLE DireccionesPorCliente***********************************************--

--*****PROCEDIMIENTOS ALMACENADOS*****--

---------- USUARIOS -----------

--Iniciar sesion
GO
CREATE OR ALTER PROCEDURE UDP_Login 
	@user_Nombre NVARCHAR(100), 
	@user_Contrasena NVARCHAR(200)
AS
BEGIN

	DECLARE @contraEncriptada NVARCHAR(MAX) = HASHBYTES('SHA2_512', @user_Contrasena);

	SELECT [user_Id], [user_NombreUsuario], [role_Id], user_EsAdmin, role_Id, empe_NombreCompleto
	FROM acce.VW_tbUsuarios
	WHERE [user_Contrasena] = @contraEncriptada
	AND [user_NombreUsuario] = @user_Nombre
	AND [user_Estado] = 1
END

/*UDP para vista de usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_VW_tbUsuarios
	@user_Id INT
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios WHERE user_Id = @user_Id
END

/*Vista usuarios*/
GO
CREATE OR ALTER VIEW acce.VW_tbUsuarios
AS
	SELECT t1.user_Id, 
		   t1.user_NombreUsuario, 
		   t1.user_Contrasena, 
		   t1.user_EsAdmin, 
		   t1.role_Id,
		   t2.role_Nombre, 
		   t1.empe_Id,
		   (SELECT t3.empe_Nombres + ' '+ empe_Apellidos) AS empe_NombreCompleto, 
		   t1.user_UsuCreacion, 
		   t4.user_NombreUsuario AS user_UsuCreacion_Nombre,
		   t1.user_FechaCreacion, 
	       t1.user_UsuModificacion,
		   t5.user_NombreUsuario AS user_UsuModificacion_Nombre, 
		   t1.user_FechaModificacion,
		   t1.user_Estado,
		   sucu_Id 
		   FROM acce.tbUsuarios t1 INNER JOIN acce.tbRoles t2
		   ON t1.role_Id = t2.role_Id
		   INNER JOIN opti.tbEmpleados t3
		   ON t3.empe_Id = t1.empe_Id 
		   INNER JOIN acce.tbUsuarios t4
		   ON t1.user_UsuCreacion = T4.user_Id
		   LEFT JOIN acce.tbUsuarios t5
		   ON t1.user_UsuModificacion = t5.user_Id

/*Insertar Usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_Insert
	@user_NombreUsuario NVARCHAR(150),
	@user_Contrasena NVARCHAR(MAX),
	@user_EsAdmin BIT,
	@role_Id INT, 
	@empe_Id INT,
	@user_usuCreacion INT
AS 
BEGIN
	
	BEGIN TRY
		
		DECLARE @password NVARCHAR(MAX)=(SELECT HASHBYTES('Sha2_512', @user_Contrasena));

		IF NOT EXISTS (SELECT * FROM acce.tbUsuarios
						WHERE @user_NombreUsuario = user_NombreUsuario)
		BEGIN
			INSERT INTO acce.tbUsuarios
			VALUES(@user_NombreUsuario,@password,@user_EsAdmin,@role_Id,@empe_Id,@user_usuCreacion,GETDATE(),NULL,NULL,1)

			SELECT 'El usuario se ha insertado'
		END
		ELSE IF EXISTS (SELECT * FROM acce.tbUsuarios
						WHERE @user_NombreUsuario = user_NombreUsuario
							  AND user_Estado = 1)

			SELECT 'Este usuario ya existe'
		ELSE
			BEGIN
				UPDATE acce.tbUsuarios
				SET user_Estado = 1,
					user_Contrasena = @password,
					user_EsAdmin = @user_EsAdmin,
					role_Id = @role_Id,
					empe_Id = @empe_Id
				WHERE user_NombreUsuario = @user_NombreUsuario

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
	@user_Id					INT,
	@user_EsAdmin				BIT,
	@role_Id					INT,
	@empe_Id					INT,
	@user_UsuModificacion		INT
AS
BEGIN
	BEGIN TRY
		UPDATE acce.tbUsuarios
		SET user_EsAdmin = @user_EsAdmin,
			role_Id = @role_Id,
			empe_Id = @empe_Id,
			user_UsuModificacion = @user_UsuModificacion,
			user_FechaModificacion = GETDATE()
		WHERE user_Id = @user_Id

		SELECT 'El usuario ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END

/*Eliminar usuarios*/
GO
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_DELETE
	@user_Id	INT
AS
BEGIN
	BEGIN TRY
		UPDATE acce.tbUsuarios
		SET user_Estado = 0
		WHERE user_Id = @user_Id

		SELECT 'El usuario ha sido eliminado'
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

	  
--********INSERT TABLA Categorias****************---
GO
INSERT INTO opti.tbCategorias(cate_Nombre, cate_UsuCreacion)
VALUES('Aros de metal',1),
      ('Aros de acetato',1),
	  ('Aros semirr�gidos',1),
	  ('Aros de titanio',1),
	  ('Aros de titanio',1),
	  ('Aros deportivos',1),
	  ('Aros de dise�o',1)


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
--********INSERT TABLA Estados Civiles****************---
INSERT INTO opti.tbProveedores(prov_Nombre,prov_Direccion,prov_CorreoElectronico,prov_Telefono,prov_UsuCreacion)
VALUES('Optica Universal','2 Calle 6 Avenida N.O. B�, Guamilito, 6 Avenida','Optica_Universal@hotmail.com','2550-1550',1),
      ('Optica Optimas','Barrio Medina 3ra ave, entre 10 y 11 Calle','Optica.Optimas@hotmail.com','9928-0486',1)