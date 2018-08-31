import jetbrains.buildServer.configs.kotlin.v2018_1.*
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.script

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2018.1"

project {
    description = "Test"

    buildType(Test1)
    buildType(Test2)
}

object Test1 : BuildType({
    name = "Test"
    description = "Test"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {

        script {
            name = "test"
            scriptContent = "dir"
        }
        script {
            name = "test2"
            scriptContent = "ls -la"
        }
    }
})

object Test2 : BuildType({
    name = "Test2"
    description = "Test2"

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            name = "test"
            scriptContent = "dir"
        }

        step {
            name = "test2"
            type = "jonnyzzz.npm"
            param("npm_commands", "list -g --depth 0")
        }

    }
})
