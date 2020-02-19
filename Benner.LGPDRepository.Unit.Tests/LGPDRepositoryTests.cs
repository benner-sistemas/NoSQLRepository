using Benner.LGPDRepository.Unit.Tests.Mocks;
using Benner.NoSQLRepository.Interfaces;
using Ninject;
using NUnit.Framework;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Tests
{
    [TestFixture]
    public class LGPDRepositoryTests
    {

        [Test]
        public void MeuTeste()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<LGPDRecord>>().To<CommandMock>();
            iocKernel.Bind<INoSQLQuery<LGPDRecord, LGPDFilter>>().To<QueryMock>();

            var repository = iocKernel.Get<LGPDRepository>();

            repository.Write(new LGPDRecord() { CPF = "blah0", Nome = "fritz" });
            repository.Write(new LGPDRecord() { CPF = "blah1", Nome = "frida" });
            repository.Write(new LGPDRecord() { CPF = "blah2", Nome = "frida" });
            repository.Write(new LGPDRecord() { CPF = "blah3", Nome = "frida" });
            repository.Write(new LGPDRecord() { CPF = "blah4", Nome = "frida" });

            List<LGPDRecord> result = repository.Read(new LGPDFilter { CPF = "blah1", Nome = "fritz" });

            Assert.IsNotNull(result);
            Assert.IsNotEmpty(result);
            Assert.AreEqual(result[0].Nome, "fritz");
            Assert.AreEqual(result[1].CPF, "blah1");
        }
    }
}