--------------------------------------------------------------------------------
-- NOSSACASA.SP_EXCLUIR_LISTAS_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE NOSSACASA.SP_EXCLUIR_LISTAS_SORTEIO
	@ID INT
AS
BEGIN
	DELETE FROM NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO
	WHERE ID_LISTA_SORTEIO IN (SELECT ID_LISTA_SORTEIO FROM NOSSACASA.LISTA_SORTEIO WHERE ID_SORTEIO = @ID)
	
	DELETE FROM NOSSACASA.CANDIDATO_SORTEIO WHERE ID_SORTEIO = @ID;

	DELETE FROM NOSSACASA.LISTA_SORTEIO WHERE ID_SORTEIO = @ID;
END
GO

--------------------------------------------------------------------------------
-- NOSSACASA.SP_CRIAR_LISTAS_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE NOSSACASA.SP_CRIAR_LISTAS_SORTEIO
	@ID_SORTEIO INT
AS
BEGIN
	--------------------------------------------------------------------------------
	-- Atualização da Quantidade de Critérios
	--------------------------------------------------------------------------------
	UPDATE NOSSACASA.CANDIDATO_SORTEIO
	SET QUANTIDADE_CRITERIOS = (
		CAST(CRIT_SEXO AS INT) + 
		CAST(CRIT_ALUGUEL AS INT) + 
		CAST(CRIT_TEMPO AS INT) + 
		CAST(CRIT_DEFICIENTE AS INT) + 
		CAST(CRIT_DOENCA AS INT) + 
		CAST(CRIT_RISCO AS INT)
	)
	WHERE ID_SORTEIO = @ID_SORTEIO

	--------------------------------------------------------------------------------
	-- Lista de Deficientes
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Deficientes', 1, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
		DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		CRIT_DEFICIENTE = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista de Idosos
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Idosos', 2, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
		DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		CRIT_DEFICIENTE = 0 AND IDOSO = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista Indicados
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Indicados', 3, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
		DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		AUXILIO_MORADIA = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista Geral I
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Geral I', 4, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(
			ORDER BY (
				CASE
					WHEN QUANTIDADE_CRITERIOS = 5 THEN 6
					WHEN QUANTIDADE_CRITERIOS = 3 THEN 4
					WHEN QUANTIDADE_CRITERIOS = 1 THEN 2
					WHEN QUANTIDADE_CRITERIOS = 0 THEN 2
					ELSE QUANTIDADE_CRITERIOS
				END
			) DESC, NOME ASC, CPF DESC
		),
		DENSE_RANK() OVER(
			ORDER BY (
				CASE
					WHEN QUANTIDADE_CRITERIOS = 5 THEN 6
					WHEN QUANTIDADE_CRITERIOS = 3 THEN 4
					WHEN QUANTIDADE_CRITERIOS = 1 THEN 2
					WHEN QUANTIDADE_CRITERIOS = 0 THEN 2
					ELSE QUANTIDADE_CRITERIOS
				END
			) DESC
		)
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista Geral II
	--------------------------------------------------------------------------------
	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Geral II', 5, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
		1
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		QUANTIDADE_CRITERIOS < 5
		AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista de Deficientes (Reserva)
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Deficientes (Reserva)', 6, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
		1
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		CRIT_DEFICIENTE = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista de Idosos (Reserva)
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Idosos (Reserva)', 7, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
		1
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		CRIT_DEFICIENTE = 0 AND IDOSO = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista Indicados (Reserva)
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Indicados (Reserva)', 8, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
		1
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		AUXILIO_MORADIA = 1 AND ID_SORTEIO = @ID_SORTEIO;

	--------------------------------------------------------------------------------
	-- Lista Geral (Reserva)
	--------------------------------------------------------------------------------

	INSERT INTO NOSSACASA.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
	VALUES(@ID_SORTEIO, 'Geral (Reserva)', 9, 1, 0);

	INSERT INTO NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
	SELECT
		@@IDENTITY,
		ID_CANDIDATO_SORTEIO,
		ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
		1
	FROM
		NOSSACASA.CANDIDATO_SORTEIO
	WHERE
		ID_SORTEIO = @ID_SORTEIO;
END
GO

--------------------------------------------------------------------------------
-- NOSSACASA.SP_CONTEMPLAR_CANDIDATO_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE [NOSSACASA].[SP_CONTEMPLAR_CANDIDATO_SORTEIO]
	@ID_LISTA_SORTEIO INT,
	@CLASSIFICACAO INT,
	@INDICE INT,
	@SEQUENCIA_CONTEMPLACAO INT,
	@DATA_CONTEMPLACAO DATETIME
AS
BEGIN
	-- ENCONTRA O CANDIDATO CONTEMPLADO

	DECLARE @ID_CANDIDATO_SORTEIO INT

	SELECT @ID_CANDIDATO_SORTEIO = ID_CANDIDATO FROM
		(SELECT
			ROW_NUMBER() OVER(ORDER BY CSLS.SEQUENCIA) AS ROW,
			CS.ID_CANDIDATO_SORTEIO AS ID_CANDIDATO
		FROM
			NOSSACASA.CANDIDATO_SORTEIO CS
			INNER JOIN NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO CSLS ON CS.ID_CANDIDATO_SORTEIO = CSLS.ID_CANDIDATO_SORTEIO
		WHERE
			CSLS.ID_LISTA_SORTEIO = @ID_LISTA_SORTEIO
			AND CSLS.CLASSIFICACAO = @CLASSIFICACAO
			AND CS.CONTEMPLADO = 0) C
	WHERE C.ROW = @INDICE

	-- ATUALIZA O CANDIDATO

	UPDATE NOSSACASA.CANDIDATO_SORTEIO
	SET CONTEMPLADO = 1
	WHERE ID_CANDIDATO_SORTEIO = @ID_CANDIDATO_SORTEIO

	-- ATUALIZA O CANDIDATO NA LISTA

	UPDATE
		NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO
	SET
		SEQUENCIA_CONTEMPLACAO = @SEQUENCIA_CONTEMPLACAO,
		DATA_CONTEMPLACAO = @DATA_CONTEMPLACAO
	WHERE
		ID_CANDIDATO_SORTEIO = @ID_CANDIDATO_SORTEIO
		AND ID_LISTA_SORTEIO = @ID_LISTA_SORTEIO
END
GO
