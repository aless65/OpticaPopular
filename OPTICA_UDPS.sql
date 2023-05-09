/*
USE MASTER
*/

USE OpticaPopular
GO
--*****PROCEDIMIENTOS ALMACENADOS*****--
---------- USUARIOS -----------
--Iniciar sesion
CREATE OR ALTER PROCEDURE acce.UDP_Login
	@usua_Nombre NVARCHAR(100), 
	@usua_Contrasena NVARCHAR(200)
AS
BEGIN

	DECLARE @contraEncriptada NVARCHAR(MAX) = HASHBYTES('SHA2_512', @usua_Contrasena);

	SELECT [usua_Id], [usua_NombreUsuario], [role_Id], usua_EsAdmin, role_Id, empe_NombreCompleto, tb2.sucu_Id
	FROM acce.VW_tbUsuarios tb1
	INNER JOIN [opti].[tbEmpleados] tb2
	ON tb1.empe_Id = tb2.empe_Id
	WHERE [usua_Contrasena] = @contraEncriptada
	AND [usua_NombreUsuario] = @usua_Nombre
	AND [usua_Estado] = 1
END
GO


/*UDP para vista de usuarios*/
CREATE OR ALTER PROCEDURE acce.UDP_VW_tbUsuarios
	@usua_Id INT
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios WHERE usua_Id = @usua_Id
END
GO

/*Vista usuarios*/
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
GO


/*Insertar Usuarios*/
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
		SELECT 'Ha ocurrido un error'
	END CATCH 
END
GO


/*Listar Usuarios*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbUsuarios_List
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios
	WHERE usua_Estado = 1
END
GO


/*Find Usuarios*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_VW_tbUsuarios_Find 
	@usua_Id	INT
AS
BEGIN
	SELECT * FROM acce.VW_tbUsuarios
	WHERE usua_Estado = 1
	AND usua_Id = @usua_Id
END
GO


/*Editar usuarios*/
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

		SELECT 'El usuario ha sido editado con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar usuarios*/
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
GO


---------- CARGOS -----------
/*UDP para vista de cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_VW_tbCargos 
	@carg_Id INT
AS
BEGIN
	SELECT * FROM opti.VW_tbCargos WHERE carg_Id = @carg_Id
END
GO


/*Vista cargos*/
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
GO


/*Insertar Cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCargos_Insert
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
GO


/*Listar cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCargos_List
AS
BEGIN
	SELECT carg_Id, carg_Nombre 
	FROM opti.VW_tbCargos
	WHERE carg_Estado = 1
END
GO


/*Editar cargos*/
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
GO


/*Eliminar cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCargos_Delete
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
GO


---------- categoríaS -----------
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
GO


/*Vista Categorias UDP*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_VW_tbCategorias
AS
BEGIN
	SELECT * FROM opti.VW_tbCategorias
END
GO


/*Listado de categorias*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCategorias_List
AS
BEGIN
	SELECT [cate_Id], [cate_Nombre] 
	FROM opti.VW_tbCategorias
END
GO


/*Insertar categoria*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCategorias_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCategorias_Update
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
GO


/*Eliminar categoria*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbCategorias_Delete 
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
GO


---------- CLIENTES -----------
/*Vista clientes*/
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
GO


/*List vista clientes*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbClientes_List
AS
BEGIN
	SELECT * FROM opti.VW_tbClientes
	WHERE clie_Estado = 1
END
GO


/*Insertar clientes*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbClientes_Insert
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
GO


/*Editar Cliente*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbClientes_Update
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
GO


/*Eliminar Cliente*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbClientes_Delete
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
GO

---------- Empleados -----------
/*Vista Empleadaos*/
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
		   t1.dire_Id,
		   T6.dire_DireccionExacta,
		   t6.muni_Id,
		   T7.muni_Nombre AS sucu_MunicipioNombre, 
		   T7.depa_Id,
		   T1.carg_Id,
		   T1.sucu_Id,
		   T5.sucu_Descripcion AS Empe_SucursalNombre,
		   empe_UsuCreacion, 
		   T2.usua_NombreUsuario AS Empe_NombreUsuarioCreacion,
		   empe_FechaCreacion, 
		   empe_UsuModificacion, 
		   T3.usua_NombreUsuario AS Empe_NombreUsuarioModificacion,
		   empe_FechaModificacion, 
		   empe_Estado
	FROM [opti].[tbEmpleados] T1  INNER JOIN acce.tbUsuarios T2
	ON T1.empe_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.empe_UsuModificacion = T3.usua_Id INNER JOIN gral.tbEstadosCiviles T4
	ON T1.estacivi_Id = T4.estacivi_Id INNER JOIN opti.tbSucursales T5
	ON T1.sucu_Id = T5.sucu_Id INNER JOIN opti.tbDirecciones T6
	ON T1.dire_Id = T6.dire_Id INNER JOIN gral.tbMunicipios T7
	ON T6.muni_Id = T7.muni_id 
