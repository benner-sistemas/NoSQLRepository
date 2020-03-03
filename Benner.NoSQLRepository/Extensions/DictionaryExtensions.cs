using System;
using System.Collections.Generic;
using System.Reflection;

namespace Benner.NoSQLRepository.Extensions
{
    public static class DictionaryExtensions
    {
        /// <summary>
        /// Mapeia os valores do dicionário para um novo objeto de tipo <typeparamref name="T"/>.
        /// Apenas as chaves que correspondem ao nome de uma propriedade do tipo <typeparamref name="T"/> serão convertidas nas propriedades.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dictionary"></param>
        /// <returns></returns>
        public static T TransformTo<T>(this Dictionary<string, string> dictionary) where T : class, new()
        {
            return dictionary.TransformTo<T>("");
        }

        /// <summary>
        /// Mapeia os valores do dicionário para um novo objeto de tipo <typeparamref name="T"/>.
        /// Apenas as chaves que correspondem ao nome de uma propriedade do tipo <typeparamref name="T"/> serão convertidas nas propriedades.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dictionary"></param>
        /// <param name="keyPrefix">O prefixo das chaves cujos valores deverão ser mapedos para as propriedades do tipo <typeparamref name="T"/></param>
        /// <returns></returns>
        public static T TransformTo<T>(this Dictionary<string, string> dictionary, string keyPrefix) where T : class, new()
        {
            var obj = new T();
            foreach (var item in dictionary)
                if (item.Key.StartsWith(keyPrefix, StringComparison.InvariantCultureIgnoreCase))
                {
                    var key = item.Key.Remove(0, keyPrefix.Length);
                    var prop = typeof(T).GetProperty(key, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
                    if (prop != null)
                    {
                        object value = item.Value;
                        if (prop.PropertyType != typeof(string))
                            value = Convert.ChangeType(item.Value, prop.PropertyType);
                        prop.SetValue(obj, value);
                    }
                }
            return obj;
        }
    }
}
