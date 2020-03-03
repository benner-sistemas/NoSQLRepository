using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace Benner.LGPDRepository.Unit.Test
{
    [TestClass]
    public class DictionaryExtensionsTests
    {
        [TestMethod]
        public void ExtensaoDeveTransformarApenasPropriedadesComPrefixoInformado()
        {
            var dictionary = new Dictionary<string, string> { { "fluentd:host", "localhost" }, { "fluentd:Port", "24224" }, { "TAG", "lgdp.repository" } };
            var options = dictionary.TransformTo<FluentdOptions>("fluentd:");

            Assert.AreEqual("localhost", options.Host);
            Assert.AreEqual(24224, options.Port);
            Assert.IsNull(options.Tag);
        }

        [TestMethod]
        public void ExtensaoDeveTransformarStringEmTiposCorretos()
        {
            var dictionary = new Dictionary<string, string> { { "string", "words" }, { "integer", "123456" }, { "double", "10,02" }, { "boolean", "true" } };
            var types = dictionary.TransformTo<Types>();
            
            Assert.AreEqual("words", types.String);
            Assert.AreEqual(123456, types.Integer);
            Assert.AreEqual(10.02, types.Double);
            Assert.AreEqual(true, types.Boolean);
        }

        private class Types
        {
            public string String { get; set; }
            public int Integer { get; set; }
            public double Double { get; set; }
            public bool Boolean { get; set; }
        }
    }
}
