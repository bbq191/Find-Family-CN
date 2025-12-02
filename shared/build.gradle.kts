import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.kotlinAndroid)
    kotlin("plugin.serialization") version "2.0.0"
    alias(libs.plugins.composeMultiplatform)
    kotlin("plugin.compose")
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
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

    kotlinOptions {
        jvmTarget = "1.8"
        freeCompilerArgs += listOf("-opt-in=kotlin.time.ExperimentalTime")
    }

    buildFeatures {
        compose = true
    }

    sourceSets {
        named("main") {
            // Compose resources 位置
            resources.srcDirs("src/commonMain/composeResources")
        }
    }
}

dependencies {
    // Compose dependencies
    implementation(compose.components.resources)
    implementation(compose.runtime)
    implementation(compose.foundation)
    implementation(compose.material)
    implementation(compose.ui)
    implementation(compose.components.uiToolingPreview)
    implementation(compose.material3)
    implementation(compose.materialIconsExtended)

    // Room database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.paging)
    ksp(libs.androidx.room.compiler)

    // Networking
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)

    // Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    // Serialization
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.kotlinx.datetime)

    // DataStore
    implementation(libs.androidx.datastore.preferences)

    // Cryptography
    implementation(libs.cryptography.core)
    implementation(libs.cryptography.provider.jdk)

    // Image loading
    implementation(libs.coil.compose)
    implementation(libs.coil.network.ktor3)

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
    implementation(libs.compass.geocoder.mobile)

    // AndroidX
    implementation(libs.androidx.activity)
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.fragment.ktx)
    implementation(libs.androidx.runtime.android)
    implementation(libs.androidx.core)

    // Testing
    testImplementation(libs.kotlin.test)
}

room {
    schemaDirectory("$projectDir/schemas")
}
