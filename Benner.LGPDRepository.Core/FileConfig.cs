using Benner.LGPDRepository.Core.Model;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace Benner.LGPD
{
    public class FileConfig : ILGPDConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }
        public TracerLevel Level { get; set; }

        public void LoadSettings()
        {
            var appSettings = GetConfiguration();

            if (appSettings == null)
            {
                throw new System.Exception("appsettings.json doesn't exist.");
            }

            if (appSettings.FluentDSettings == null)
            {
                throw new System.Exception("appsettings.json doesn't have FluentDSettings.");
            }

            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", appSettings.FluentDSettings.Host },
                { "fluentd:Port", appSettings.FluentDSettings.Port },
                { "fluentd:Tag", appSettings.FluentDSettings.Tag }
            };
            Level = TracerLevel.Full;
        }

        public static AppSettings GetConfiguration()
        {
            string fileConfigPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");

            if (File.Exists(fileConfigPath))
            {
                var configJson = File.ReadAllText(fileConfigPath);

                if (!string.IsNullOrWhiteSpace(configJson))
                {
                    return JsonSerializer.Deserialize<AppSettings>(configJson);
                }
            }

            return null;
        }
    }
}
