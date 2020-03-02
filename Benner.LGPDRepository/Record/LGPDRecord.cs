using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository
{
    public class LGPDRecord
    {
        public DateTime AccessTimestamp { get; set; }
        public string AccessUsername { get; set; }
        public ILGPDRecordDetails Details { get; set; }
    }
}