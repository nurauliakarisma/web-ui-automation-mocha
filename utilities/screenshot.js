const fs = require("fs");
const path = require("path");

const BASE_SCREENSHOT_DIR = path.resolve(__dirname, "../screenshots");

function ensureDirectoryExists(subDir = "") {
    const targetDir = subDir ? path.join(BASE_SCREENSHOT_DIR, subDir) : BASE_SCREENSHOT_DIR;
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
}

function clearScreenshotFolder(subDir = "") {
    const targetDir = subDir ? path.join(BASE_SCREENSHOT_DIR, subDir) : BASE_SCREENSHOT_DIR;
    if (fs.existsSync(targetDir)) {
        const files = fs.readdirSync(targetDir);
        for (const file of files) {
            const filePath = path.join(targetDir, file);
            if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        }
        console.log(`[SCREENSHOT] Cleared previous screenshots in '${subDir || "screenshots"}'`);
    }
}

function sanitizeName(name) {
    return name
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase();
}

async function takeFullScreenshot(driver, testName, status, subDir = "") {
    const targetDir = ensureDirectoryExists(subDir);
    const cleanTestName = sanitizeName(testName);

    // Hapus file screenshot lama untuk skenario ini (jika ada) agar tidak menumpuk
    const existingFiles = fs.readdirSync(targetDir);
    const prefix = `full_${cleanTestName}`;
    for (const file of existingFiles) {
        if (file.startsWith(prefix)) {
            fs.unlinkSync(path.join(targetDir, file));
        }
    }

    const fileName = `full_${cleanTestName}_${status}.png`;
    const filePath = path.join(targetDir, fileName);

    const imageBase64 = await driver.takeScreenshot();
    fs.writeFileSync(filePath, imageBase64, "base64");
    console.log(`[SCREENSHOT] Full screenshot updated in '${subDir}': ${fileName}`);
    return filePath;
}

async function takeElementScreenshot(element, testName, elementName, status, subDir = "") {
    const targetDir = ensureDirectoryExists(subDir);
    const cleanTestName = sanitizeName(testName);
    const cleanElementName = sanitizeName(elementName);

    // Hapus file screenshot elemen lama untuk skenario ini (jika ada)
    const existingFiles = fs.readdirSync(targetDir);
    const prefix = `element_${cleanTestName}_${cleanElementName}`;
    for (const file of existingFiles) {
        if (file.startsWith(prefix)) {
            fs.unlinkSync(path.join(targetDir, file));
        }
    }

    const fileName = `element_${cleanTestName}_${cleanElementName}_${status}.png`;
    const filePath = path.join(targetDir, fileName);

    const imageBase64 = await element.takeScreenshot();
    fs.writeFileSync(filePath, imageBase64, "base64");
    console.log(`[SCREENSHOT] Element screenshot updated in '${subDir}': ${fileName}`);
    return filePath;
}

module.exports = {
    takeFullScreenshot,
    takeElementScreenshot,
    clearScreenshotFolder
};
