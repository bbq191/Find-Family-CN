enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")
pluginManagement {
    repositories {
        // 中国科技大学镜像（国内访问更快更稳定）
        maven { url = uri("https://mirrors.ustc.edu.cn/maven/") }

        google()
        gradlePluginPortal()
        mavenCentral()
    }
}

dependencyResolutionManagement {
    repositories {
        // 中国科技大学镜像（国内访问更快更稳定）
        maven { url = uri("https://mirrors.ustc.edu.cn/maven/") }

        google()
        mavenCentral()
    }
}

rootProject.name = "Location_Sharing"
include(":androidApp")
include(":shared")