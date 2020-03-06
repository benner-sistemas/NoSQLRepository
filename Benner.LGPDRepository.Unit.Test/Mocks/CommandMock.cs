using System.Collections.Generic;
using Benner.LGPD;
using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class CommandMock : INoSQLCommand<Record>
    {
        public void Configure(Dictionary<string, string> options)
        { }

        public void Dispose()
        {
        }

        public void Write(Record value)
        {
            MockCache.DataSource.Add(value);
        }
    }
}