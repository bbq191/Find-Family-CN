import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    kotlin("plugin.serialization") version "2.0.0"
    alias(libs.plugins.composeMultiplatform)
    kotlin("plugin.compose")
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
}

kotlin {
    androidTarget {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                    freeCompilerArgs.add("-opt-in=kotlin.time.ExperimentalTime")
                }
            }
        }
    }

    sourceSets {
        commonMain.dependencies {
            // Compose dependencies
            implementation(compose.components.resources)
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material)
            implementation(compose.ui)
            implementation(compose.components.uiToolingPreview)
            implementation(compose.material3)
            implementation(compose.materialIconsExtended)

            // Networking
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.client.core)

            // Coroutines
            implementation(libs.kotlinx.coroutines.core)

            // Serialization
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.kotlinx.datetime)

            // DataStore
            implementation(libs.androidx.datastore.preferences)

            // Cryptography
            implementation(libs.cryptography.core)

            // Image loading
            implementation(libs.coil.compose)
            implementation(libs.coil.network.ktor3)
            implementation(libs.coil.gif)

            // Map
            implementation(libs.maplibre.compose)

            // File handling
            implementation(libs.filekit.dialogs.compose)
            implementation(libs.filekit.coil)

            // Navigation
            implementation(libs.navigation.compose)
            implementation(libs.ui.backhandler)

            // Geocoding
            implementation(libs.compass.geocoder)
        }

        androidMain.dependencies {
            // Room database
            implementation(libs.androidx.room.runtime)
            implementation(libs.androidx.room.paging)

            // Android-specific dependencies
            implementation(libs.ktor.client.okhttp)
            implementation(libs.kotlinx.coroutines.android)
            implementation(libs.cryptography.provider.jdk)
            implementation(libs.compass.geocoder.mobile)

            // AndroidX
            implementation(libs.androidx.activity)
            implementation(libs.androidx.activity.ktx)
            implementation(libs.androidx.fragment.ktx)
            implementation(libs.androidx.runtime.android)
            implementation(libs.androidx.core)
        }

        commonTest.dependencies {
            implementation(libs.kotlin.test)
        }
    }
}

android {
    namespace = "com.opengps.locationsharing"
    compileSdk = 36

    defaultConfig {
        minSdk = 31
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    buildFeatures {
        compose = true
    }

    sourceSets {
        named("main") {
            res.srcDirs("src/androidMain/res")
            assets.srcDirs("src/androidMain/assets")
        }
    }
}

dependencies {
    // KSP for Room
    add("kspAndroid", libs.androidx.room.compiler)
}

room {
    schemaDirectory("$projectDir/schemas")
}
