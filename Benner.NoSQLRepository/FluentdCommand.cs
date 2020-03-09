using Serilog;
using Serilog.Core;
using Serilog.Sinks.Fluentd;
using System;

namespace Benner.NoSQLRepository
{
    public class FluentdCommand : IDisposable
    {
        private readonly Logger _log;

        public FluentdCommand(FluentdOptions options)
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            var sinkOpts = new FluentdSinkOptions(options.Host, options.Port, options.Tag);
            _log = new LoggerConfiguration().WriteTo.Fluentd(sinkOpts).CreateLogger();

            if (string.IsNullOrWhiteSpace(options.Host))
                throw new InvalidOperationException("A propriedade 'fluentd:host' deve ser informada");

            if(string.IsNullOrWhiteSpace(options.Tag))
                throw new InvalidOperationException("A propriedade 'fluentd:Tag' deve ser informada");
        }

        public void Write(object record)
        {
            _log.Information("{@record}", record);
        }

        public void Dispose()
        {
            //flush and close fluentd tcp connection
            _log.Dispose();
        }

        ~FluentdCommand()
        {
            Dispose();
        }
    }
}