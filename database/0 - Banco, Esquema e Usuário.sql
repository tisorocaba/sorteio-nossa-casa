CREATE DATABASE NOSSACASA
GO

USE NOSSACASA
GO

CREATE SCHEMA NOSSACASA_SORTEIO AUTHORIZATION dbo
GO

CREATE LOGIN NOSSACASA WITH PASSWORD = 'A12345678a'
GO

CREATE USER NOSSACASA FOR LOGIN NOSSACASA
GO 

GRANT SELECT ON SCHEMA :: NOSSACASA_SORTEIO TO NOSSACASA
GRANT INSERT ON SCHEMA :: NOSSACASA_SORTEIO TO NOSSACASA
GRANT UPDATE ON SCHEMA :: NOSSACASA_SORTEIO TO NOSSACASA
GRANT DELETE ON SCHEMA :: NOSSACASA_SORTEIO TO NOSSACASA
GRANT EXECUTE ON SCHEMA :: NOSSACASA_SORTEIO TO NOSSACASA
GO
