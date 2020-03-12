using Benner.LGPDRepository.Core.Model;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace Benner.LGPDRepository.Core
{
    public class FileConfig : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            var fluentDSettings = GetConfiguration();

            if (fluentDSettings == null)
            {
                throw new System.Exception("appsettings.json doesn't exist.");
            }

            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", fluentDSettings.Host },
                { "fluentd:Port", fluentDSettings.Port },
                { "fluentd:Tag", fluentDSettings.Tag }
            };
        }

        private FluentDSettings GetConfiguration()
        {
            string fileConfigPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");

            if (File.Exists(fileConfigPath))
            {
                var configJson = File.ReadAllText(fileConfigPath);

                if (!string.IsNullOrWhiteSpace(configJson))
                {
                    return JsonSerializer.Deserialize<FluentDSettings>(configJson);
                }
            }

            return null;
        }
    }
}
