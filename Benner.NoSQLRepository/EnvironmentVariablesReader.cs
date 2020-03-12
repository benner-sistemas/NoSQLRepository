using System;
using System.Collections.Generic;
using System.Configuration;

namespace Benner.NoSQLRepository
{
    public class EnvironmentVariablesReader : Interfaces.INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", Environment.GetEnvironmentVariable("fluentd-host")},
                { "fluentd:Port", Environment.GetEnvironmentVariable("fluentd-port")},
                { "fluentd:Tag",  Environment.GetEnvironmentVariable("fluentd-tag")},
            };
        }
    }
}