GO


/*List vista Empleados*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEmpleados_List
AS
BEGIN
	SELECT * FROM opti.VW_tbEmpleados
	WHERE empe_Estado = 1
END	
GO

/*Find empleados*/
GO
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEmpleados_Find 
	@empe_Id	INT
AS
BEGIN
	SELECT * FROM opti.VW_tbEmpleados
	WHERE empe_Id = @empe_Id
END
GO


/*Insertar Empleados*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEmpleados_Insert 
	 @empe_Nombres                 NVARCHAR(100), 
	 @empe_Apellidos               NVARCHAR(100), 
	 @empe_Identidad               VARCHAR(13), 
	 @empe_FechaNacimiento         DATE, 
	 @empe_Sexo                    CHAR(1), 
	 @estacivi_Id                  INT, 
	 @empe_Telefono                NVARCHAR(15), 
	 @empe_CorreoElectronico       NVARCHAR(200),
	 @muni_Id					   VARCHAR(4),
	 @dire_DireccionExacta		   NVARCHAR(350),
	 @carg_Id                      INT,
	 @sucu_Id                      INT, 
	 @empe_UsuCreacion             INT

AS
BEGIN
	BEGIN TRY
		DECLARE @dire_Id INT

		IF NOT EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad)
			BEGIN
				INSERT INTO [opti].[tbDirecciones]([muni_Id], [dire_DireccionExacta], [usua_IdCreacion])
				VALUES(@muni_Id, @dire_DireccionExacta, @empe_UsuCreacion)

				SET @dire_Id = SCOPE_IDENTITY()
				
				INSERT INTO opti.tbEmpleados(empe_Nombres, 
				                             empe_Apellidos, 
											 empe_Identidad, 
											 empe_FechaNacimiento, 
											 empe_Sexo, 
											 estacivi_Id, 
											 empe_Telefono, 
											 empe_CorreoElectronico, 
											 dire_Id,
											 carg_Id,
											 sucu_Id, 
											 empe_UsuCreacion)
				VALUES(@empe_Nombres,@empe_Apellidos,@empe_Identidad, @empe_FechaNacimiento,         
	                   @empe_Sexo, @estacivi_Id, @empe_Telefono, @empe_CorreoElectronico,       
	                   @dire_Id, @carg_Id, @sucu_Id, @empe_UsuCreacion)

				SELECT 'El empleado ha sido ingresado con éxito'

			END
		ELSE IF EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad
						AND empe_Estado = 1)

			SELECT 'Ya existe un empleado con este número de identidad'
		ELSE
			BEGIN

			UPDATE opti.tbDirecciones
				SET muni_Id = @muni_Id,
				    dire_DireccionExacta = @dire_DireccionExacta,
					dire_Estado = 1
				WHERE dire_Id = (SELECT dire_Id FROM opti.tbEmpleados WHERE empe_Identidad = @empe_Identidad)

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

				SELECT 'El empleado ha sido ingresado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar Empleados*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEmpleados_Update 
	 @empe_Id				       INT,
	 @empe_Nombres                 NVARCHAR(100), 
	 @empe_Apellidos               NVARCHAR(100), 
	 @empe_Identidad               VARCHAR(13), 
	 @empe_FechaNacimiento         DATE, 
	 @empe_Sexo                    CHAR(1), 
	 @estacivi_Id                  INT, 
	 @empe_Telefono                NVARCHAR(15), 
	 @empe_CorreoElectronico       NVARCHAR(200),
	 @muni_Id					   VARCHAR(4),
	 @dire_DireccionExacta		   NVARCHAR(350),
	 @carg_Id                      INT,
	 @sucu_Id                      INT,  
	 @empe_UsuModificacion         INT
AS
BEGIN
	BEGIN TRY
	IF NOT EXISTS (SELECT empe_Identidad FROM opti.tbEmpleados
						WHERE empe_Identidad = @empe_Identidad)
		BEGIN	
			UPDATE opti.tbDirecciones
				SET muni_Id = @muni_Id,
				    dire_DireccionExacta = @dire_DireccionExacta,
					usua_IdModificacion = @empe_UsuModificacion
				WHERE dire_Id = (SELECT dire_Id FROM opti.tbEmpleados WHERE empe_Id = @empe_Id)

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

			SELECT 'El empleado ha sido editado con éxito'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbEmpleados
						WHERE @empe_Identidad = empe_Identidad
							  AND empe_Estado = 1
							  AND empe_Id != @empe_Id)

			SELECT 'Ya existe un empleado con este número de identidad'
		ELSE
			BEGIN
				UPDATE opti.tbDirecciones
				SET dire_Estado = 1,
					muni_Id = @muni_Id,
				    dire_DireccionExacta = @dire_DireccionExacta,
					usua_IdModificacion = @empe_UsuModificacion
				WHERE dire_Id = (SELECT dire_Id FROM opti.tbEmpleados WHERE empe_Identidad = @empe_Identidad)

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

				SELECT 'El empleado ha sido editado con éxito'
			END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar Empleados*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEmpleados_Delete 
	@empe_Id INT
AS
BEGIN
	
	BEGIN TRY
			BEGIN
				UPDATE opti.tbDirecciones
				SET dire_Estado = 0
				WHERE dire_Id = (SELECT dire_Id FROM opti.tbEmpleados WHERE empe_Id = @empe_Id)

				UPDATE opti.tbEmpleados 
				SET empe_Estado = 0
				WHERE [empe_Id] = @empe_Id
				
				SELECT 'El empleado ha sido eliminado'
			END
		
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


---------- PROVEEDORES -----------
/*Vista Proveedores*/
CREATE OR ALTER VIEW opti.VW_tbProveedores
AS
	SELECT prov_Id, 
	       prov_Nombre, 
		   T1.dire_Id,
		   dire_DireccionExacta,
		   prov_CorreoElectronico, 
		   prov_Telefono, 
		   prov_UsuCreacion, 
		   T2.usua_NombreUsuario AS prov_NombreUsuCreacion,
		   prov_FechaCreacion, 
		   prov_UsuModificacion, 
		   T3.usua_NombreUsuario AS prov_NombreUsuModificacion,
		   prov_FechaModificacion, 
		   prov_Estado
	FROM opti.tbProveedores T1 INNER JOIN acce.tbUsuarios T2
	ON T1.prov_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3 
	ON T1.prov_UsuModificacion = T3.usua_Id
	INNER JOIN opti.tbDirecciones t4
	ON T1.dire_Id = t4.dire_Id
