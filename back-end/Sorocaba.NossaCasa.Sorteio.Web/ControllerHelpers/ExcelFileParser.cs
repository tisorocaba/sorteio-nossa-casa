using Excel;
using Sorocaba.NossaCasa.Sorteio.Business.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;

namespace Sorocaba.NossaCasa.Sorteio.Web.ControllerHelpers {
    public class ExcelFileParser {

        public static IDataReader GetExcelReader(HttpRequest httpRequest) {

            if (httpRequest.Files.Count < 1) {
                throw new ImportacaoCandidatoException("O arquivo para importação é obrigatório.");
            }

            if (httpRequest.Files.Count > 1) {
                throw new ImportacaoCandidatoException("Apenas um arquivo deve ser enviado para importação.");
            }

            HttpPostedFile arquivo = httpRequest.Files[0];
            IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(arquivo.InputStream);
            excelReader.IsFirstRowAsColumnNames = false;
            return excelReader;
        }
    }
}
