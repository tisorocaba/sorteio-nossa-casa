using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class PaginationParametersParser {
        public static PaginationParameters ParseFromRequest<T>(HttpRequestMessage request) where T : class {
            try {
                // Configura um delegate para obter os parâmetros da requisição.
                var requestParameters = request.GetQueryNameValuePairs();
                Func<string, string> GetParameter = (key) => requestParameters.Where(p => p.Key == key).FirstOrDefault().Value;

                // Página atual.
                int page;
                if (GetParameter("page") == null) {
                    page = 1;
                } else {
                    page = Int32.Parse(GetParameter("page"));
                    page = (page < 1) ? 1 : page;
                }

                // Itens por página.
                int itensPerPage;
                if (GetParameter("itens_per_page") == null) {
                    itensPerPage = 10;
                } else {
                    itensPerPage = Int32.Parse(GetParameter("itens_per_page"));
                    itensPerPage = (itensPerPage < 1) ? 1 : itensPerPage;
                }

                // Parâmetros de ordenação.
                List<SortField> sortFields = new List<SortField>();
                if (GetParameter("sort_fields") != null) {
                    string[] sortFieldsParameter = GetParameter("sort_fields").Split(',');
                    foreach (string sortField in sortFieldsParameter) {
                        if (!Regex.IsMatch(sortField, @"^\w+(\.\w+)*:(asc|desc)+$")) {
                            throw new PaginationException("Formato de campo de ordenação inválido");
                        }
                        string fieldName = sortField.Substring(0, sortField.IndexOf(":"));
                        string fieldValue = sortField.Substring(sortField.IndexOf(":") + 1);
                        sortFields.Add(new SortField(fieldName, fieldValue));
                    }
                }

                // Parâmetros de filtragem.
                List<FilterField> filterFields = new List<FilterField>();
                if (GetParameter("filter_fields") != null) {
                    string[] filterFieldsParameter = GetParameter("filter_fields").Split(',');
                    foreach (string filterField in filterFieldsParameter) {
                        if (!Regex.IsMatch(filterField, @"^[\w.]+(=|%|>=|>|<=|<){1}.+$")) {
                            throw new PaginationException("Formato de campo de filtro inválido");
                        }
                        string[] values = Regex.Split(filterField, "(=|%|>=|>|<=|<)");
                        object fieldValue = ParseField<T>(values[0], values[2]);
                        filterFields.Add(new FilterField(values[0], values[1], fieldValue));
                    }
                }

                // Retorna os parâmetros de paginação obtidos da requisição.
                return new PaginationParameters {
                    Page = page,
                    ItensPerPage = itensPerPage,
                    SortFields = sortFields,
                    FilterFields = filterFields
                };
            } catch (System.Exception e) {
                if (e is PaginationException) {
                    throw e;
                } else {
                    throw new PaginationException("Os parâmetros de paginação informados são inválidos.");
                }
            }
        }

        public static object ParseField<T>(string fieldName, string fieldValue) where T : class {

            // Obtém a primeira propriedade.
            string[] fieldNames = fieldName.Split('.');
            string propertyName = char.ToUpper(fieldNames[0][0]) + fieldNames[0].Substring(1);
            PropertyInfo property = typeof(T).GetProperty(propertyName);

            // Se houver mais propriedades, navega por elas.
            for (int i = 1; i<fieldNames.Length; i++) {
                if (property != null) {
                    propertyName = char.ToUpper(fieldNames[i][0]) + fieldNames[i].Substring(1);
                    property = property.PropertyType.GetProperty(propertyName);
                }
            }

            // Se não encontrar a propriedade, retorna o valor sem alterações.
            if (property == null) {
                return fieldValue;
            }

            // Converte o valor para o tipo adequado.
            Type type = property.PropertyType;

            if (type.Equals(typeof(int))) {
                return Int32.Parse(fieldValue);
            } else if (type.Equals(typeof(decimal))) {
                return Decimal.Parse(fieldValue);
            } else if (type.Equals(typeof(bool)) || type.Equals(typeof(bool?))) {
                return Boolean.Parse(fieldValue);
            } else {
                return fieldValue;
            }
        }
    }
}
