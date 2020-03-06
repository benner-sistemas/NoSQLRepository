using Benner.LGPD;
using Benner.LGPDRepository.Unit.Test.Mocks;
using Benner.NoSQLRepository.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ninject;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace Benner.LGPDRepository.Unit.Test
{
    [TestClass]
    public class LGPDRepositoryTests
    {
        [TestMethod]
        public void RepositorioDeveLerRegistrosComFiltroERetornarResultado()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<Record>>().To<CommandMock>();
            iocKernel.Bind<INoSQLQuery<Record, Filter>>().To<QueryMock>();
            iocKernel.Bind<INoSQLConfiguration>().To<MockConfig>();

            var repository = iocKernel.Get<Repository>();

            repository.Write(new Record
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "sysdba",
                Details = new RecordDetails
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
            repository.Write(new Record()
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "joao.melo",
                Details = new RecordDetails
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
            repository.Write(new Record
            {
                AccessTimestamp = DateTime.Now,
                AccessUsername = "joao.melo",
                Details = new RecordDetails
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
            List<Record> result = repository.Read(new Filter { CPF = cpfToSearch });
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(cpfToSearch, ((RecordDetails)result[0].Details).Person["CPF"]);
            Assert.AreEqual(cpfToSearch, ((RecordDetails)result[1].Details).Person["CPF"]);
        }

        [TestMethod]
        public void EnviaMensagemParaOFluentD()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<Record>>().To<Command>();
            iocKernel.Bind<INoSQLQuery<Record, Filter>>().To<QueryMock>();
            iocKernel.Bind<INoSQLConfiguration>().To<MockConfig>();

            using (var repository = iocKernel.Get<Repository>())
            {
                Assert.IsNotNull(repository);
                Assert.IsInstanceOfType(repository, typeof(Repository));
                Assert.IsInstanceOfType(repository, typeof(IDisposable));

                var commandField = typeof(Repository).BaseType.GetField("_command", BindingFlags.Instance | BindingFlags.NonPublic);
                Assert.IsNotNull(commandField);
                var commandInstance = commandField.GetValue(repository);
                Assert.IsNotNull(commandInstance);

                Assert.IsInstanceOfType(commandInstance, typeof(Command));
                Assert.IsInstanceOfType(commandInstance, typeof(IDisposable));
            }
        }
    }
}