GO


/*List vista Proveedores*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbProveedore_List
AS
BEGIN
	SELECT * FROM opti.VW_tbProveedores
END	
GO


/*Insertar Proveedor*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbProveedor_Insert
	@prov_Nombre                NVARCHAR(100),
    @prov_Direccion             INT,
    @prov_CorreoElectronico     NVARCHAR(200),
    @prov_Telefono              NVARCHAR(15),
    @prov_UsuCreacion           INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbProveedores 
						WHERE prov_Nombre = @prov_Nombre)
			BEGIN
			INSERT INTO opti.tbProveedores(prov_Nombre,[dire_Id],prov_CorreoElectronico,prov_Telefono,prov_UsuCreacion)
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
GO


/*Editar Proveedor*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbProveedor_Update
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
			        [dire_Id] = @prov_Direccion,
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
GO


/*Eliminar Proveedor*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbProveedor_Delete 
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
GO


---------- AROS -----------
/*Vista Aros*/
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
		   
		   aros_UsuCreacion, 
		   T2.usua_NombreUsuario AS aros_NombreUsuarioCreacion,
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbAros_List
AS
BEGIN
	SELECT * FROM opti.VW_tbAros
END	
GO


/*Insertar Proveedor*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbAros_Insert
	@aros_Descripcion              NVARCHAR(300),
    @aros_CostoUni                 DECIMAL(18,2),
    @cate_Id                       INT,
	@prov_Id                       INT,
    @marc_Id                       INT,
    @aros_UsuCreacion              INT

AS
BEGIN
	BEGIN TRY
		
			BEGIN
			INSERT INTO opti.tbAros(aros_Descripcion, aros_CostoUni, cate_Id, prov_Id, marc_Id, aros_UsuCreacion)
			VALUES(@aros_Descripcion, @aros_CostoUni, @cate_Id, @prov_Id, @marc_Id, @aros_UsuCreacion)
			
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
GO


/*Editar Aro*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbAros_Update
	@aros_Id                 INT,
    @aros_Descripcion        NVARCHAR(300), 
	@aros_CostoUni           DECIMAL(18,2), 
	@cate_Id                 INT, 
	@prov_Id                 INT, 
	@marc_Id                 INT, 
	
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
GO


/*Eliminar Aros*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbAros_Delete 
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
GO


---------- DIRECCIONES -----------
/*Vista Direcciones*/
CREATE OR ALTER VIEW opti.VW_tbDirecciones
AS
	SELECT dire_Id,
	       T1.muni_Id, 
		   T4.muni_Nombre AS muni_NombreMunicipio,
		   dire_DireccionExacta, 
		   [dire_Estado], 
		   usua_IdCreacion, 
		   t2.usua_NombreUsuario AS dire_UsuarioCreacion,
		    [dire_FechaCreacion], 
		   usua_IdModificacion, 
		   T3.usua_NombreUsuario AS dire_UsuarioModificacion,
		   [dire_FechaModificacion]
		   FROM opti.tbDirecciones T1 INNER JOIN acce.tbUsuarios T2
		   ON T1.usua_IdCreacion = T2.usua_Id
		   LEFT JOIN acce.tbUsuarios T3
		   ON T1.usua_IdModificacion = T3.usua_Id INNER JOIN gral.tbMunicipios T4
		   ON T1.muni_Id = T4.muni_Nombre
