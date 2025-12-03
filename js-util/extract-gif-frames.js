const fs = require("fs");
const path = require("path");

// 检查 sharp 是否可用
let sharp;
try {
    sharp = require("sharp");
    console.log("使用 sharp 进行图片处理");
} catch (e) {
    console.log("未找到 sharp，正在安装...");
    const { execSync } = require("child_process");
    try {
        execSync("npm install --no-save sharp", { stdio: "inherit" });
        sharp = require("sharp");
        console.log("sharp 安装成功");
    } catch (installError) {
        console.error("安装 sharp 失败");
        process.exit(1);
    }
}

async function extractFrames() {
    const gifs = [
        { source: "manual/run_compressed.gif", name: "pig_run", frames: 4 },
        { source: "manual/sit_compressed.gif", name: "pig_sit", frames: 1 }
    ];

    const outputDir = path.join(__dirname, "shared/src/androidMain/res/drawable");

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const gif of gifs) {
        const sourcePath = path.join(__dirname, gif.source);

        if (!fs.existsSync(sourcePath)) {
            console.error(`源文件未找到: ${sourcePath}`);
            continue;
        }

        console.log(`\n处理 ${gif.name}...`);

        // 对于坐着的猪，只提取一帧
        if (gif.frames === 1) {
            const outputPath = path.join(outputDir, `${gif.name}.png`);
            await sharp(sourcePath)
                .resize(100, 100, {
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(outputPath);
            console.log(`  已生成: ${outputPath}`);
        } else {
            // 对于跑步的猪，提取多帧
            // 注意: Sharp 不直接支持提取 GIF 的所有帧
            // 我们只能提取第一帧，然后手动创建动画序列
            console.log(`  提取第一帧作为基础图片...`);
            const outputPath = path.join(outputDir, `${gif.name}.png`);
            await sharp(sourcePath)
                .resize(100, 100, {
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(outputPath);
            console.log(`  已生成: ${outputPath}`);
        }
    }

    console.log("\n帧提取完成！");
    console.log("\n注意: Sharp 只能提取 GIF 的第一帧");
    console.log("建议: 使用原始 MP4 提取关键帧，或使用在线工具分解 GIF");
}

extractFrames().catch((error) => {
    console.error("提取帧时出错:", error);
    process.exit(1);
});
