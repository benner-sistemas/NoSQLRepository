using System.Collections.Generic;
using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class CommandMock : INoSQLCommand<LGPDRecord>
    {
        public void Configure(Dictionary<string, string> options)
        { }

        public void Dispose()
        {
        }

        public void Write(LGPDRecord value)
        {
            MockCache.DataSource.Add(value);
        }
    }
}