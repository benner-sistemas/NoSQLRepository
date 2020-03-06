using Benner.LGPD;
using System;

namespace Sample.LGPD.Usage
{
    class Program
    {
        private static Repository _repository;


        static void Main(string[] args)
        {
            // utilização padrão
            DefaultUsage();

            // com injeção de dependência geral: Command, Query e Config
            DependencyInjectionUsage();

            // com injeção de configuração InMemory
            InMemoryConfigUsage();
        }

        private static void DefaultUsage()
        {
            _repository = new Repository();

            SendToLog();

            _repository.Dispose();
        }

        private static void DependencyInjectionUsage()
        {
            // var iocKernel = new StandardKernel();
            // TODO: em vez de usar os mocks, usar os default igual do construtor sem parâmetro:
            // new Command(), new EmptyQuery(), new FileConfig()

            //iocKernel.Bind<INoSQLCommand<Record>>().To<Command>();
            //iocKernel.Bind<INoSQLQuery<Record, Filter>>().To<QueryMock>();
            //iocKernel.Bind<INoSQLConfiguration>().To<MockConfig>();

            // _repository = iocKernel.Get<Repository>();
            // SendToLog();
            // _repository.Dispose();
        }

        private static void InMemoryConfigUsage()
        {
            // var iocKernel = new StandardKernel();
            // TODO: em vez de usar os mocks, usar os default igual do construtor sem parâmetro:
            // new Command(), new EmptyQuery(), new FileConfig()

            // injetar um InMemoryConfig que é uma cópia do MockConfig

            //iocKernel.Bind<INoSQLCommand<Record>>().To<Command>();
            //iocKernel.Bind<INoSQLQuery<Record, Filter>>().To<QueryMock>();
            //iocKernel.Bind<INoSQLConfiguration>().To<MockConfig>();

            // _repository = iocKernel.Get<Repository>();
            // SendToLog();
            // _repository.Dispose();
        }

        private static void SendToLog()
        {
            _repository.Write(
                new Record
                {
                    AccessTimestamp = DateTime.Now,
                    AccessUsername = "abalóida!!!",
                    Details = new RecordDetails
                    {
                        Person =
                        {
                                {"CPF", "123.123.321-44" },
                                { "PASSPORT", "4444444" },
                        },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
        }
    }
}
