using Serilog;
using Serilog.Configuration;
using Serilog.Core;
using Serilog.Debugging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benner.NoSQLRepository
{
    public class FluentdCommand
    {
        private Logger _log = new LoggerConfiguration().WriteTo.Fluentd("localhost", 24224, "Repository.top").CreateLogger();

        public void Write(object record)
        {
            _log.Information("{@record}", record);
        }

        public void Dispose()
        {
            _log.Dispose();
        }
    }
}
