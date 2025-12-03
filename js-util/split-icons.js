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
        console.error("安装 sharp 失败，请运行: npm install sharp");
        process.exit(1);
    }
}

async function splitIcons() {
    const sourcePath = path.join(__dirname, "manual/icons.png");
    const outputDir = path.join(__dirname, "fastlane/metadata/android/en-US/images");

    if (!fs.existsSync(sourcePath)) {
        console.error(`源图片未找到: ${sourcePath}`);
        process.exit(1);
    }

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 获取图片信息
    const metadata = await sharp(sourcePath).metadata();
    console.log(`源图片尺寸: ${metadata.width}x${metadata.height}`);

    // 计算每个图标的宽度（假设是水平排列的两个图标）
    const iconWidth = Math.floor(metadata.width / 2);
    const iconHeight = metadata.height;

    // 计算黑框的宽度（水平方向 6.5%，垂直方向 10%）
    const borderWidth = Math.floor(iconWidth * 0.065);
    const borderHeight = Math.floor(iconHeight * 0.10);

    // 计算圆角半径（黑框宽度的3倍左右）
    const cornerRadius = borderWidth * 3;

    // 内容区域尺寸
    const contentWidth = iconWidth - borderWidth * 2;
    const contentHeight = iconHeight - borderHeight * 2;

    console.log(`黑框宽度: ${borderWidth}px, 内容区域: ${contentWidth}x${contentHeight}px`);

    // 裁切左边的男孩图标
    const boyOutputPath = path.join(outputDir, "icoon-boy.png");
    const boyBuffer = await sharp(sourcePath)
        .extract({
            left: borderWidth,
            top: borderHeight,
            width: contentWidth,
            height: contentHeight
        })
        .toBuffer();

    // 创建圆角蒙版并应用
    const roundedMask = Buffer.from(
        `<svg width="${contentWidth}" height="${contentHeight}">
            <rect x="0" y="0" width="${contentWidth}" height="${contentHeight}"
                  rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
        </svg>`
    );

    await sharp(boyBuffer)
        .composite([{
            input: roundedMask,
            blend: 'dest-in'
        }])
        .png()
        .toFile(boyOutputPath);
    console.log(`已生成男孩图标（已去除黑框，圆角处理）: ${boyOutputPath}`);

    // 裁切右边的女孩图标
    const girlOutputPath = path.join(outputDir, "icon-girl.png");
    const girlBuffer = await sharp(sourcePath)
        .extract({
            left: iconWidth + borderWidth,
            top: borderHeight,
            width: contentWidth,
            height: contentHeight
        })
        .toBuffer();

    await sharp(girlBuffer)
        .composite([{
            input: roundedMask,
            blend: 'dest-in'
        }])
        .png()
        .toFile(girlOutputPath);
    console.log(`已生成女孩图标（已去除黑框，圆角处理）: ${girlOutputPath}`);

    console.log("\n图标裁切完成！");
}

splitIcons().catch((error) => {
    console.error("裁切图标时出错:", error);
    process.exit(1);
});
