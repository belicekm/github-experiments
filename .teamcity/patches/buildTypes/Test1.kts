package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_1.*
import jetbrains.buildServer.configs.kotlin.v2018_1.buildFeatures.replaceContent
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.dotnetBuild
import jetbrains.buildServer.configs.kotlin.v2018_1.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_1.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_1.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'Test1'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("Test1")) {
    params {
        add {
            param("MyConfigParam", "12345")
        }
    }

    expectSteps {
        script {
            name = "test"
            scriptContent = "dir"
        }
        script {
            name = "test2"
            scriptContent = "ls -la"
        }
    }
    steps {
        insert(1) {
            step {
                name = "test2"
                type = "jonnyzzz.gulp"
                param("jonnyzzz.gulp.tasks", "build")
            }
        }
        insert(2) {
            dotnetBuild {
                name = "build .net"
                projects = "Test.txt"
                param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
            }
        }
        items.removeAt(3)
    }

    triggers {
        add {
            vcs {
                triggerRules = "+:*"
                branchFilter = ""
            }
        }
    }

    features {
        add {
            replaceContent {
                fileRules = "Text.txt"
                pattern = "bla"
                replacement = "bla1"
            }
        }
    }

    requirements {
        add {
            contains("system.agent.name", "mirek-pc-1")
        }
    }
}
