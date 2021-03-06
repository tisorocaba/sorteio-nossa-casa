--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.SP_EXCLUIR_LISTAS_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE NOSSACASA_SORTEIO.SP_EXCLUIR_LISTAS_SORTEIO
	@ID INT
AS
BEGIN
	DELETE FROM NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO
	WHERE ID_LISTA_SORTEIO IN (SELECT ID_LISTA_SORTEIO FROM NOSSACASA_SORTEIO.LISTA_SORTEIO WHERE ID_SORTEIO = @ID)
	
	DELETE FROM NOSSACASA_SORTEIO.CANDIDATO_SORTEIO WHERE ID_SORTEIO = @ID;

	DELETE FROM NOSSACASA_SORTEIO.LISTA_SORTEIO WHERE ID_SORTEIO = @ID;
END
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.SP_CRIAR_LISTAS_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE NOSSACASA_SORTEIO.SP_CRIAR_LISTAS_SORTEIO
	@ID_SORTEIO INT
AS
BEGIN

	DECLARE @EMPREENDIMENTO VARCHAR(300)
	DECLARE @QTD_EMPREENDIMENTOS INT
	DECLARE @INCREMENTO_ORDEM INT

	SET @EMPREENDIMENTO = NULL
	SET @QTD_EMPREENDIMENTOS = (SELECT COUNT(*) FROM NOSSACASA_SORTEIO.EMPREENDIMENTO WHERE ID_SORTEIO = @ID_SORTEIO)
	SET @INCREMENTO_ORDEM = 1

	--------------------------------------------------------------------------------
	-- Listas Gerais
	--------------------------------------------------------------------------------

	DECLARE EMPREENDIMENTO_CURSOR CURSOR FOR
	SELECT NOME FROM NOSSACASA_SORTEIO.EMPREENDIMENTO WHERE ID_SORTEIO = @ID_SORTEIO ORDER BY ORDEM
	OPEN EMPREENDIMENTO_CURSOR

	FETCH NEXT FROM EMPREENDIMENTO_CURSOR INTO @EMPREENDIMENTO
	WHILE @@FETCH_STATUS = 0
	BEGIN

		--------------------------------------------------------------------------------

		--------------------------------------------------------------------------------
		-- Lista de Deficientes
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Deficientes', 0 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
			DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_DEFICIENTES = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista de Idosos
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Idosos', 1 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
			DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_IDOSOS = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista Indicados
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Indicados', 2 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC, NOME ASC, CPF DESC),
			DENSE_RANK() OVER(ORDER BY QUANTIDADE_CRITERIOS DESC)
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_INDICADOS = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista Geral I
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Geral I', 3 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
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
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista Geral II
		--------------------------------------------------------------------------------
		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Geral II', 4 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
			1
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			QUANTIDADE_CRITERIOS < 5 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------

		SET @INCREMENTO_ORDEM = @INCREMENTO_ORDEM + 1

	FETCH NEXT FROM EMPREENDIMENTO_CURSOR INTO @EMPREENDIMENTO
	END
	CLOSE EMPREENDIMENTO_CURSOR
	DEALLOCATE EMPREENDIMENTO_CURSOR

	--------------------------------------------------------------------------------
	-- Listas Reservas
	--------------------------------------------------------------------------------

	DECLARE EMPREENDIMENTO_CURSOR CURSOR FOR
	SELECT NOME FROM NOSSACASA_SORTEIO.EMPREENDIMENTO WHERE ID_SORTEIO = @ID_SORTEIO ORDER BY ORDEM
	OPEN EMPREENDIMENTO_CURSOR

	FETCH NEXT FROM EMPREENDIMENTO_CURSOR INTO @EMPREENDIMENTO
	WHILE @@FETCH_STATUS = 0
	BEGIN

		--------------------------------------------------------------------------------

		--------------------------------------------------------------------------------
		-- Lista de Deficientes (Reserva)
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Deficientes (Reserva)', 5 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
			1
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_DEFICIENTES = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista de Idosos (Reserva)
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Idosos (Reserva)', 6 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
			1
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_IDOSOS = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista Indicados (Reserva)
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Indicados (Reserva)', 7 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
			1
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			LISTA_INDICADOS = 1 AND ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------
		-- Lista Geral (Reserva)
		--------------------------------------------------------------------------------

		INSERT INTO NOSSACASA_SORTEIO.LISTA_SORTEIO(ID_SORTEIO, NOME, ORDEM_SORTEIO, QUANTIDADE, SORTEADA)
		VALUES(@ID_SORTEIO, @EMPREENDIMENTO + ' - Geral (Reserva)', 8 * @QTD_EMPREENDIMENTOS + @INCREMENTO_ORDEM, 1, 0);

		INSERT INTO NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO(ID_LISTA_SORTEIO, ID_CANDIDATO_SORTEIO, SEQUENCIA, CLASSIFICACAO)
		SELECT
			@@IDENTITY,
			ID_CANDIDATO_SORTEIO,
			ROW_NUMBER() OVER(ORDER BY NOME ASC, CPF DESC),
			1
		FROM
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
		WHERE
			ID_SORTEIO = @ID_SORTEIO;

		--------------------------------------------------------------------------------

		SET @INCREMENTO_ORDEM = @INCREMENTO_ORDEM + 1

	FETCH NEXT FROM EMPREENDIMENTO_CURSOR INTO @EMPREENDIMENTO
	END
	CLOSE EMPREENDIMENTO_CURSOR
	DEALLOCATE EMPREENDIMENTO_CURSOR
END
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.SP_CONTEMPLAR_CANDIDATO_SORTEIO
--------------------------------------------------------------------------------
CREATE PROCEDURE [NOSSACASA_SORTEIO].[SP_CONTEMPLAR_CANDIDATO_SORTEIO]
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
			NOSSACASA_SORTEIO.CANDIDATO_SORTEIO CS
			INNER JOIN NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO CSLS ON CS.ID_CANDIDATO_SORTEIO = CSLS.ID_CANDIDATO_SORTEIO
		WHERE
			CSLS.ID_LISTA_SORTEIO = @ID_LISTA_SORTEIO
			AND CSLS.CLASSIFICACAO = @CLASSIFICACAO
			AND CS.CONTEMPLADO = 0) C
	WHERE C.ROW = @INDICE

	-- ATUALIZA O CANDIDATO

	UPDATE NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
	SET CONTEMPLADO = 1
	WHERE ID_CANDIDATO_SORTEIO = @ID_CANDIDATO_SORTEIO

	-- ATUALIZA O CANDIDATO NA LISTA

	UPDATE
		NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO
	SET
		SEQUENCIA_CONTEMPLACAO = @SEQUENCIA_CONTEMPLACAO,
		DATA_CONTEMPLACAO = @DATA_CONTEMPLACAO
	WHERE
		ID_CANDIDATO_SORTEIO = @ID_CANDIDATO_SORTEIO
		AND ID_LISTA_SORTEIO = @ID_LISTA_SORTEIO
END
GO
