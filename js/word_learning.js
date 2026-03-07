// 点击英文 → 显示/隐藏中文
document.addEventListener('DOMContentLoaded', function () {
    // 仅在指定页面运行
    const pageTitle = document.querySelector('.post-meta__tag-list');
    const pageCategory = document.querySelector('.post-meta-categories');
    if (!(!pageTitle || !(pageTitle.textContent.trim().includes(['英语单词'])) ||
        !pageCategory || !(pageCategory.textContent.trim().includes(['英语单词'])))) {
        return;
    }
    

    const tables = document.querySelectorAll('.post-content table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const wordCell = cells[0];
                const meaningCell = cells[1];

                // 保存中文
                const meaningText = meaningCell.textContent.trim();
                meaningCell.dataset.meaning = meaningText;
                meaningCell.textContent = '';
                meaningCell.style.display = 'none';

                // 样式
                wordCell.classList.add('word-cell');
                meaningCell.classList.add('meaning-cell');

                wordCell.addEventListener('click', function () {
                    if (meaningCell.style.display === 'none') {
                        meaningCell.textContent = meaningText;
                        meaningCell.style.display = 'block';

                        // ✅ 毛玻璃高亮
                        wordCell.style.fontWeight = 'bold';
                        wordCell.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        wordCell.style.backdropFilter = 'blur(8px)';
                        wordCell.style.webkitBackdropFilter = 'blur(8px)';
                        wordCell.style.borderRadius = '6px';
                        wordCell.style.transition = 'all 0.3s ease';
                        wordCell.style.padding = '4px 8px';

                    } else {
                        meaningCell.style.display = 'none';
                        meaningCell.textContent = '';
                        wordCell.style.fontWeight = '500';
                        wordCell.style.backgroundColor = 'transparent';
                        wordCell.style.backdropFilter = 'none';
                        wordCell.style.webkitBackdropFilter = 'none';
                        wordCell.style.padding = '4px 0';
                    }
                });
            }
        });
    });
});