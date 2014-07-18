using Ninject;
using Sorocaba.Commons.Net.Tasks;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using Sorocaba.NossaCasa.Sorteio.Business.Exceptions;
using Sorocaba.NossaCasa.Sorteio.Business.Persistence;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Services {
    public class ListaSorteioService {

        [Inject] public Context Context { get; set; }
        [Inject] public SorteioService SorteioService { get; set; }

        public void SortearProximaLista(int idSorteio, IProgressTracker tracker, string valorSemente = null) {
            using (var tx = Context.Database.BeginTransaction()) {
                try {
                    // Carrega o sorteio.
                    SorteioE sorteio = SorteioService.CarregarSorteio(idSorteio);

                    // Obtém a próxima lista de sorteio disponível.
                    ListaSorteio listaSorteio;
                    listaSorteio = Context.ListaSorteio
                        .Where(ls => ls.IdSorteio == sorteio.Id && !ls.Sorteada)
                        .OrderBy(ls => ls.OrdemSorteio)
                        .FirstOrDefault();

                    if (listaSorteio == null) {
                        throw new SorteioException("Não existem listas disponíveis para sorteio.");
                    }

                    // Atualiza a quantidade total no rastreador de progresso.
                    // Utiliza uma unidade a mais para que os 100% sejam atingidos apenas após o fim da transação.
                    tracker.Total = listaSorteio.Quantidade + 1;

                    // Configura o gerador de números aleatórios.
                    int semente = (valorSemente == null) ? ObterSemente() : Int32.Parse(valorSemente);
                    Random random = new Random(semente);

                    // Prepara a procedure que será utilizada para atualizar os candidatos contemplados.
                    SqlParameter paramIdListaSorteio = new SqlParameter("ID_LISTA_SORTEIO", listaSorteio.Id);
                    SqlParameter paramClassificacao = new SqlParameter("CLASSIFICACAO", SqlDbType.Int);
                    SqlParameter paramIndice = new SqlParameter("INDICE", SqlDbType.Int);
                    SqlParameter paramSequenciaContemplacao = new SqlParameter("SEQUENCIA_CONTEMPLACAO", SqlDbType.Int);
                    SqlParameter paramDataContemplacao = new SqlParameter("DATA_CONTEMPLACAO", SqlDbType.DateTime);

                    var innerTx = (SqlTransaction) tx.UnderlyingTransaction;

                    SqlCommand command = new SqlCommand("NOSSACASA.SP_CONTEMPLAR_CANDIDATO_SORTEIO", innerTx.Connection, innerTx);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(paramIdListaSorteio);
                    command.Parameters.Add(paramClassificacao);
                    command.Parameters.Add(paramIndice);
                    command.Parameters.Add(paramSequenciaContemplacao);
                    command.Parameters.Add(paramDataContemplacao);
                    command.Prepare();

                    Task<int> tarefaProcedure = null;

                    // Referência ao grupo de sorteio que está em andamento.
                    GrupoSorteio grupoSorteio = null;

                    // Realiza o sorteio.
                    for (int i = 1; i <= listaSorteio.Quantidade; i++) {

                        // Obtém o próximo grupo de classificados se o atual for nulo ou houver acabado.
                        if(grupoSorteio == null || grupoSorteio.Quantidade < 1) {

                            // Aguarda a finalização da procedure da iteração anterior.
                            if (tarefaProcedure != null && !tarefaProcedure.IsCompleted) {
                                tarefaProcedure.Wait();
                            }

                            // Obtém os dados do próximo grupo de sorteio.
                            grupoSorteio = Context.CandidatoListaSorteio
                                .Where(cls =>
                                    cls.IdListaSorteio == listaSorteio.Id
                                    && cls.DataContemplacao == null
                                    && !cls.CandidatoSorteio.Contemplado)
                                .GroupBy(cls => cls.Classificacao)
                                .Select(group => new GrupoSorteio { Classificacao = group.Key, Quantidade = group.Count() })
                                .OrderBy(group => group.Classificacao)
                                .FirstOrDefault();
                        }

                        // Se não houver mais candidatos, finaliza o sorteio.
                        if (grupoSorteio == null) {
                            tracker.Processed = listaSorteio.Quantidade;
                            break;
                        }

                        // Se houver mais de um candidato no grupo, seleciona um deles aleatoriamente.
                        int indiceSorteado =
                            (grupoSorteio.Quantidade == 1) ? 1 : random.Next(1, grupoSorteio.Quantidade + 1);

                        // Aguarda a finalização da procedure da iteração anterior.
                        if (tarefaProcedure != null && !tarefaProcedure.IsCompleted) {
                            tarefaProcedure.Wait();
                        }

                        // Executa a contemplação do candidato selecionado.
                        paramClassificacao.Value = grupoSorteio.Classificacao;
                        paramIndice.Value = indiceSorteado;
                        paramSequenciaContemplacao.Value = i;
                        paramDataContemplacao.Value = DateTime.Now;
                        tarefaProcedure = command.ExecuteNonQueryAsync();

                        grupoSorteio.Quantidade--;
                        tracker.Processed = i;
                    }

                    // Aguarda a finalização da procedure da última iteração.
                    if (tarefaProcedure != null && !tarefaProcedure.IsCompleted) {
                        tarefaProcedure.Wait();
                    }

                    // Se esta for a última lista, marca o sorteio como finalizado.
                    int quantidadeListasNaoSorteadas = Context.ListaSorteio
                        .Where(ls => ls.IdSorteio == sorteio.Id && !ls.Sorteada)
                        .Count();

                    if (quantidadeListasNaoSorteadas == 1) {
                        sorteio.Finalizado = true;
                    }

                    // Marca a lista como sorteada e armazena a semente utilizada.
                    listaSorteio.Sorteada = true;
                    listaSorteio.SementeSorteio = semente;

                    Context.SaveChanges();
                    tx.Commit();
                } catch (Exception e) {
                    tx.Rollback();
                    throw e;
                }

                tracker.Processed++;
            }
        }

        /// <summary>
        /// Tenta obter uma semente para geração de números aleatórios de "www.random.org".
        /// Se não for possível, utiliza os últimos bytes do horário do sistema.
        /// </summary>
        private int ObterSemente() {
            int? semente = null;
            try {
                using (HttpClient client = new HttpClient()) {
                    HttpResponseMessage response = client.GetAsync(@"https://www.random.org/cgi-bin/randbyte?nbytes=4&format=h").Result;
                    if (response.StatusCode == HttpStatusCode.OK) {
                        string content = response.Content.ReadAsStringAsync().Result;
                        semente = Convert.ToInt32(content.Replace(" ", ""), 16);
                    }
                }
            } catch {}
            return (semente == null) ? (int) DateTime.Now.Ticks : (int) semente;
        }
    }

    class GrupoSorteio {
        public int Classificacao { get; set; }
        public int Quantidade { get; set; }
    }
}
