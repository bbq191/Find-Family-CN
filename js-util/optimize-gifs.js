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

async function optimizeGifs() {
    const gifs = [
        { source: "manual/run_compressed.gif", name: "pig_run" },
        { source: "manual/sit_compressed.gif", name: "pig_sit" }
    ];

    const outputDir = path.join(__dirname, "shared/src/androidMain/res/drawable");

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const gif of gifs) {
        const sourcePath = path.join(__dirname, gif.source);
        const outputPath = path.join(outputDir, `${gif.name}.gif`);

        if (!fs.existsSync(sourcePath)) {
            console.error(`源文件未找到: ${sourcePath}`);
            continue;
        }

        console.log(`处理 ${gif.name}...`);

        // Sharp 不直接支持 GIF 动画处理，所以我们直接复制文件
        // 但可以尝试调整第一帧来验证
        const metadata = await sharp(sourcePath).metadata();
        console.log(`  原始尺寸: ${metadata.width}x${metadata.height}`);

        // 直接复制 GIF 文件
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`  已复制到: ${outputPath}`);
    }

    console.log("\nGIF 优化完成！");
    console.log("注意: GIF 文件较大，如果需要进一步压缩，建议使用 gifsicle 等专门工具");
}

optimizeGifs().catch((error) => {
    console.error("优化 GIF 时出错:", error);
    process.exit(1);
});
