using Ninject;
using RazorEngine;
using Sorocaba.Commons.Web.Json;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using Sorocaba.NossaCasa.Sorteio.Business.Services;
using Sorocaba.NossaCasa.Sorteio.Web.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace Sorocaba.NossaCasa.Sorteio.Web.Controllers {
    [RoutePrefix("api/publicacao")]
    public class PublicacaoController : BaseController {

        [Inject]
        public SorteioService SorteioService { get; set; }

        [HttpGet]
        [Route("lista/{idListaSorteio:int:min(1)}/exportar")]
        public HttpResponseMessage ExportarListaSorteio(int idListaSorteio) {
            ListaSorteio lista = SorteioService.CarregarListaSorteio(idListaSorteio);
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StringContent(RenderizarListaSorteio(lista));
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
            return response;
        }

        [HttpPost]
        [Route("lista/{idListaSorteio:int:min(1)}/publicar")]
        public AjaxRequestResult PublicarListaSorteio(int idListaSorteio) {

            ListaSorteio lista = SorteioService.CarregarListaSorteio(idListaSorteio);

            string ftpPath = String.Format("{0}{1}.html", ReadSetting("ftp.caminho"), lista.OrdemSorteio);
            FtpWebRequest request = (FtpWebRequest) WebRequest.Create(ftpPath);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential(ReadSetting("ftp.usuario"), ReadSetting("ftp.senha"));

            string data = RenderizarListaSorteio(lista);
            ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
            Byte[] bytes = encoding.GetBytes(data);

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, data.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse) request.GetResponse();
            RequestResult.Status = response.StatusCode == FtpStatusCode.ClosingData;
            RequestResult.Data = response.StatusDescription;
            response.Close();

            return RequestResult;
        }

        private string RenderizarListaSorteio(ListaSorteio lista) {
            IQueryable<CandidatoListaSorteio> contemplados = SorteioService.ListarCandidatosContempladosListaSorteio(lista.Id);
            ListaSorteioData model = new ListaSorteioData {
                Ordem = lista.OrdemSorteio,
                Nome = lista.Nome,
                Semente = lista.SementeSorteio,
                Contemplados = contemplados.Select(cls => new CandidatoSorteioData {
                    Ordem = cls.SequenciaContemplacao,
                    Cpf = cls.CandidatoSorteio.Cpf,
                    Nome = cls.CandidatoSorteio.Nome
                })
            };
            string templatePath = String.Format(@"{0}\{1}", AppDomain.CurrentDomain.BaseDirectory, "ListaContemplados.cshtml");
            return Razor.Parse(File.OpenText(templatePath).ReadToEnd(), model);
        }

        private string ReadSetting(string key) {
            return System.Configuration.ConfigurationManager.AppSettings[key];
        }
    }
}
