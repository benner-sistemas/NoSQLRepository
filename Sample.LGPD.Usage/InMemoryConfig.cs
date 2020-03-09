using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.Configuration;

namespace Sample.LGPD.Usage
{
    internal class InMemoryConfig : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", ConfigurationManager.AppSettings["fluentd:Host"] },
                { "fluentd:Port", ConfigurationManager.AppSettings["fluentd:Port"] },
                { "fluentd:Tag", ConfigurationManager.AppSettings["fluentd:Tag"] },
            };
        }
    }
}