@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo.
echo ===============================================
echo  🔧 Gerador de Knowledge Pack para o Sub-GPT
echo ===============================================
echo.

:: Verifica argumento
if "%~1"=="" (
  echo Uso: %~nx0 "C:\caminho\projeto.zip"  ^|  "C:\caminho\projeto.rar"
  pause
  exit /b 1
)

set "ARQUIVO=%~1"
set "EXT=%~x1"

echo Arquivo selecionado: %ARQUIVO%
echo.

:: Verifica Python
where python >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Python nao encontrado. Instale o Python 3.12+ antes de continuar.
  pause
  exit /b 1
)

:: Se for .rar, instala rarfile automaticamente
if /I "%EXT%"==".rar" (
  echo Instalando suporte a arquivos RAR (rarfile)...
  python -m pip install --quiet --upgrade pip
  python -m pip install --quiet rarfile
  echo Suporte instalado com sucesso.
)

:: Executa o gerador
echo.
echo 🚀 Gerando knowledge_pack...
python "%~dp0build_knowledge_from_archive.py" --archive "%ARQUIVO%"
if errorlevel 1 (
  echo [ERRO] Ocorreu um problema ao gerar o pacote.
  pause
  exit /b 1
)

echo.
echo ✅ Pronto! Verifique a pasta "knowledge_pack" no mesmo diretório.
pause
endlocal
