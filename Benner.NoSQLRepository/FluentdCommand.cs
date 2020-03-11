using Serilog;
using Serilog.Core;
using Serilog.Sinks.Fluentd;
using System;
using System.Net.Sockets;

namespace Benner.NoSQLRepository
{
    public class FluentdCommand : IDisposable
    {
        private readonly Logger _log;

        public FluentdCommand(FluentdOptions options)
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            if (string.IsNullOrWhiteSpace(options.Host))
                throw new InvalidOperationException("A propriedade 'fluentd:host' deve ser informada");

            if(string.IsNullOrWhiteSpace(options.Tag))
                throw new InvalidOperationException("A propriedade 'fluentd:Tag' deve ser informada");

            try
            {
                using (var tcpClient = new TcpClient())
                    tcpClient.Connect(options.Host, options.Port);
            }
            catch (SocketException e)
            {
                throw new InvalidOperationException($"A conexão com o FluentD no host {options.Host}:{options.Port} falhou", e);
            }

            var sinkOpts = new FluentdSinkOptions(options.Host, options.Port, options.Tag);

            _log = new LoggerConfiguration().WriteTo.Fluentd(sinkOpts).CreateLogger();
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