GO


/*Insertar Direcciones*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDirecciones_Insert
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
						AND [dire_Estado] = 0)
			BEGIN
				UPDATE opti.tbDirecciones 
				SET dire_Estado = 1
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
GO


/*Editar Direccion*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDirecciones_Update
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
					[dire_FechaModificacion]  = GETDATE()
			WHERE 	[dire_Id] = @dire_Id

			SELECT 'La direccion ha sido editado'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbDirecciones
						WHERE @dire_DireccionExacta = [dire_DireccionExacta]
							  AND [dire_Estado]= 1
							  AND [dire_Id] != @dire_Id)

			SELECT 'La direccion ya existe'
		ELSE
			UPDATE opti.tbDirecciones
			SET [dire_Estado] = 1,
			    [usua_IdModificacion] = @usua_IdModificacion,
				 [dire_FechaModificacion] = GETDATE()
			WHERE @dire_DireccionExacta = [dire_DireccionExacta]

			SELECT 'La dirreccion ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar Direccion*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDireccion_Delete
	@dire_Id	INT
AS
BEGIN
	BEGIN TRY
		UPDATE opti.tbDirecciones
		SET [dire_Estado]  = 0
		WHERE dire_Id = @dire_Id

		SELECT 'La direccion ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


---------- Direcciones Por Clientes  -----------
/*Vista direcciones por cliente*/
CREATE OR ALTER VIEW opti.VW_tbDireccionesPorClientes
AS
	SELECT dicl_Id,
	       t1.clie_Id, 
		   T4.clie_Nombres AS dicl_NombreClientes,
		   T1.dire_Id,
		   t5.dire_DireccionExacta AS dicl_DireccionExacta, 
		   t1.dicl_Estado, 
		   T1.usua_IdCreacion, 
		   t2.usua_NombreUsuario AS dicl_NombreUsuarioCreacion,
		   t1.clie_FechaCreacion, 
		   T1.usua_IdModificacion, 
		   t3.usua_NombreUsuario AS dicl_NombreUsuarioModificacion,
		   t1.clie_FechaModificacion
		   FROM opti.tbDireccionesPorCliente t1 INNER JOIN acce.tbUsuarios t2
		   ON t1.usua_IdCreacion = T2.usua_Id
		   LEFT JOIN acce.tbUsuarios t3
		   ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbClientes T4
		   ON T1.clie_Id = T4.clie_Id INNER JOIN opti.tbDirecciones t5
		   ON T1.dire_Id = T5.dire_Id
		   WHERE T1.dicl_Estado = 1
GO


