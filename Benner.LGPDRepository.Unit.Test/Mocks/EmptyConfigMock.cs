using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class EmptyConfigMock : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", null },
                { "fluentd:Port", null },
                { "fluentd:Tag", null }
            };
        }
    }
}
