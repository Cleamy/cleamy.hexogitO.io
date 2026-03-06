// scripts/word-table-tag.js

console.log('🚀 自定义标签 [wordTable] 已加载！');

module.exports = (args, content) => {
  const lines = content.trim().split('\n');
  const wordData = [];

  // 解析表格内容
  for (const line of lines) {
    const match = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|?$/);
    if (match) {
      wordData.push({
        word: match[1].trim(),
        meaning: match[2].trim()
      });
    }
  }

   let html = '<div class="word-table-container">\n';
  html += '  <table class="word-table">\n';
  html += '    <thead>\n';
  html += '      <tr>\n';
  html += '        <th>Word</th>\n';
  html += '        <th>Meaning</th>\n';
  html += '        <th>Action</th>\n';
  html += '      </tr>\n';
  html += '    </thead>\n';
  html += '    <tbody>\n';

  wordData.forEach(item => {
    html += `      <tr>\n`;
    html += `        <td>${item.word}</td>\n`;
    html += `        <td class="meaning" style="display:none;">${item.meaning}</td>\n`;
    html += `        <td><button class="show-meaning">🔍 显示中文</button></td>\n`;
    html += `      </tr>\n`;
  });

  html += '    </tbody>\n';
  html += '  </table>\n';
  html += '</div>\n';

  return html;
};

// 注册标签
hexo.extend.tag.register('wordTable', module.exports, { ends: true });