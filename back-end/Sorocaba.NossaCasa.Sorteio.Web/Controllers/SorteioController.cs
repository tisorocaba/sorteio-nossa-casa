using Ninject;
using Sorocaba.Commons.Data.Pagination;
using Sorocaba.Commons.Net.Tasks;
using Sorocaba.Commons.Web.Json;
using Sorocaba.NossaCasa.Sorteio.Business.DataObjects;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using Sorocaba.NossaCasa.Sorteio.Business.Services;
using Sorocaba.NossaCasa.Sorteio.Web.ControllerHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace Sorocaba.NossaCasa.Sorteio.Web.Controllers {
    [RoutePrefix("api/sorteio")]
    public class SorteioController : BaseController {

        [Inject] public SorteioService SorteioService { get; set; }
        [Inject] public ImportacaoCandidatoService ImportacaoCandidatoService { get; set; }
        [Inject] public ListaSorteioService ListaSorteioService { get; set; }

        // Sorteio

        [HttpGet]
        [Route("{idSorteio:int:min(1)}")]
        public AjaxRequestResult CarregarSorteio(int idSorteio) {
            RequestResult.Data = SorteioService.CarregarSorteio(idSorteio);
            return RequestResult;
        }

        [HttpGet]
        [Route]
        public AjaxRequestResult ListarSorteios() {
            RequestResult.Data = SorteioService.ListarSorteios();
            return RequestResult;
        }

        [HttpPost]
        [Route]
        public AjaxRequestResult SalvarSorteio([FromBody] SorteioE sorteio) {
            RequestResult.Data = SorteioService.SalvarSorteio(sorteio);
            return RequestResult;
        }

        [HttpPut]
        [Route("{idSorteio:int:min(1)}")]
        public AjaxRequestResult AtualizarSorteio(int idSorteio, [FromBody] SorteioE sorteio) {
            SorteioService.AtualizarSorteio(idSorteio, sorteio);
            return RequestResult;
        }

        [HttpDelete]
        [Route("{idSorteio:int:min(1)}")]
        public AjaxRequestResult ExcluirSorteio(int idSorteio) {
            SorteioService.ExcluirSorteio(idSorteio);
            return RequestResult;
        }

        [HttpPost]
        [Route("{idSorteio:int:min(1)}/importarCandidatos")]
        public AjaxRequestResult ImportarCandidatosSorteio(int idSorteio) {
            ImportacaoCandidatoService.ImportarCandidatosSorteio(idSorteio,
                ExcelFileParser.GetExcelReader(HttpContext.Current.Request));
            return RequestResult;
        }

        [HttpPost]
        [Route("{idSorteio:int:min(1)}/sortearProximaLista")]
        public HttpResponseMessage SortearProximaLista(int idSorteio, string semente = null) {
            HttpResponseMessage response = Request.CreateResponse();
            response.Content = new PushStreamContent(
                (outputStream, content, context) => {
                    ListaSorteioService.SortearProximaLista(idSorteio, new StreamProgressTracker(outputStream), semente);
                    outputStream.Close();
                }
            );
            response.Content.Headers.ContentLength = 100;
            return response;
        }

        // CandidatoSorteio

        [HttpGet]
        [Route("{idSorteio:int:min(1)}/candidato")]
        public AjaxRequestResult ListarCandidatosSorteio(int idSorteio) {
            RequestResult.Data = PaginationEngine.PaginatedList<CandidatoSorteio>(
                SorteioService.ListarCandidatosSorteio(idSorteio), Request);
            return RequestResult;
        }

        // ListaSorteio

        [HttpGet]
        [Route("{idSorteio:int:min(1)}/lista")]
        public AjaxRequestResult ListarListasSorteio(int idSorteio) {
            RequestResult.Data = SorteioService.ListarListasSorteio(idSorteio);
            return RequestResult;
        }

        [HttpGet]
        [Route("lista/{idListaSorteio:int:min(1)}/candidato")]
        public AjaxRequestResult ListarCandidatosListaSorteio(int idListaSorteio) {
            RequestResult.Data = PaginationEngine.PaginatedList<CandidatoListaSorteioData>(
                SorteioService.ProjetarCandidatosListaSorteio(SorteioService.ListarCandidatosListaSorteio(idListaSorteio)), Request);
            return RequestResult;
        }

        [HttpPost]
        [Route("{idSorteio:int:min(1)}/lista/alterarQuantidades")]
        public AjaxRequestResult AlterarQuantidadesListasSorteio(int idSorteio, [FromBody] IEnumerable<ListaSorteio> listasSorteio) {
            SorteioService.AlterarQuantidadesListasSorteio(idSorteio, listasSorteio);
            return RequestResult;
        }
    }
}
