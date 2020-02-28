using Serilog;
using Serilog.Core;
using System;

namespace Benner.NoSQLRepository
{
    public class FluentdWriter : IDisposable
    {
        private readonly Logger _log = new LoggerConfiguration().WriteTo.Fluentd("localhost", 24224, "fluentd.log").CreateLogger();

        public string Host { get; set; }
        public int Port { get; set; }
        public string Tag { get; set; }

        public void Write(object record)
        {
            _log.Information("{@record}", record);
        }

        public void Dispose()
        {
            //flush and close fluentd tcp connection
            _log.Dispose();
        }

        ~FluentdWriter()
        {
            Dispose();
        }
    }
}
