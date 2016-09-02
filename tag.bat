for /f %%i in ('git describe --tags --abbrev^=0 --match release-*') do set TAG=%%i
echo "##teamcity[setParameter name='env.GIT_LATEST_TAG' value='%TAG%']"
echo %TAG%

