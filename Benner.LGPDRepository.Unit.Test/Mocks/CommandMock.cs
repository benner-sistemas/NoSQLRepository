using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class CommandMock : INoSQLCommand<LGPDRecord>
    {
        public void Write(LGPDRecord value)
        {
            MockCache.DataSource.Add(value);
        }
    }
}