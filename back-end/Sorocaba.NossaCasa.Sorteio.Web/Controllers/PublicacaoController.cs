﻿using Newtonsoft.Json;
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
            response.Content = new StringContent(RenderizarListaSorteio(lista, FormatoExportacao.HTML));
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/html");
            return response;
        }

        [HttpPost]
        [Route("lista/{idListaSorteio:int:min(1)}/publicar")]
        public AjaxRequestResult PublicarListaSorteio(int idListaSorteio) {

            ListaSorteio lista = SorteioService.CarregarListaSorteio(idListaSorteio);

            string ftpPath = String.Format("{0}{1}.json", ReadSetting("ftp.caminho"), lista.OrdemSorteio);
            FtpWebRequest request = (FtpWebRequest) WebRequest.Create(ftpPath);
            request.Method = WebRequestMethods.Ftp.UploadFile;
            request.Credentials = new NetworkCredential(ReadSetting("ftp.usuario"), ReadSetting("ftp.senha"));

            string data = RenderizarListaSorteio(lista, FormatoExportacao.JSON);
            UTF8Encoding encoding = new System.Text.UTF8Encoding();
            Byte[] bytes = encoding.GetBytes(data);

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();

            FtpWebResponse response = (FtpWebResponse) request.GetResponse();
            RequestResult.Status = response.StatusCode == FtpStatusCode.ClosingData;
            RequestResult.Data = response.StatusDescription;
            response.Close();

            return RequestResult;
        }

        private string RenderizarListaSorteio(ListaSorteio lista, FormatoExportacao formato) {

            IQueryable<CandidatoListaSorteio> contemplados = SorteioService.ListarCandidatosContempladosListaSorteio(lista.Id);
            ListaSorteioData model = new ListaSorteioData {
                Ordem = lista.OrdemSorteio,
                Nome = lista.Nome,
                Semente = lista.SementeSorteio,
                Contemplados = contemplados.Select(cls => new CandidatoSorteioData {
                    Lista = cls.ListaSorteio.Nome,
                    Ordem = cls.SequenciaContemplacao,
                    Data = cls.DataContemplacao,
                    Contemplado = cls.CandidatoSorteio.Contemplado,
                    Cpf = cls.CandidatoSorteio.Cpf,
                    Nome = cls.CandidatoSorteio.Nome,
                    QuantidadeCriterios = cls.CandidatoSorteio.QuantidadeCriterios
                })
            };

            if (formato == FormatoExportacao.HTML) {
                string templatePath = String.Format(@"{0}\{1}", AppDomain.CurrentDomain.BaseDirectory, "ListaContemplados.cshtml");
                return Razor.Parse(File.OpenText(templatePath).ReadToEnd(), model);
            }
            
            else if (formato == FormatoExportacao.JSON) {
                return JsonConvert.SerializeObject(model);
            }
            
            else {
                throw new Exception("Formato de exportação inválido");
            }
        }

        private string ReadSetting(string key) {
            return System.Configuration.ConfigurationManager.AppSettings[key];
        }
    }

    public enum FormatoExportacao : int {
        HTML = 1,
        JSON = 2
    }
}
