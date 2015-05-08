using Ninject;
using Sorocaba.Commons.Data;
using Sorocaba.Commons.Net.Tasks;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using Sorocaba.NossaCasa.Sorteio.Business.Persistence;
using System;
using System.Data;
using System.Data.SqlClient;

namespace Sorocaba.NossaCasa.Sorteio.Business.Services {
    public class ImportacaoCandidatoService {

        [Inject] public Context Context { get; set; }
        [Inject] public SorteioService SorteioService { get; set; }

        public void ImportarCandidatosSorteio(int idSorteio, IDataReader reader, int rowCount, IProgressTracker tracker) {
            using (var tx = Context.Database.BeginTransaction()) {
                try {
                    SorteioE sorteio = SorteioService.CarregarSorteio(idSorteio);
                    SorteioService.VerificarSorteioRealizado(sorteio);

                    Context.Database.ExecuteSqlCommand("EXEC NOSSACASA_SORTEIO.SP_EXCLUIR_LISTAS_SORTEIO @ID", new SqlParameter("@ID", idSorteio));
                    
                    ImportacaoDataReader wrappedReader = new ImportacaoDataReader(sorteio.Id, 8, reader);
                    var innerTx = (SqlTransaction) tx.UnderlyingTransaction;

                    SqlBulkCopy bulkInsert = new SqlBulkCopy(innerTx.Connection, SqlBulkCopyOptions.Default, innerTx);
                    bulkInsert.DestinationTableName = "NOSSACASA_SORTEIO.CANDIDATO_SORTEIO";
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(0, "CPF"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(1, "NOME"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(2, "QUANTIDADE_CRITERIOS"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(3, "LISTA_GERAL_I"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(4, "LISTA_GERAL_II"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(5, "LISTA_IDOSOS"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(6, "LISTA_DEFICIENTES"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(7, "LISTA_INDICADOS"));
                    bulkInsert.ColumnMappings.Add(new SqlBulkCopyColumnMapping(8, "ID_SORTEIO"));

                    tracker.Total = rowCount * 2 + 1;
                    bulkInsert.NotifyAfter = 100;
                    bulkInsert.SqlRowsCopied += (sender, e) => { tracker.Processed = (int) e.RowsCopied; };
                    bulkInsert.WriteToServer(wrappedReader);
                    tracker.Processed = rowCount;

                    Context.Database.ExecuteSqlCommand("EXEC NOSSACASA_SORTEIO.SP_CRIAR_LISTAS_SORTEIO @ID", new SqlParameter("@ID", idSorteio));
                    tracker.Processed += rowCount;

                    tx.Commit();
                } catch(Exception e) {
                    tx.Rollback();
                    throw e;
                } finally {
                    reader.Close();
                }

                tracker.Processed++;
            }
        }
    }

    class ImportacaoDataReader : DataReaderWrapper {

        private int idSorteio;
        private int index;

        public ImportacaoDataReader(int idSorteio, int index, IDataReader reader) : base(reader) {
            this.idSorteio = idSorteio;
            this.index = index;
        }

        public override Object GetValue(int i) {
            if (i == index) {
                return idSorteio;
            } else {
                return base.GetValue(i);
            }
        }
    }
}
