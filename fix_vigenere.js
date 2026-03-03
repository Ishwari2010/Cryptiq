const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            const parts = fullPath.split(path.sep);
            if (!parts.includes('node_modules') && !parts.includes('.git') && !parts.includes('dist') && !parts.includes('logs') && !parts.includes('build')) {
                results = results.concat(walk(fullPath));
            }
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const targetDir = 'c:/Users/acer/.gemini/antigravity/scratch/CipherLab';
const files = walk(targetDir);
let changed = 0;

const validExts = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.json', '.md'];

files.forEach(file => {
    const ext = path.extname(file);
    if (!validExts.includes(ext)) return;

    if (file.includes('CipherLab_agent_resume_transcript.txt') || file.includes('status_report.md') || file.includes('rename.js')) return;

    try {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;

        // Regex to capture Vigenere with various garbled middle characters
        newContent = newContent.replace(/Vigen(?:Ã¨|è|Ã©|é|e|Ã\s*¨)*re/g, 'Vigenere');

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            changed++;
            console.log('Fixed Vigenere in', file);
        }
    } catch (e) {
        console.error('Failed on', file, e.message);
    }
});
console.log('Total files changed for Vigenere spelling:', changed);
