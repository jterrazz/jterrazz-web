import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_CONTENT_DIR = path.join(process.cwd(), 'public', 'content');
const HASH_MAP_FILE = path.join(process.cwd(), 'src', 'generated', 'content-hashes.json');

const ASSET_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

// Ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Compute MD5 hash of a file
function computeHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex').substring(0, 8); // 8 chars is enough for cache busting
}

// Walk directory recursively
function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else {
            callback(filePath);
        }
    }
}

function main() {
    console.log('🔄 Syncing content assets...');
    ensureDir(PUBLIC_CONTENT_DIR);
    ensureDir(path.dirname(HASH_MAP_FILE));

    const hashMap = {};

    walkDir(CONTENT_DIR, (filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        
        // Only process asset files
        if (ASSET_EXTENSIONS.includes(ext)) {
            const relativePath = path.relative(CONTENT_DIR, filePath);
            const destPath = path.join(PUBLIC_CONTENT_DIR, relativePath);
            
            // Ensure dest dir exists
            ensureDir(path.dirname(destPath));

            // Copy file
            fs.copyFileSync(filePath, destPath);

            // Compute hash
            const hash = computeHash(filePath);
            
            // Store in map (normalize path separators for Windows compatibility if needed)
            // Key: "2019-06-01 Malloc/assets/thumbnail.jpg"
            hashMap[relativePath.replace(/\\/g, '/')] = hash;
        }
    });

    // Write hash map
    fs.writeFileSync(HASH_MAP_FILE, JSON.stringify(hashMap, null, 2));
    
    console.log(`✅ Synced ${Object.keys(hashMap).length} assets to public/content`);
    console.log(`📝 Wrote hash map to ${HASH_MAP_FILE}`);
}

main();

