using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class CommandMock : INoSQLCommand<LGPDRecord>
    {
        private readonly FluentdCommand _fluentdCommand = new FluentdCommand();

        public void Dispose()
        {
            _fluentdCommand.Dispose();
        }

        public void Write(LGPDRecord value)
        {
            MockCache.DataSource.Add(value);
        }
    }
}