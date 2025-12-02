import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinAndroid)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.opengps.locationsharing.android"
    compileSdk = 36
    defaultConfig {
        applicationId = "me.ikate.findby"
        minSdk = 31
        targetSdk = 36
        versionCode = 12
        versionName = "v0.1.0"
    }
    buildFeatures {
        compose = true
    }
    lint {
        // 忽略属性文件中的误报（TLSv1.2 中的冒号被误识别为 Windows 路径分隔符）
        disable += "PropertyEscape"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    dependenciesInfo {
        // Disables dependency metadata when building APKs.
        includeInApk = false
        // Disables dependency metadata when building Android App Bundles.
        includeInBundle = false
    }
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_1_8
        freeCompilerArgs.addAll(listOf(
            "-opt-in=kotlin.time.ExperimentalTime"
        ))
    }
}

dependencies {
    implementation(libs.kotlinx.coroutines.android)
    implementation(projects.shared)
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.compose.material3)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.activity)
    debugImplementation(libs.compose.ui.tooling)
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.fragment.ktx)
}
