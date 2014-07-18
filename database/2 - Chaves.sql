--------------------------------------------------------------------------------
-- NOSSACASA.CANDIDATO_SORTEIO
--------------------------------------------------------------------------------
ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO WITH CHECK ADD CONSTRAINT FK_CANDIDATO_SORTEIO_SORTEIO FOREIGN KEY (ID_SORTEIO)
REFERENCES NOSSACASA.SORTEIO (ID_SORTEIO)
GO
ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO CHECK CONSTRAINT FK_CANDIDATO_SORTEIO_SORTEIO
GO

ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO ADD CONSTRAINT DF_CANDIDATO_SORTEIO_CONTEMPLADO DEFAULT (0) FOR CONTEMPLADO
GO

--------------------------------------------------------------------------------
-- NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO
--------------------------------------------------------------------------------
ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO WITH CHECK ADD CONSTRAINT FK_CANDIDATO_SORTEIO_LISTA_SORTEIO_CANDIDATO_SORTEIO FOREIGN KEY (ID_CANDIDATO_SORTEIO)
REFERENCES NOSSACASA.CANDIDATO_SORTEIO (ID_CANDIDATO_SORTEIO)
GO
ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO CHECK CONSTRAINT FK_CANDIDATO_SORTEIO_LISTA_SORTEIO_CANDIDATO_SORTEIO
GO

ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO WITH CHECK ADD CONSTRAINT FK_CANDIDATO_SORTEIO_LISTA_SORTEIO_LISTA_SORTEIO FOREIGN KEY (ID_LISTA_SORTEIO)
REFERENCES NOSSACASA.LISTA_SORTEIO(ID_LISTA_SORTEIO)
GO
ALTER TABLE NOSSACASA.CANDIDATO_SORTEIO_LISTA_SORTEIO CHECK CONSTRAINT FK_CANDIDATO_SORTEIO_LISTA_SORTEIO_LISTA_SORTEIO
GO

--------------------------------------------------------------------------------
-- NOSSACASA.LISTA_SORTEIO
--------------------------------------------------------------------------------
ALTER TABLE NOSSACASA.LISTA_SORTEIO WITH CHECK ADD CONSTRAINT FK_LISTA_SORTEIO_SORTEIO FOREIGN KEY (ID_SORTEIO)
REFERENCES NOSSACASA.SORTEIO (ID_SORTEIO)
GO
ALTER TABLE NOSSACASA.LISTA_SORTEIO CHECK CONSTRAINT FK_LISTA_SORTEIO_SORTEIO
GO