for /f %%i in ('git describe --tags --abbrev^=0 --match release-*') do @echo %%i

