--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
--------------------------------------------------------------------------------
CREATE TABLE NOSSACASA_SORTEIO.CANDIDATO_SORTEIO
(
	ID_CANDIDATO_SORTEIO int IDENTITY(1,1) NOT NULL,
	ID_SORTEIO int NOT NULL,
	CPF decimal(11, 0) NOT NULL,
	NOME varchar(100) NOT NULL,
	LISTA_DEFICIENTES bit NOT NULL,
	LISTA_IDOSOS bit NOT NULL,
	LISTA_INDICADOS bit NOT NULL,
	LISTA_GERAL_I bit NOT NULL,
	LISTA_GERAL_II bit NOT NULL,
	QUANTIDADE_CRITERIOS int NOT NULL,
	CONTEMPLADO bit NOT NULL,

	CONSTRAINT PK_CANDIDATO_SORTEIO PRIMARY KEY CLUSTERED (ID_CANDIDATO_SORTEIO ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],

	CONSTRAINT IX_CANDIDATO_SORTEIO_CPF UNIQUE NONCLUSTERED (ID_SORTEIO ASC, CPF ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

) ON [PRIMARY]
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO
--------------------------------------------------------------------------------
CREATE TABLE NOSSACASA_SORTEIO.CANDIDATO_SORTEIO_LISTA_SORTEIO
(
	ID_CANDIDATO_SORTEIO int NOT NULL,
	ID_LISTA_SORTEIO int NOT NULL,
	SEQUENCIA int NOT NULL,
	CLASSIFICACAO int NOT NULL,
	SEQUENCIA_CONTEMPLACAO int NULL,
	DATA_CONTEMPLACAO datetime NULL,

 	CONSTRAINT PK_CANDIDATO_SORTEIO_LISTA_SORTEIO PRIMARY KEY CLUSTERED (ID_CANDIDATO_SORTEIO ASC, ID_LISTA_SORTEIO ASC)
 		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],

 	CONSTRAINT IX_CANDIDATO_SORTEIO_LISTA_SORTEIO_SEQUENCIA UNIQUE NONCLUSTERED (ID_LISTA_SORTEIO ASC, SEQUENCIA ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

) ON [PRIMARY]
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.LISTA_SORTEIO
--------------------------------------------------------------------------------
CREATE TABLE NOSSACASA_SORTEIO.LISTA_SORTEIO
(
	ID_LISTA_SORTEIO int IDENTITY(1,1) NOT NULL,
	ID_SORTEIO int NOT NULL,
	NOME varchar(50) NOT NULL,
	QUANTIDADE int NOT NULL,
	ORDEM_SORTEIO int NOT NULL,
	SORTEADA bit NOT NULL,
	SEMENTE_SORTEIO int NULL,

 	CONSTRAINT PK_LISTA_SORTEIO PRIMARY KEY CLUSTERED (ID_LISTA_SORTEIO ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],

 	CONSTRAINT IX_LISTA_SORTEIO_ORDEM UNIQUE NONCLUSTERED (ID_SORTEIO ASC,ORDEM_SORTEIO ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

) ON [PRIMARY]
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.SORTEIO
--------------------------------------------------------------------------------
CREATE TABLE NOSSACASA_SORTEIO.SORTEIO
(
	ID_SORTEIO int IDENTITY(1,1) NOT NULL,
	DATA datetime NOT NULL,
	OBSERVACAO varchar(300) NULL,
	FINALIZADO bit NOT NULL,

	CONSTRAINT PK_SORTEIO PRIMARY KEY CLUSTERED (ID_SORTEIO ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],

	CONSTRAINT IX_SORTEIO_DATA UNIQUE NONCLUSTERED (DATA ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

) ON [PRIMARY]
GO

--------------------------------------------------------------------------------
-- NOSSACASA_SORTEIO.EMPREENDIMENTO
--------------------------------------------------------------------------------
CREATE TABLE NOSSACASA_SORTEIO.EMPREENDIMENTO
(
	ID_EMPREENDIMENTO int IDENTITY(1,1) NOT NULL,
	ID_SORTEIO int NOT NULL,
	ORDEM int NOT NULL,
	NOME varchar(300) NOT NULL,

	CONSTRAINT PK_EMPREENDIMENTO PRIMARY KEY CLUSTERED (ID_EMPREENDIMENTO ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],

) ON [PRIMARY]
GO
