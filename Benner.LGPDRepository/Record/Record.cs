using System;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class Record
    {
        public DateTime AccessTimestamp { get; set; } = DateTime.Now;
        public string AccessUsername { get; set; }
        public string AccessIP { get; set; }
        public IRecordDetails Details { get; set; }
        public string System { get; set; }
    }
}