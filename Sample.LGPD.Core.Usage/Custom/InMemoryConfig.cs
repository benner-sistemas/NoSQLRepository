using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Sample.LGPD.Usage
{
    public class InMemoryConfig : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", "bnu-vtec012" },
                { "fluentd:Port", "24224" },
                { "fluentd:Tag", "lgpd.repository.logs" },
            };
        }
    }
}