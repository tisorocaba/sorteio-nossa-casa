using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class PaginationEngine {

        public static PaginatedResult<T> PaginatedList<T>(IQueryable<T> query, HttpRequestMessage request) where T : class {
            return PaginatedList<T>(query, PaginationParametersParser.ParseFromRequest<T>(request));
        }

        public static PaginatedResult<T> PaginatedList<T>(IQueryable<T> query, PaginationParameters parameters) where T : class {

            // Aplica os parâmetros de ordenação.
            ICollection<SortField> sortFields = parameters.SortFields;
            if (sortFields != null && sortFields.Count > 0) {
                StringBuilder sortString = new StringBuilder();
                foreach (var sortField in sortFields) {
                    if (sortString.Length > 0) {
                        sortString.Append(", ");
                    }
                        sortString.Append(sortField.FieldName);
                        sortString.Append(' ');
                        sortString.Append(sortField.SortOrder);
                }
                query = query.OrderBy(sortString.ToString(), null);
            }

            // Aplica os parâmetros de filtragem.
            ICollection<FilterField> filterFields = parameters.FilterFields;
            if (filterFields != null && filterFields.Count > 0) {
                foreach (var filterField in filterFields) {
                    string predicate;
                    if (filterField.Operator.Equals("%")) {
                        if (filterField.FieldValue is string) {
                            predicate = String.Format("{0}.Contains(@0)", filterField.FieldName, filterField.Operator);
                            query = query.Where(predicate, filterField.FieldValue);
                        } else {
                            // Assume que seja algum tipo numérico.
                            var convertiblePropertyType = typeof(decimal?);
                            var entity = Expression.Parameter(typeof(T));

                            // Navega pelos membros.
                            Expression property = entity;
                            foreach (var member in filterField.FieldName.Split('.')) {
                                property = Expression.Property(property, char.ToUpper(member[0]) + member.Substring(1));
                            }

                            // Constrói o resto da expressão.
                            var convertedProperty = Expression.Convert(property, convertiblePropertyType);
                            var conversionMethod = typeof(SqlFunctions).GetMethod("StringConvert", new Type[] { convertiblePropertyType, typeof(int?) });
                            var conversion = Expression.Call(conversionMethod, convertedProperty, Expression.Constant(20, typeof(int?)));
                            var argument = Expression.Constant(filterField.FieldValue.ToString());
                            var comparison = Expression.Call(conversion, typeof(string).GetMethod("Contains"), argument);
                            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(comparison, entity);
                            query = query.Where(lambda);
                        }
                    } else {
                        predicate = String.Format("{0} {1} @0", filterField.FieldName, filterField.Operator);
                        query = query.Where(predicate, filterField.FieldValue);
                    }
                }
            }

            // Calcula o número de páginas.
            int page = parameters.Page;
            int itensPerPage = parameters.ItensPerPage;
            long itemCount = query.Count();
            int pageCount = (int) Math.Ceiling((double) itemCount / (double) itensPerPage);
            if (page > pageCount) {
                page = pageCount;
            }
            int itemOffset = ((page - 1) * itensPerPage) + 1;
            itemOffset = (itemOffset <= 0) ?  0 : itemOffset;

            // Executa a consulta.
            List<T> itemList = query.AsEnumerable().Skip((page - 1) * itensPerPage).Take(itensPerPage).ToList();

            // Retorna os resultados paginados.
            return new PaginatedResult<T> {
                ItemCount = itemCount,
                PageCount = pageCount,
                CurrentPage = page,
                ItemOffset = itemOffset,
                ItemList = itemList
            };
        }
    }
}
