using Benner.LGPD;
using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public static class MockCache
    {
        private static string cacheKey = "lgpd-cache";
        public static List<Record> DataSource
        {
            get
            {
                var result = AppDomain.CurrentDomain.GetData(cacheKey) as List<Record>;
                if (result == null)
                {
                    AppDomain.CurrentDomain.SetData(cacheKey, new List<Record>());
                    result = AppDomain.CurrentDomain.GetData(cacheKey) as List<Record>;
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