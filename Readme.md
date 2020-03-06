# pacote nuget

## Caso não tenha nuget:
```
Install-Package NuGet.CommandLine
```
ou baixar em https://www.nuget.org/downloads

## Gerar o pacote dos projetos:
Entre no diretório do projeto LGPDRepository
```
nuget pack Benner.LGPDRepository.csproj -Version [versão:1.8.0]
```

Entre no diretório do projeto NoSQLRepository
```
nuget pack Benner.NoSQLRepository.csproj -Version [versão:1.8.0]
```
## Fazer upload dos pacotes gerados
Entre no nuget.org, e faça upload dos arquivos .nupkg gerados nos passos anteriores