/*Insertar Direcciones por Cliente*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDireccionesPorClientes_Insert
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
						AND dicl_Estado = 0)
			BEGIN
				UPDATE opti.tbDireccionesPorCliente 
				SET dicl_Estado = 1
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
GO


/*Listar cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDireccionPorCliente_List
AS
BEGIN
	SELECT * 
	From opti.VW_tbDireccionesPorClientes
END
GO


/*Editar cargos*/
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

			SELECT 'La direción ha sido editada'
		END
		ELSE IF EXISTS (SELECT * FROM opti.tbDireccionesPorCliente
						WHERE @dire_Id = dire_Id
						      AND @clie_Id = clie_Id
							  AND dicl_Estado = 1
							  AND [dicl_Id] != @dicl_Id)

			SELECT 'La dirección ya existe'
		ELSE
			UPDATE opti.tbDireccionesPorCliente
			SET dicl_Estado = 1,
			    [usua_IdModificacion] = @usua_IdModificacion,
				[clie_FechaModificacion] = GETDATE()
			WHERE clie_Id = @clie_Id AND dire_Id = @dire_Id

			SELECT 'La direccioon ha sido editado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar cargos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDireccionesPorCliente_Delete
	@dicl_Id   INT
AS
BEGIN
	BEGIN TRY
		UPDATE opti.tbDireccionesPorCliente
		SET dicl_Estado = 0
		WHERE dicl_Id = @dicl_Id

		SELECT 'La direccion ha sido eliminado'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


---------- Marcas -----------
CREATE OR ALTER VIEW opti.VW_tbMarcas
AS
	SELECT marc_Id,
	       marc_Nombre,
		   marc_Estado, 
		   usua_IdCreacion,
		   T2.usua_NombreUsuario AS marc_NombreUsuarioCreacion, 
		   marc_FechaCreacion 
		   usua_IdModificacion,
		   t3.usua_NombreUsuario AS marc_NombreUsuarioModificacion, 
		   marc_FechaModificacion
FROM opti.tbMarcas T1 INNER JOIN acce.tbUsuarios T2
ON T1.usua_IdCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.usua_IdModificacion = T3.usua_Id
WHERE t1.marc_Estado = 1
GO


