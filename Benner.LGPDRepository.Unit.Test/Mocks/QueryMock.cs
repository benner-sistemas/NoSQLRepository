﻿using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class QueryMock : INoSQLQuery<LGPDRecord, LGPDFilter>
    {
        public void Configure(Dictionary<string, string> options)
        { }

        public void Dispose()
        { }

        public List<LGPDRecord> Read(LGPDFilter filter)
        {

            return MockCache.DataSource.Where(
                x =>
                {
                    if (x.Details is LGPDRecordDetails details)
                        return details.Person["CPF"] == filter.CPF;
                    return false;
                })
                .ToList();
        }
    }
}