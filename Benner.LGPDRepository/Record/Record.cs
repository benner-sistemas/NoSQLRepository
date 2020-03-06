using System;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class Record
    {
        public DateTime AccessTimestamp { get; set; }
        public string AccessUsername { get; set; }
        public IRecordDetails Details { get; set; }
    }
}