/*Listado de Marca*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMarca_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbMarcas
END
GO


/*Insertar categoria*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMarcas_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMarcas_Update
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
GO


/*Eliminar Marcas*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMarcas_Delete 
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
GO


---------- METODO DE PAGO -----------
CREATE OR ALTER VIEW opti.VW_tbMetodosPagos
AS
	SELECT meto_Id, 
	       meto_Nombre, 
		   meto_UsuCreacion, 
		   T2.usua_NombreUsuario AS meto_NombreUsuarioCreacion,
		   meto_FechaCreacion, 
		   meto_UsuModificacion, 
		   t3.usua_NombreUsuario AS meto_NombreUsuarioModificacion,
		   meto_FechaModificacion, 
		   meto_Estado
FROM opti.tbMetodosPago t1 INNER JOIN acce.tbUsuarios T2
ON T1.meto_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.meto_UsuModificacion = T3.usua_Id
WHERE T1.meto_Estado = 1
GO


/*Listado de metodos de pago*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMetodosPagos_List
AS
BEGIN
	SELECT * 
	FROM opti.VW_tbMetodosPagos
END
GO


/*Insertar Metodos de pagos*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMetodosPagos_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMetodosPagos_Update
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
GO


/*Eliminar metodo de pago*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbMetodosPagos_Delete 
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
GO


---------- Pantallas -----------
CREATE OR ALTER VIEW acce.VW_tbPantallas
AS
	SELECT  pant_Id,
	        pant_Nombre, 
			pant_Url, 
			pant_Menu, 
			pant_HtmlId, 
			pant_UsuCreacion, 
			T2.usua_NombreUsuario AS pant_NombreUsuarioCreacion,
			pant_FechaCreacion, 
			pant_UsuModificacion,
			T3.usua_NombreUsuario AS pant_NombreUsuarioModificacio, 
			pant_FechaModificacion, 
			pant_Estado
FROM [acce].[tbPantallas] t1 INNER JOIN acce.tbUsuarios T2
ON T1.[pant_UsuCreacion] = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.[pant_UsuModificacion] = T3.usua_Id 
WHERE [pant_Estado] = 1
GO


/*Listado de Pantallas*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallas_List
AS
BEGIN
	SELECT * 
	FROM acce.VW_tbPantallas
END
GO


/*Insertar Pantallas*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallas_Insert
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
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallas_Update
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
				[pant_FechaModificacion] = GETDATE()
			WHERE  [pant_Nombre] = @pant_Nombre

			SELECT 'La pantalla ha sido editada con éxito'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar pantalla*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallas_Delete 
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
GO


---------- SUCURSALES -----------
CREATE OR ALTER VIEW opti.VW_tbSucursales
AS
	SELECT  sucu_Id, 
	        sucu_Descripcion, 
			T1.dire_Id,
			t4.muni_Id,
			T5.muni_Nombre AS sucu_MunicipioNombre, 
			T4.dire_DireccionExacta, 
			sucu_FechaCreacion, 
			sucu_UsuCreacion, 
			t2.usua_NombreUsuario AS sucu_NombreUsuarioCreacion,
			sucu_FechaModificacion,
			t3.usua_UsuModificacion AS sucu_NombreUsuarioModifica, 
			sucu_UsuModificacion, 
			sucu_Estado
FROM [opti].[tbSucursales] t1 INNER JOIN acce.tbUsuarios T2
ON T1.sucu_UsuCreacion = T2.usua_Id LEFT JOIN acce.tbUsuarios T3
ON T1.sucu_UsuModificacion = T3.usua_Id INNER JOIN opti.tbDirecciones T4
ON T1.dire_Id = T4.dire_Id INNER JOIN gral.tbMunicipios T5
ON T4.muni_Id = T5.muni_Id
WHERE T1.sucu_Estado = 1
GO


/*Listado de Sucursales*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbSucursales_List
AS
BEGIN
	SELECT * 
	FROM opti.VW_tbSucursales
	WHERE sucu_Estado = 1
END
GO


/*Insertar Sucursales*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbSucursales_Insert
	@sucu_Descripcion     NVARCHAR(200),
	@dire_Id              INT,
    @sucu_UsuCreacion     INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM opti.tbSucursales
						WHERE sucu_Descripcion = @sucu_Descripcion)
			BEGIN
			INSERT INTO opti.tbSucursales(sucu_Descripcion,[dire_Id],sucu_UsuCreacion)
			VALUES(@sucu_Descripcion,@dire_Id,@sucu_UsuCreacion)
			
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbSucursal_Update
	@sucu_Id                 INT,
    @sucu_Descripcion        NVARCHAR(200), 
	@dire_Id                 INT, 
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
					[dire_Id]= @dire_Id,
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
GO


/*Eliminar Sucursal*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbSucursales_Delete 
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
GO


---------- Pantallas Por Roles -----------
CREATE OR ALTER VIEW acce.VW_tbPantallasPorRoles
AS
	SELECT pantrole_Id,
	       T1.role_Id, 
		   T4.role_Nombre AS pantrole_NombreRol,
		   T1.pant_Id,
		   t5.pant_Nombre AS pantrole_NombrePantalla, 
		   T5.pant_Menu AS pantrole_NombreMenu,
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
GO

/*Listado de Pantallas*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallas_List
AS
BEGIN
	SELECT pant_Id, pant_Nombre, pant_Menu
	FROM [acce].[tbPantallas]
	WHERE [pant_Estado] = 1
	GROUP BY pant_Menu, pant_Id, pant_Nombre
END
GO

/*Listado de Pantallas por rol*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallasPorRoles_List 
	@role_Id	INT
AS
BEGIN
	SELECT * 
	FROM acce.VW_tbPantallasPorRoles
	WHERE role_Id = @role_Id
END
GO


/*Insertar pantallas por roles*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallasPorRoles_Insert 
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
			
			SELECT 'Operación realizada con éxito'
			END
		ELSE IF EXISTS (SELECT * FROM acce.tbPantallasPorRoles 
						WHERE pant_Id = @pant_Id AND role_Id = @role_Id
						AND pantrole_Estado = 0)
			BEGIN
				UPDATE [acce].[tbPantallasPorRoles]
				SET [pantrole_Estado] = 1
				WHERE pant_Id = @pant_Id AND role_Id = @role_Id

				SELECT 'Operación realizada con éxito'
			END
		ELSE
			SELECT 'La pantalla x rol ya existe'
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Editar categoria*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallasPorRoles_Update
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
					pantrole_UsuModificacion = @pantrole_UsuModificacion,
					pantrole_FechaModificacion = GETDATE()
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
GO


/*Eliminar pantalla por rol*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbPantallaPorRoles_Delete 
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
GO


---------- Consultorios -----------
CREATE OR ALTER VIEW opti.VW_tbConsultorios
AS
	SELECT  cons_Id, 
	        cons_Nombre, 
			T1.empe_Id, 
			T4.empe_Nombres,
			cons_Estado, 
			usua_IdCreacion, 
			t2.usua_NombreUsuario AS cons_NombreUsuarioCreacion, 
			t4.sucu_Id,
			tb5.sucu_Descripcion,
			cons_FechaCreacion, 
			usua_IdModificacion,
			t3.usua_NombreUsuario AS cons_NombreUsuarioModificacion, 
			cons_FechaModificacion
FROM opti.tbConsultorios t1  INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbEmpleados t4
ON t1.empe_Id = t4.empe_Id 
INNER JOIN opti.tbSucursales tb5
ON t4.sucu_Id = tb5.sucu_Id
GO


/*Listado de Consultorios*/
CREATE OR ALTER PROCEDURE opti.UDP_tbConsultorios_ListPorIdSucursal
	@sucu_Id	INT
