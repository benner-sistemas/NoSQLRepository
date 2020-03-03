using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class MockConfig : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", "localhost" },
                { "fluentd:Port", "24224" },
                { "fluentd:Tag", "lgpd.repository.logs" }
            };
        }
    }
}
