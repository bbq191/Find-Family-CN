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

async function extractPig() {
    const sourcePath = path.join(__dirname, "manual/icons.png");
    const outputDir = path.join(__dirname, "shared/src/androidMain/res");

    if (!fs.existsSync(sourcePath)) {
        console.error(`源图片未找到: ${sourcePath}`);
        process.exit(1);
    }

    // 获取图片信息
    const metadata = await sharp(sourcePath).metadata();
    console.log(`源图片尺寸: ${metadata.width}x${metadata.height}`);

    // 计算猪的大致位置（在男孩/女孩图标的右下方）
    const iconWidth = Math.floor(metadata.width / 2);
    const iconHeight = metadata.height;

    // 猪的大致位置（根据观察）
    const pigLeft = Math.floor(iconWidth * 0.5);  // 从图标中间偏右开始
    const pigTop = Math.floor(iconHeight * 0.6);   // 从图标中间偏下开始
    const pigWidth = Math.floor(iconWidth * 0.4);  // 猪的宽度约占40%
    const pigHeight = Math.floor(iconHeight * 0.3); // 猪的高度约占30%

    console.log(`提取区域: left=${pigLeft}, top=${pigTop}, width=${pigWidth}, height=${pigHeight}`);

    // 创建输出目录
    const drawableDir = path.join(outputDir, "drawable");
    if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
    }

    // 提取左边男孩图标中的猪
    const pigOutputPath = path.join(drawableDir, "pig_marker.png");
    await sharp(sourcePath)
        .extract({
            left: pigLeft,
            top: pigTop,
            width: pigWidth,
            height: pigHeight
        })
        .trim({
            background: "#FFFFFF",
            threshold: 50
        })
        .resize(100, 100, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(pigOutputPath);

    console.log(`已生成猪标记图标: ${pigOutputPath}`);

    console.log("\n猪图标提取完成！");
}

extractPig().catch((error) => {
    console.error("提取猪图标时出错:", error);
    process.exit(1);
});