AS
BEGIN
	IF @sucu_Id > 0 
	BEGIN
		SELECT *
		FROM opti.VW_tbConsultorios tb1
		WHERE cons_Estado = 1
		AND sucu_Id = @sucu_Id
	END
	ELSE
	BEGIN
		SELECT *
		FROM opti.VW_tbConsultorios tb1
		WHERE cons_Estado = 1
	END
END
GO


/*Insertar CONSULTORIOS*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbConsultorios_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbConsultorios_Update
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
GO


/*Eliminar Consultorio*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbConsultorio_Delete 
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
GO


---------- ROLES -----------
CREATE OR ALTER VIEW acce.VW_tbRoles
AS
	SELECT t1.role_Id,
	       role_Nombre, 
		   role_UsuCreacion,
		   t2.usua_NombreUsuario AS role_NombreUsuarioCreacion, 
		   role_FechaCreacion, 
		   role_UsuModificacion,
		   t3.usua_NombreUsuario AS role_NombreUsuarioModificacion, 
		   role_FechaModificacion, 
		   role_Estado
FROM acce.tbRoles t1  INNER JOIN acce.tbUsuarios t2
ON t1.role_UsuCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.role_UsuModificacion = t3.usua_Id 
WHERE t1.role_Estado = 1
GO


/*Listado de roles*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbRoles_List
AS
BEGIN
	SELECT *
	FROM acce.VW_tbRoles
END
GO


/*Insertar roles*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbRoles_Insert
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
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbRoles_Update
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
GO


/*Eliminar Rol*/
CREATE OR ALTER PROCEDURE acce.UDP_acce_tbRoles_Delete 
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
GO

CREATE OR ALTER PROCEDURE opti.UDP_tbCitas_ListadoPorIdSucursal
	@sucu_Id	INT
AS
BEGIN
	SELECT 	[cita_Id], 
			tb1.[clie_Id],
			tb2.clie_Nombres,
			tb2.clie_Apellidos,
			tb1.[cons_Id],
			tb3.cons_Nombre,
			tb4.empe_Nombres,
			[cita_Fecha]
	FROM [opti].[tbCitas] tb1
	INNER JOIN [opti].[tbClientes] tb2
	ON tb1.clie_Id = tb2.clie_Id
	INNER JOIN [opti].[tbConsultorios] tb3
	ON tb1.cons_Id = tb3.cons_Id
	INNER JOIN [opti].[tbEmpleados] tb4
	ON tb3.empe_Id = tb4.empe_Id
	WHERE tb4.sucu_Id = @sucu_Id
	AND tb1.cita_Estado = 1
END
GO

---------- DETALLE CITAS -----------
CREATE OR ALTER VIEW opti.VW_tbDetallesCitas
AS
	SELECT deci_Id,
	       t1.cita_Id, 
		   deci_Costo, 
		   deci_HoraInicio, 
		   deci_HoraFin, 
		   deci_Estado, 
		   t1.usua_IdCreacion, 
		   t2.usua_NombreUsuario AS deci_NombreUsuarioCreacion,
		   deci_FechaCreacion, 
		   t1.usua_IdModificacion, 
		   t3.usua_NombreUsuario AS deci_NombreUsuarioModificacion,
		   deci_FechaModificacion
FROM opti.tbDetallesCitas t1  INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id 
LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id
GO

