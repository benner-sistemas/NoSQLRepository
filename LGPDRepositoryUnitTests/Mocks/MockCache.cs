using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Tests.Mocks
{
    public static class MockCache
    {
        private static string cacheKey = "lgpd-cache";
        public static List<LGPDRecord> DataSource
        {
            get
            {
                var result = AppDomain.CurrentDomain.GetData(cacheKey) as List<LGPDRecord>;
                if (result == null)
                {
                    AppDomain.CurrentDomain.SetData(cacheKey, new List<LGPDRecord>());
                    result = AppDomain.CurrentDomain.GetData(cacheKey) as List<LGPDRecord>;
                }
                return result;
            }
            set
            {
                AppDomain.CurrentDomain.SetData(cacheKey, value);
            }
        }
    }
}