using Benner.NoSQLRepository.Interfaces;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace Benner.LGPD
{
    public class FileConfig : ILGPDConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }
        public TracerLevel Level { get; set; }

        public void LoadSettings()
        {
            ValidaConfiguracoes();
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", ConfigurationManager.AppSettings["fluentd:Host"] },
                { "fluentd:Port", ConfigurationManager.AppSettings["fluentd:Port"] },
                { "fluentd:Tag", ConfigurationManager.AppSettings["fluentd:Tag"] },
            };
        }

        private void ValidaConfiguracoes()
        {
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["fluentd:Host"]))
                throw new InvalidOperationException("Host do fluentd deve ser informado");

            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["fluentd:Port"]))
                throw new InvalidOperationException("Port do fluentd deve ser informada");

            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings["fluentd:Tag"]))
                throw new InvalidOperationException("Tag do fluentd deve ser informada");
        }
    }
}
