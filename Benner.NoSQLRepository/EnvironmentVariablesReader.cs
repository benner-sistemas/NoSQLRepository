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
                { "fluentd:Host", GetEnvironmentVariable("fluentd-host")},
                { "fluentd:Port", GetEnvironmentVariable("fluentd-port")},
                { "fluentd:Tag",  GetEnvironmentVariable("fluentd-tag")},
            };
        }

        private string GetEnvironmentVariable(string value)
        {
            return Environment.GetEnvironmentVariable(value, EnvironmentVariableTarget.Machine)
                ?? throw new InvalidOperationException($"Variável de ambiente '{value}' não foi encontrada");
        }
    }
}
