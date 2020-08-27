using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Extensions;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class Command : INoSQLCommand<Record>
    {
        private FluentdCommand _fluentdCommand;

        public void Configure(Dictionary<string, string> options)
        {
            _fluentdCommand = new FluentdCommand(options.TransformTo<FluentdOptions>("fluentd:"));
        }

        public void Dispose()
        {
            _fluentdCommand?.Dispose();
        }

        public void Write(Record value)
        {
            _fluentdCommand.Write(value);
        }
    }
}