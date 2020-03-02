using Benner.LGPDRepository.Unit.Test.Mocks;
using Benner.NoSQLRepository.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ninject;
using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test
{
    [TestClass]
    public class LGPDRepositoryTests
    {
        [TestMethod]
        public void RepositorioDeveLerRegistrosComFiltroERetornarResultado()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<LGPDRecord>>().To<CommandMock>();
            iocKernel.Bind<INoSQLQuery<LGPDRecord, LGPDFilter>>().To<QueryMock>();

            var repository = iocKernel.Get<LGPDRepository>();

            repository.Write(new LGPDRecord()
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "sysdba",
                Details = new LGPDRecordDetails
                {
                    Person =
                    {
                        { "RG", "1239874" },
                        { "CPF", "123.321.321-99" },
                    },
                    Table = "DO_FUNCIONARIOS",
                    Fields = "RG, CPF, EMAIL, SALARIO",
                },
            });
            repository.Write(new LGPDRecord()
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "joao.melo",
                Details = new LGPDRecordDetails
                {
                    Person =
                    {
                        { "RG", "6363636" },
                        { "CPF", "123.321.000-11" },
                    },
                    Table = "DO_FUNCIONARIOS",
                    Fields = "RG, CPF, EMAIL, SALARIO",
                },
            });
            repository.Write(new LGPDRecord()
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "joao.melo",
                Details = new LGPDRecordDetails
                {
                    Person =
                    {
                        { "RG", "1239874" },
                        { "CPF", "123.321.321-99" },
                    },
                    Table = "DO_FUNCIONARIOS",
                    Fields = "EMAIL, SALARIO",
                },
            });

            var cpfToSearch = "123.321.321-99";
            List<LGPDRecord> result = repository.Read(new LGPDFilter { CPF = cpfToSearch });
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(cpfToSearch, ((LGPDRecordDetails)result[0].Details).Person["CPF"]);
            Assert.AreEqual(cpfToSearch, ((LGPDRecordDetails)result[1].Details).Person["CPF"]);
        }

        [TestMethod]
        public void EnviaMensagemParaOFluentD()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<LGPDRecord>>().To<LGPDFluentDCommand>();
            iocKernel.Bind<INoSQLQuery<LGPDRecord, LGPDFilter>>().To<QueryMock>();

            var repository = iocKernel.Get<LGPDFluentDCommand>();

            Assert.IsInstanceOfType(repository, typeof(LGPDFluentDCommand));

            repository.Dispose();

        }
    }
}