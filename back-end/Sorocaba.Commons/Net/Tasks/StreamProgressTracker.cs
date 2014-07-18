using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Sorocaba.Commons.Net.Tasks {
    public class StreamProgressTracker : IProgressTracker {

        private Stream progressStream;
        private byte[] progressData = { (byte) '0' };

        private int processed;
        private int total;
        private int lastPercentage;

        public int Total {
            get { return total; }
            set { total = (value < 0) ? 0 : ((total < processed) ? processed : value); }
        }

        public int Processed {
            get { return processed; }
            set {
                this.processed = (value < 0) ? 0 : ((value > total) ? total : value);
                int newPercentage = (int)(((double) processed / (double) total) * 100);
                if (newPercentage > lastPercentage) {
                    int increase = newPercentage - lastPercentage;
                    for (int i = 0; i < increase; i++) {
                        progressStream.Write(progressData, 0, 1);
                        progressStream.Flush();
                    }
                    lastPercentage = newPercentage;
                }
            }
        }

        public StreamProgressTracker(Stream progressStream) {
            this.progressStream = progressStream;
        }
    }
}
