using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benner.LGPDRepository
{
    public class LGPDFluentDCommand : INoSQLCommand<LGPDRecord>
    {
        private readonly FluentdCommand _fluentdCommand = new FluentdCommand();

        public void Dispose()
        {
            _fluentdCommand.Dispose();
        }

        public void Write(LGPDRecord value)
        {
            _fluentdCommand.Write(value);
        }
    }
}