/*Listado de detalles citas*/
CREATE OR ALTER PROCEDURE opti.UDP_tbDetallesCitaPorIdCita
	@cita_Id INT
AS
BEGIN
	SELECT *
	FROM opti.VW_tbDetallesCitas tb1
	INNER JOIN opti.tbCitas tb2 
	ON tb1.cita_Id = tb2.cita_Id
	INNER JOIN opti.tbConsultorios tb3
	ON tb2.cons_Id = tb3.cons_Id
	INNER JOIN opti.tbEmpleados tb4
	ON tb3.empe_Id = tb4.empe_Id
	WHERE tb2.cita_Id = @cita_Id
	AND [deci_Estado] = 1
END
GO

/*Insertar roles*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDetallesCitas_Insert
	 @cita_Id            INT, 
	 @deci_Costo         DECIMAL(18,2), 
	 @deci_HoraInicio    VARCHAR(5), 
	 @deci_HoraFin       VARCHAR(5), 
	 @usua_IdCreacion    INT
AS
BEGIN
	BEGIN TRY

			BEGIN
			INSERT INTO [opti].[tbDetallesCitas] (cita_Id, deci_Costo, deci_HoraInicio, deci_HoraFin, usua_IdCreacion)
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDetallesCitas_Update
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
			UPDATE  [opti].[tbDetallesCitas]
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
GO


/*Eliminar Detalle Cita*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbDetallesCitas_Delete 
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
GO


---------- Ordenes -----------
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
GO


/*Listado deOrdenes*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbOrdenes_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbOrdenes
END
GO


/*Insertar Ordenes*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbOrdenes_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbOrdenes_Update
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
GO


/*Eliminar Ordenes*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbOrdenes_Delete 
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
GO


---------- Envios -----------
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
			t1.envi_Estado, 
			t1.usua_IdCreacion,
			T2.usua_NombreUsuario AS envi_NombreUsuarioCreacion, 
			t1.envi_FechaCreacion, 
			t1.usua_IdModificacion,
			t3.usua_NombreUsuario AS envi_NombreUsuarioModificacion, 
			t1.envi_FechaModificacion
FROM opti.tbEnvios t1 INNER JOIN acce.tbUsuarios t2
ON t1.usua_IdCreacion = t2.usua_Id LEFT JOIN acce.tbUsuarios t3
ON t1.usua_IdModificacion = t3.usua_Id INNER JOIN opti.tbClientes T4
ON T1.clie_Id = T4.clie_Id INNER JOIN opti.tbDirecciones t5
ON T1.dire_Id = T5.dire_Id
GO


/*Listado de Envio*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEnvio_List
AS
BEGIN
	SELECT *
	FROM opti.VW_tbEnvio
END
GO


/*Insertar Envio*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEnvios_Insert
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
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEnvios_Update
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
                     [envi_FechaModificacion] = GETDATE()
			WHERE envi_Id = @envi_Id	
			SELECT 'El envio ha sido editado con éxito'
		  END
	END TRY
	BEGIN CATCH
		SELECT 'Ha ocurrido un error'
	END CATCH
END
GO


/*Eliminar Envio*/
CREATE OR ALTER PROCEDURE opti.UDP_opti_tbEnvio_Delete 
	@envi_Id	INT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM [opti].[tbDetallesEnvios] WHERE [envi_Id] = @envi_Id)
			BEGIN
				UPDATE [opti].[tbEnvios]
				SET envi_Estado = 0
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
GO


---------- Estados Civiles -----------

/*Listar estados*/
GO
CREATE OR ALTER PROCEDURE gral.UDP_tbEstadosCiviles_List
AS
BEGIN
	SELECT estacivi_Id, estacivi_Nombre
	FROM [gral].[tbEstadosCiviles]
	WHERE estacivi_Estado = 1
END



---------- Municipios -----------
GO
CREATE OR ALTER PROCEDURE gral.UDP_gral_tbMunicipios_List 
	@depa_Id	INT
AS
BEGIN
	SELECT muni_Id, muni_Nombre
	FROM [gral].tbMunicipios
	WHERE muni_Estado = 1
	AND depa_Id = @depa_Id
END


---------- Departamentos -----------
GO
CREATE OR ALTER PROCEDURE gral.UDP_gral_tbDepartamentos_List
AS
BEGIN
	SELECT depa_Id, depa_Nombre
	FROM [gral].tbDepartamentos
	WHERE depa_Estado = 1
END
