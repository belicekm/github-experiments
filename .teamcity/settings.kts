import jetbrains.buildServer.configs.kotlin.v2018_1.*
import jetbrains.buildServer.configs.kotlin.v2018_1.buildFeatures.replaceContent
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.dotnetBuild
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_1.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_1.vcs.GitVcsRoot

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

    vcsRoot(GithubExperimentsStaging)

    buildType(Test1)
    buildType(Test2)
}

object Test1 : BuildType({
    name = "Test"
    description = "Test"

    params {
        param("MyConfigParam", "12345")
    }

    vcs {
        root(AbsoluteId("GithubExperiments"))
        root(GithubExperimentsStaging)
    }

    steps {
        script {
            name = "test"
            scriptContent = "dir"
        }
        step {
            name = "test2"
            type = "jonnyzzz.gulp"
            param("jonnyzzz.gulp.tasks", "build")
        }
        dotnetBuild {
            name = "build .net"
            projects = "Test.txt"
            param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
        }
    }

    triggers {
        vcs {
            triggerRules = "+:*"
            branchFilter = ""
        }
    }

    features {
        replaceContent {
            fileRules = "Text.txt"
            pattern = "bla"
            replacement = "bla1"
        }
    }

    requirements {
        contains("system.agent.name", "mirek-pc-1")
    }
})

object Test2 : BuildType({
    name = "Test2"
    description = "Test2"

    vcs {
        root(AbsoluteId("GithubExperiments"))
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

object GithubExperimentsStaging : GitVcsRoot({
    name = "github-experiments:staging"
    url = "https://github.com/belicekm/github-experiments.git"
    branch = "refs/heads/staging"
    useTagsAsBranches = true
})
