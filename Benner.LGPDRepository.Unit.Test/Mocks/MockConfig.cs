﻿using Benner.LGPD;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class MockConfig : ILGPDConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }
        public TracerLevel Level { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "fluentd:Host", "bnu-vtec012" },
                { "fluentd:Port", "24224" },
                { "fluentd:Tag", "lgpd.repository.logs" }
            };
        }
    }
}
