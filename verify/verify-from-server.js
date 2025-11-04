import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage: node verify-from-server.js <https://HOST> [--no-verify-signature]');
        process.exit(1);
    }

    const distArg = args[0];

    const isDirect = /\.sha256$/i.test(distArg);
    const distUrl = isDirect ? distArg : `${distArg.replace(/\/$/, '')}/dist.sha256`;
    const baseUrl = distUrl.split('/').slice(0, -1).join('/');

    console.log(` 🔗 Using dist.sha256: ${distUrl}`);
    console.log(` 🌍 Base URL: ${baseUrl}`);

    // --- download dist.sha256
    console.log(' ⬇️  Downloading dist.sha256...');
    const distResp = await fetch(distUrl);
    if (!distResp.ok) throw new Error(`Failed to download ${distUrl}`);
    const distText = await distResp.text();

    const tmpDir = fs.mkdtempSync(path.join(process.cwd(), 'verify-'));
    const serverShaFile = path.join(tmpDir, 'server.dist.sha256');
    const computedShaFile = path.join(tmpDir, 'computed.dist.sha256');

    fs.writeFileSync(serverShaFile, distText);

    const lines = distText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length && !l.startsWith('#'));

    const missing = [];
    const computed = [];

    for (const rawLine of lines) {
        const [hash, rawPath] = rawLine.replace(/\*/g, '').split(/\s+/, 2);
        const filePath = rawPath.replace(/^\.\/+/, '');
        let fileUrl = /^https?:\/\//.test(filePath) ? filePath : `${baseUrl}/${filePath}`;

        console.log(`Fetching ${filePath} ...`);
        const fileResp = await fetch(fileUrl);
        if (!fileResp.ok) {
            console.log(` ❌ Missing (${fileResp.status})`);
            missing.push(filePath);
            continue;
        }
        const buffer = Buffer.from(await fileResp.arrayBuffer());
        const sum = crypto.createHash('sha256').update(buffer).digest('hex');
        computed.push(`${sum}  ${filePath}`);

        if (sum === hash) {
            console.log(` ✅ OK: ${filePath}`);
        } else {
            console.log(` ⚠️  MISMATCH: ${filePath}`);
        }
    }

    fs.writeFileSync(computedShaFile, computed.join('\n') + '\n');

    // --- compare sorted
    const normalize = (lines) =>
        lines.map((l) => l.trim().replace(/^\.\//, '').replace(/\*/g, '')).sort((a, b) => a.localeCompare(b));

    const same = JSON.stringify(normalize(lines)) === JSON.stringify(normalize(computed));

    if (same) {
        console.log('\n ✅ All computed hashes match server dist.sha256');
    } else {
        console.log('\n ❌ Hashes mismatch!');
    }

    const sigUrl = `${distUrl}.asc`;
    const sigPath = path.join(tmpDir, 'dist.sha256.asc');
    console.log(`\n 🔐 Checking signature: ${sigUrl}`);

    const sigResp = await fetch(sigUrl);
    if (!sigResp.ok) {
        console.log(' ⚠️  No signature found.');
    } else {
        fs.writeFileSync(sigPath, await sigResp.text());
        const pubKeyPath = path.join(__dirname, 'public.key');
        if (fs.existsSync(pubKeyPath)) {
            console.log(`Importing key from ${pubKeyPath}`);
            try {
                execSync(`gpg --import "${pubKeyPath}"`, { stdio: 'ignore' });
            } catch {}
        } else {
            console.log(' ⚠️  No public.key found next to script.');
        }

        try {
            execSync(`gpg --verify "${sigPath}" "${serverShaFile}"`, { stdio: 'inherit' });
            console.log(' ✅ Signature verified.');
        } catch {
            console.log(' ❌ Signature verification failed.');
        }
    }

    console.log(`\n 📁 Temp dir: ${tmpDir}`);
}

main().catch((err) => {
    console.error(' 💥 Error:', err.message);
    process.exit(2);
});
