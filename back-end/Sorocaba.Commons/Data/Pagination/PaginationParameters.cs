using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class PaginationParameters {
        public int Page { get; set; }
        public int ItensPerPage { get; set; }
        public ICollection<SortField> SortFields { get; set; }
        public ICollection<FilterField> FilterFields { get; set; }
    }
}
