# pacote nuget

## Caso n�o tenha nuget:
```
Install-Package NuGet.CommandLine
```
ou baixar em https://www.nuget.org/downloads

## Gerar o pacote dos projetos:
Entre no diret�rio do projeto LGPDRepository
```
nuget pack Benner.LGPDRepository.csproj -Version [vers�o:1.8.0]
```

Entre no diret�rio do projeto NoSQLRepository
```
nuget pack Benner.NoSQLRepository.csproj -Version [vers�o:1.8.0]
```
## Fazer upload dos pacotes gerados
Entre no nuget.org, e fa�a upload dos arquivos .nupkg gerados nos passos anteriores