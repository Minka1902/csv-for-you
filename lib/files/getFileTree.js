const fs = require('fs');
const path = require('path');
const NoFileError = require('../../errors/NoFileError');

module.exports.getFileTree = (targetPath, { depth = 3, showHidden = false } = {}) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(targetPath)) {
            return reject(new NoFileError(`Path does not exist: ${targetPath}`));
        }

        const stats = fs.statSync(targetPath);
        const baseName = path.basename(targetPath);

        if (!stats.isDirectory()) {
            return resolve(formatTree([{ name: baseName, type: 'file', path: targetPath }]));
        }

        const tree = buildTree(targetPath, 0, depth, showHidden);
        resolve(formatTree(tree));
    });
};

function buildTree(dirPath, currentDepth, maxDepth, showHidden) {
    if (currentDepth >= maxDepth) {
        return [];
    }

    const items = [];
    
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            if (!showHidden && entry.name.startsWith('.')) {
                continue;
            }

            const fullPath = path.join(dirPath, entry.name);
            const item = {
                name: entry.name,
                type: entry.isDirectory() ? 'directory' : 'file',
                path: fullPath
            };

            if (entry.isDirectory() && currentDepth + 1 < maxDepth) {
                item.children = buildTree(fullPath, currentDepth + 1, maxDepth, showHidden);
            }

            items.push(item);
        }
    } catch (err) {
        // Skip directories we can't read
    }

    return items;
}

function formatTree(items, prefix = '', isLast = true, isRoot = true) {
    let result = '';
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isLastItem = i === items.length - 1;
        const connector = isLastItem ? '└── ' : '├── ';
        const icon = item.type === 'directory' ? '📁 ' : '📄 ';
        
        if (!isRoot || i > 0) {
            result += '\n';
        }
        
        result += prefix + connector + icon + item.name;
        
        if (item.children && item.children.length > 0) {
            const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
            result += formatTree(item.children, newPrefix, isLastItem, false);
        }
    }
    
    return result;
}
