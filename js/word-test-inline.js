// source/js/word-test.js
document.addEventListener('DOMContentLoaded', function () {
    // 仅在指定页面运行
    const pageTitle = document.querySelector('.post-meta__tag-list');
    const pageCategory = document.querySelector('.post-meta-categories');
    console.log(pageTitle.textContent.trim())
    console.log(pageCategory.textContent.trim())
    console.log((!pageTitle || !(pageTitle.textContent.trim().includes(['英语单词'])) || !pageCategory || !(pageCategory.textContent.trim().includes(['英语单词']))))
        console.log("测试链接2：："+(false||false||false||!(true)))
        console.log(!pageTitle)
        console.log(!pageCategory)
        console.log(!(pageTitle.textContent.trim().includes(['英语单词'])))
        console.log(!pageCategory.textContent.trim().includes(['英语单词']))
    if (!(!pageTitle || !(pageTitle.textContent.trim().includes(['英语单词'])) ||
        !pageCategory || !(pageCategory.textContent.trim().includes(['英语单词'])))) {
        return;
    }
    

    const tables = document.querySelectorAll('.post-content table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return; // 确保至少有3列

            const wordCell = cells[0];
            const meaningCell = cells[1];
            const actionCell = cells[2]; // 第三列用于放按钮

            const word = wordCell.textContent.trim();
            const meaning = meaningCell.dataset.meaning || meaningCell.textContent.trim();

            // ✅ 直接清空第三列，并插入测试按钮（不再判断 [test]）
            actionCell.innerHTML = ''; // 清空原有内容
            // 添加到表格
            
            const testBtn = document.createElement('button');
            testBtn.className = 'word-test-btn';
            testBtn.innerHTML = '📝 测试';
            testBtn.style.cssText = `
                padding: 4px 10px;
                font-size: 12px;
                background-color: #1976D2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
                text-align: center;
            `;
            testBtn.onmouseover = () => testBtn.style.backgroundColor = '#1565C0';
            testBtn.onmouseout = () => testBtn.style.backgroundColor = '#1976D2';
            // const actionCell = document.createElement('td');
            // actionCell.appendChild(testBtn);
            // row.appendChild(actionCell);
            testBtn.onclick = function () {
                showTestModal(word, meaning);
            };

            actionCell.appendChild(testBtn);
        });
    });

    // ...（后面的 showTestModal 函数保持不变）
       function showTestModal(correctWord, chineseMeaning) {
    // 防止重复弹窗
    if (document.getElementById('inline-quiz-modal')) {
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'inline-quiz-modal';

    // ✅ 使用 CSS 变量或判断是否为深色模式
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 设置文字颜色和背景
    const textColor = isDarkMode ? '#000' : '#333';
    const bgColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'white';
    const inputBg = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'white';

    modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="
        background: ${bgColor}; 
        padding: 24px; 
        border-radius: 12px; 
        max-width: 400px; 
        width: 90%; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        color: ${textColor};
      ">
        <h3 style="margin-top: 0; color: ${textColor};">拼写测试</h3>
        <p><strong>中文：</strong> ${chineseMeaning}</p>
        <input type="text" id="inline-quiz-input" placeholder="请输入英文单词" style="
          width: 100%; 
          padding: 10px; 
          margin: 10px 0; 
          border: 1px solid #ddd; 
          border-radius: 4px; 
          font-size: 16px;
          background: ${inputBg};
          color: ${isDarkMode ? '#000' : '#333'};
        ">
        <p id="inline-quiz-feedback" style="min-height: 20px; color: #d32f2f;"></p>
        <button id="inline-quiz-submit" style="padding: 8px 16px; background: #1976D2; color: white; border: none; border-radius: 4px; cursor: pointer;">提交</button>
        <button id="inline-quiz-close" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px;">关闭</button>
      </div>
    </div>`;

    document.body.appendChild(modal);

    const input = document.getElementById('inline-quiz-input');
    const feedback = document.getElementById('inline-quiz-feedback');
    const submitBtn = document.getElementById('inline-quiz-submit');
    const closeBtn = document.getElementById('inline-quiz-close');

    input.focus();

    submitBtn.onclick = function () {
        const answer = input.value.trim().toLowerCase();
        const correct = correctWord.toLowerCase();

        if (answer === correct) {
            feedback.innerHTML = `<span style="color:#4CAF50">✅ 正确！</span>`;
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
        } else {
            feedback.innerHTML = `<span style="color:#d32f2f">❌ 错误！正确是：<code>${correct}</code></span>`;
        }
    };

    closeBtn.onclick = function () {
        document.body.removeChild(modal);
    };

    // 回车提交
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}
});