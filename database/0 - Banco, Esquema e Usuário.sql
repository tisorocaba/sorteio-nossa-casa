CREATE DATABASE NOSSACASA
GO

USE NOSSACASA
GO

CREATE SCHEMA NOSSACASASORTEIO AUTHORIZATION dbo
GO

CREATE LOGIN NOSSACASA WITH PASSWORD = 'A12345678a'
GO

CREATE USER NOSSACASA FOR LOGIN NOSSACASA
GO 

GRANT SELECT ON SCHEMA :: NOSSACASASORTEIO TO NOSSACASA
GRANT INSERT ON SCHEMA :: NOSSACASASORTEIO TO NOSSACASA
GRANT UPDATE ON SCHEMA :: NOSSACASASORTEIO TO NOSSACASA
GRANT DELETE ON SCHEMA :: NOSSACASASORTEIO TO NOSSACASA
GRANT EXECUTE ON SCHEMA :: NOSSACASASORTEIO TO NOSSACASA
GO
