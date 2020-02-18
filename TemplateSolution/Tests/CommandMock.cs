using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TemplateSolution.Interfaces;

namespace TemplateSolution.Tests
{
    public class CommandMock : INoSQLCommand<LGPDRecord>
    {
        public void Write(LGPDRecord value)
        {
            MockCache.DataSource.Add(value);
        }
    }

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