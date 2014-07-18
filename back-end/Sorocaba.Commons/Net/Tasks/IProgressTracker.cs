using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Net.Tasks {
    public interface IProgressTracker {
        int Processed { get; set; }
        int Total { get; set; }
    }
}
