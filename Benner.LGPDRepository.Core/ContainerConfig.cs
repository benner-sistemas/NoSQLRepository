using Benner.LGPD;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace Benner.NoSQLRepository
{
    public class ContainerConfig : ILGPDConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }
        public TracerLevel Level { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", GetEnvironmentVariable("fluentd-host")},
                { "fluentd:Port", GetEnvironmentVariable("fluentd-port")},
                { "fluentd:Tag",  GetEnvironmentVariable("fluentd-tag")},
            };
            Level = TracerLevel.Full;
        }

        private string GetEnvironmentVariable(string value)
        {
            string val = null;
            val = Environment.GetEnvironmentVariable(value, EnvironmentVariableTarget.Machine);
            if(val == null)
                val = Environment.GetEnvironmentVariable(value, EnvironmentVariableTarget.Process);
            if(val == null)
                val = Environment.GetEnvironmentVariable(value, EnvironmentVariableTarget.User);
            return val ?? throw new InvalidOperationException($"Variável de ambiente '{value}' não foi encontrada");
        }
    }
}
