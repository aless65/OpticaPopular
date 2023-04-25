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
       ('Departamentos', '/Departamento/Listado', 'General', 'departamentosItem', 1),
	   ('Municipios', '/Municipio/Listado', 'General', 'municipiosItem', 1),
	   ('Estados Civiles', '/EstadoCivil/Listado', 'General', 'estadosItem', 1),
	   ('Categorías', '/Categorias/Listado', 'Maquillaje', 'categoriasItem', 1),
	   ('Clientes', '/Clientes/Listado', 'Maquillaje', 'clientesItem', 1),
	   ('Empleados', '/Empleados/Listado','Maquillaje', 'empleadosItem', 1),
	   ('Facturas', '/Facturas/Listado', 'Maquillaje', 'facturasItem', 1),
	   ('Métodos de Pago', '/MetodosPago/Listado', 'Maquillaje', 'metodosItem', 1),
	   ('Productos', '/Producto/Listado', 'Maquillaje', 'productosItem', 1),
	   ('Proveedores', '/Proveedor/Listado', 'Maquillaje', 'proveedoresItem', 1),
	   ('Sucursales', '/Sucursal/Listado', 'Maquillaje', 'sucursalesItem', 1)


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
	CONSTRAINT FK_gral_tbMunicipios_gral_tbDepartamentos_depa_Id 						FOREIGN KEY (depa_Id) 						REFERENCES gral.tbDepartamentos(depa_Id),
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

	CONSTRAINT PK_maqu_tbCategorias_cate_Id 										    PRIMARY KEY(cate_Id),
	CONSTRAINT FK_maqu_tbCategorias_acce_tbUsuarios_cate_UsuCreacion_user_Id  			FOREIGN KEY(cate_UsuCreacion) 			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbCategorias_acce_tbUsuarios_cate_UsuModificacion_user_Id  		FOREIGN KEY(cate_UsuModificacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT UQ_maqu_tbCategorias_cate_Nombre UNIQUE(cate_Nombre)
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

	CONSTRAINT PK_maqu_tbMetodosPago_meto_Id 												PRIMARY KEY(meto_Id),
	CONSTRAINT FK_maqu_tbMetodosPago_acce_tbUsuarios_meto_UsuCreacion_user_Id  				FOREIGN KEY(meto_UsuCreacion) 			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbMetodosPago_acce_tbUsuarios_meto_UsuModificacion_user_Id  			FOREIGN KEY(meto_UsuModificacion) 		REFERENCES acce.tbUsuarios(user_Id)
);

