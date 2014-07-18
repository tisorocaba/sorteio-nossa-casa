using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class PaginatedResult<T> where T : class {
        public long ItemCount { get; set; }
        public int PageCount { get; set; }
        public int CurrentPage { get; set; }
        public long ItemOffset { get; set; }
        public List<T> ItemList { get; set; }
    }
}
