using Benner.LGPD;
using Benner.LGPDRepository.Core;
using Benner.NoSQLRepository.Interfaces;
using Ninject;
using Sample.LGPD.Usage;

namespace Sample.LGPD.Core.Usage
{
    class Program
    {
        static void Main(string[] args)
        {
            FileConfig.GetConfiguration();


            SimplestUsagePossible();

            DependencyInjectionUsage();

            PartialInjectionUsage();

            ExplicitInjectionUsage();
        }

        private static void SimplestUsagePossible()
        {
            using (Repository repository = new Repository())
            {
                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.default",
                    Details = new RecordDetails
                    {
                        Person = {
                                { "CPF", "111.111.111-11" },
                                { "PASSPORT", "IEY5AHXA" },
                            },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
            }
        }

        private static void DependencyInjectionUsage()
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<Record>>().To<LGPDCommandMock>();
            iocKernel.Bind<INoSQLQuery<Record, Filter>>().To<LGPDQueryMock>();
            iocKernel.Bind<INoSQLConfiguration>().To<InMemoryConfig>();

            using (var repository = iocKernel.Get<Repository>())
                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.injected",
                    Details = new RecordDetails
                    {
                        Person = {
                            { "CPF", "222.222.222-22" },
                            { "PASSPORT", "OC725277" },
                        },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
        }

        private static void PartialInjectionUsage()
        {
            var iocKernel = new StandardKernel(new NinjectSettings { AllowNullInjection = true });

            iocKernel.Bind<INoSQLCommand<Record>>().To<LGPDCommandMock>();

            using (var repository = iocKernel.Get<Repository>())
                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.partial.injected",
                    Details = new RecordDetails
                    {
                        Person = {
                            { "CPF", "333.333.333-33" },
                            { "PASSPORT", "OC725277" },
                        },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
        }

        private static void ExplicitInjectionUsage()
        {
            // dica: você pode informar apenas os parâmetros que deseja customizar, parâmetros não informados assumem o padrão
            //using (var repository = new Repository(command: new LGPDCommandMock()))
            //using (var repository = new Repository(query: new LGPDQueryMock()))
            //using (var repository = new Repository(config: new InMemoryConfig()))

            using (var repository = new Repository(new LGPDCommandMock(), new LGPDQueryMock(), new InMemoryConfig()))
                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.explicit.injected",
                    Details = new RecordDetails
                    {
                        Person = {
                            { "CPF", "444.444.444-44" },
                            { "PASSPORT", "OC725277" },
                        },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
        }
    }
}
