const fs = require("fs");
const path = require("path");

// Icon sizes for different densities
const sizes = {
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192,
};

// Source images
const sourceImages = [
    {
        source: "fastlane/metadata/android/en-US/images/icoon-boy.png",
        name: "ic_launcher_boy",
    },
    {
        source: "fastlane/metadata/android/en-US/images/icon-girl.png",
        name: "ic_launcher_girl",
    },
];

// Check if sharp is available
let sharp;
try {
    sharp = require("sharp");
    console.log("✓ Using sharp for image processing");
} catch (e) {
    console.log("✗ Sharp not found. Installing sharp...");
    const { execSync } = require("child_process");
    try {
        execSync("npm install --no-save sharp", { stdio: "inherit" });
        sharp = require("sharp");
        console.log("✓ Sharp installed successfully");
    } catch (installError) {
        console.error("Failed to install sharp. Please run: npm install sharp");
        process.exit(1);
    }
}

async function generateIcons() {
    const resPath = path.join(__dirname, "androidApp/src/main/res");

    for (const imageConfig of sourceImages) {
        const sourcePath = path.join(__dirname, imageConfig.source);

        if (!fs.existsSync(sourcePath)) {
            console.error(`✗ Source image not found: ${sourcePath}`);
            continue;
        }

        console.log(`\nProcessing ${imageConfig.name}...`);

        for (const [density, size] of Object.entries(sizes)) {
            const outputDir = path.join(resPath, `mipmap-${density}`);
            const outputPath = path.join(outputDir, `${imageConfig.name}.png`);

            try {
                // 直接 resize 到目标尺寸，保持透明背景
                await sharp(sourcePath)
                    .resize(size, size, {
                        fit: "contain",
                        background: { r: 255, g: 255, b: 255, alpha: 0 },
                    })
                    .png()
                    .toFile(outputPath);

                console.log(`  ✓ Generated ${density}: ${size}x${size}px`);
            } catch (error) {
                console.error(
                    `  ✗ Failed to generate ${density}:`,
                    error.message
                );
            }
        }
    }

    console.log("\n✓ Icon generation complete!");
}

generateIcons().catch((error) => {
    console.error("Error generating icons:", error);
    process.exit(1);
});
