using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class PaginationException : System.Exception {
        public PaginationException(String message) : base(message) {
        }
    }
}