CREATE TABLE gral.tbEstadosCiviles
(
	estacivi_Id					INT IDENTITY,
	estacivi_Nombre				NVARCHAR(50),
	estacivi_UsuCreacion			INT NOT NULL,
	estacivi_FechaCreacion		DATETIME NOT NULL CONSTRAINT DF_estacivi_FechaCreacion DEFAULT(GETDATE()),
	estacivi_UsuModificacion		INT,
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

	CONSTRAINT PK_maqu_tbProveedores_prov_Id											PRIMARY KEY(prov_Id),
	CONSTRAINT FK_maqu_tbProveedores_acce_tbUsuarios_prov_UsuCreacion_user_Id  			FOREIGN KEY(prov_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT  FK_maqu_tbProveedores_acce_tbUsuarios_prov_UsuModificacion_user_Id 		FOREIGN KEY(prov_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
);

--***************TABLA SucursalES*************************--
GO
CREATE TABLE opti.tbSucursales(
    sucu_Id                             INT IDENTITY(1,1), 
    sucu_Descripcion                    NVARCHAR(200) NOT NULL,
    muni_Id                             CHAR(4),
	sucu_DireccionExacta				NVARCHAR(500) NOT NULL,
    sucu_FechaCreacion					DATETIME NOT NULL DEFAULT GETDATE(),
    sucu_UsuCreacion					INT not null,
    sucu_FechaModificacion				DATETIME,
    sucu_UsuModificacion				INT,
    sucu_Estado							BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_maqu_tbSucursales_sucu_Id PRIMARY KEY(sucu_Id),
	CONSTRAINT FK_maqu_gral_tbSucursales_muni_Id FOREIGN KEY (muni_Id) REFERENCES gral.tbMunicipios (muni_Id),
	CONSTRAINT FK_maqu_acce_tbSucursales_user_Id FOREIGN KEY (sucu_UsuCreacion) REFERENCES acce.tbUsuarios (user_id)
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
	muni_Id						CHAR(4)			NOT NULL,
	empe_Direccion				NVARCHAR(250)	NOT NULL,
	empe_Telefono				NVARCHAR(15)	NOT NULL,
	empe_CorreoElectronico		NVARCHAR(200)	NOT NULL,
	sucu_Id						INT				NOT NULL,
	empe_UsuCreacion			INT				NOT NULL,
	empe_FechaCreacion			DATETIME		NOT NULL CONSTRAINT DF_empe_FechaCreacion DEFAULT(GETDATE()),
	empe_UsuModificacion		INT,
	empe_FechaModificacion		DATETIME,
	empe_Estado					BIT NOT NULL CONSTRAINT DF_empe_Estado DEFAULT(1),
	
	CONSTRAINT PK_maqu_tbEmpleados_empe_Id 										PRIMARY KEY(empe_Id),
	CONSTRAINT CK_maqu_tbEmpleados_empe_Sexo									CHECK(empe_sexo IN ('F', 'M')),
	CONSTRAINT FK_maqu_tbEmpleados_gral_tbEstadosCiviles_estacivi_Id			FOREIGN KEY(estacivi_Id)					REFERENCES gral.tbEstadosCiviles(estacivi_Id),			
	CONSTRAINT FK_maqu_tbEmpleados_gral_tbMunicipios_muni_Id					FOREIGN KEY(muni_Id)						REFERENCES gral.tbMunicipios(muni_Id),
	CONSTRAINT FK_maqu_tbEmpleados_acce_tbUsuarios_UserCreate					FOREIGN KEY(empe_UsuCreacion)				REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbEmpleados_acce_tbUsuarios_UserUpdate					FOREIGN KEY(empe_UsuModificacion)			REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbEmpleados_maqu_tbSucursales_sucu_Id					FOREIGN KEY(sucu_Id)						REFERENCES maqu.tbSucursales(sucu_Id)		
);

--********TABLA Clientes****************---
CREATE TABLE opti.tbClientes
(
	clie_Id						INT IDENTITY,
	clie_Nombres					NVARCHAR(300) NOT NULL,
	clie_Apellidos				NVARCHAR(300) NOT NULL,
	clie_Identidad				VARCHAR(13)	  NOT NULL,
	clie_Sexo					CHAR NOT NULL,
	muni_Id						CHAR(4) NOT NULL,
	clie_DireccionExacta			NVARCHAR(500) NOT NULL,
	clie_Telefono				NVARCHAR(15) NOT NULL,
	clie_CorreoElectronico		NVARCHAR(150) NOT NULL,
    clie_UsuCreacion				INT				NOT NULL,
	clie_FechaCreacion			DATETIME		NOT NULL CONSTRAINT DF_clie_FechaCreacion DEFAULT(GETDATE()),
	clie_UsuModificacion			INT,
	clie_FechaModificacion		DATETIME,
	clie_Estado					BIT NOT NULL CONSTRAINT DF_clie_Estado DEFAULT(1),

	CONSTRAINT PK_maqu_tbClientes_clie_Id 								PRIMARY KEY(clie_Id),
	CONSTRAINT CK_maqu_tbClientes_empe_Sexo 							CHECK(clie_sexo IN ('F', 'M')),
	CONSTRAINT FK_maqu_tbClientes_acce_tbUsuarios_clie_UsuCreacion_user_Id  	FOREIGN KEY(clie_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbClientes_acce_tbUsuarios_clie_UsuModificacion_user_Id  FOREIGN KEY(clie_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbClientes_gral_tbMunicipios_muni_Id						FOREIGN KEY(muni_Id)				REFERENCES gral.tbMunicipios(muni_Id)			
);

--********TABLA Productos****************---
CREATE TABLE opti.tbProductos
(
	prod_Id								INT IDENTITY,
	prod_Nombre							NVARCHAR(200)NOT NULL,
	prod_PrecioUni						DECIMAL(18,2) NOT NULL,
	cate_Id								INT NOT NULL,
	prov_Id								INT NOT NULL,
	prod_Stock							INT NOT NULL,
	prod_UsuCreacion					INT NOT NULL,
	prod_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_prod_FechaCreacion DEFAULT(GETDATE()),
	prod_FechaModificacion				DATETIME,
	prod_UsuModificacion				INT,
	prod_Estado							BIT NOT NULL CONSTRAINT DF_prod_Estado DEFAULT(1),

	CONSTRAINT PK_maqu_tbProductos_prod_Id 										PRIMARY KEY(prod_Id),
	CONSTRAINT FK_maqu_tbProductos_maqu_tbProveedores_prov_Id 						FOREIGN KEY(prov_Id) 				REFERENCES maqu.tbProveedores(prov_Id),
	CONSTRAINT FK_maqu_tbProductos_maqu_tbCategorias_cate_Id 							FOREIGN KEY(cate_Id) 				REFERENCES maqu.tbCategorias(cate_Id),
	CONSTRAINT FK_maqu_tbProductos_acce_tbUsuarios_clie_UsuCreacion_user_Id  		FOREIGN KEY(prod_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbProductos_acce_tbUsuarios_clie_UsuModificacion_user_Id  	FOREIGN KEY(prod_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
);


--********TABLA Factura****************---
CREATE TABLE opti.tbFacturas
(
	fact_Id								INT IDENTITY,
	clie_Id								INT NOT NULL,
	fact_Fecha							DATETIME NOT NULL,
	meto_Id								INT NOT NULL,
	empe_Id								INT NOT NULL,
	fact_UsuCreacion						INT NOT NULL,
	fact_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_fact_FechaCreacion DEFAULT(GETDATE()),
	fact_FechaModificacion				DATETIME,
	fact_UsuModificacion					INT,
	fact_Estado							BIT NOT NULL CONSTRAINT DF_fact_Estado DEFAULT(1),

	CONSTRAINT PK_maqu_tbFacturas_fact_Id 											PRIMARY KEY(fact_Id),
	CONSTRAINT FK_maqu_tbFacturas_maqu_tbClientes_clie_Id 							FOREIGN KEY(clie_Id) 				REFERENCES maqu.tbClientes(clie_Id),
	CONSTRAINT FK_maqu_tbFacturas_maqu_tbMetodosPago_meto_Id 						FOREIGN KEY(meto_Id) 				REFERENCES maqu.tbMetodosPago(meto_Id),
	CONSTRAINT FK_maqu_tbFacturas_maqu_tbEmpleados_empe_Id							FOREIGN KEY(empe_Id)				REFERENCES maqu.tbEmpleados(empe_Id),
	CONSTRAINT FK_maqu_tbFacturas_acce_tbUsuarios_fact_UsuCreacion_user_Id  		FOREIGN KEY(fact_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbFacturas_acce_tbUsuarios_fact_UsuModificacion_user_Id  	FOREIGN KEY(fact_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
)

--********TABLA Factura Detalles****************---
CREATE TABLE opti.tbFacturasDetalles
(
	factdeta_Id								INT IDENTITY,
	fact_Id									INT NOT NULL,
	prod_Id									INT NOT NULL,
	factdeta_Cantidad						INT NOT NULL,
	factdeta_Precio							DECIMAL(18,2) NOT NULL,
	factdeta_UsuCreacion					INT NOT NULL,
	factdeta_FechaCreacion					DATETIME NOT NULL CONSTRAINT DF_factdeta_FechaCreacion DEFAULT(GETDATE()),
	factdeta_FechaModificacion				DATETIME,
	factdeta_UsuModificacion				INT,
	factdeta_Estado							BIT NOT NULL CONSTRAINT DF_factdeta_Estado DEFAULT(1),

	CONSTRAINT PK_maqu_tbFacturasDetalles_factdeta_Id 											PRIMARY KEY(factdeta_Id),
	CONSTRAINT FK_maqu_tbFacturasDetalles_maqu_tbFacturas_fact_Id 									FOREIGN KEY(fact_Id) 					REFERENCES maqu.tbFacturas(fact_Id),
	CONSTRAINT FK_maqu_tbFacturasDetalles_maqu_tbProductos_prod_Id								FOREIGN KEY(prod_Id)					REFERENCES maqu.tbProductos(prod_Id),
	CONSTRAINT FK_maqu_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuCreacion_user_Id  		FOREIGN KEY(factdeta_UsuCreacion) 		REFERENCES acce.tbUsuarios(user_Id),
	CONSTRAINT FK_maqu_tbFacturasDetalles_acce_tbUsuarios_factdeta_UsuModificacion_user_Id  	FOREIGN KEY(factdeta_UsuModificacion) 	REFERENCES acce.tbUsuarios(user_Id)
);

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