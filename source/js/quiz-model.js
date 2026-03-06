// source/js/quiz-modal.js
document.addEventListener('DOMContentLoaded', function () {
    // 只在特定文章中显示测试按钮（可选）
    const pageTitle = document.querySelector('.post-title');
    if (!pageTitle || !['英语单词每日学习'].includes(pageTitle.textContent.trim())) {
        return;
    }

    // 添加【开始测试】按钮
    const postContent = document.querySelector('.post-content');
    const button = document.createElement('button');
    button.textContent = '🎯 开始单词测试';
    button.style.cssText = `
        margin: 20px 0;
        padding: 10px 20px;
        font-size: 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;
    `;
    button.onmouseover = () => button.style.backgroundColor = '#45a049';
    button.onmouseout = () => button.style.backgroundColor = '#4CAF50';

    postContent.insertBefore(button, postContent.firstChild);

    // 测验逻辑
    button.onclick = function () {
        startWordQuiz();
    };
});

function startWordQuiz() {
    const words = window.englishWords;
    let index = 0;
    let correct = 0;

    // 打乱数组（随机顺序）
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    // 创建模态框 HTML
    const modal = document.createElement('div');
    modal.innerHTML = `
    <div id="quiz-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 9999;">
      <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); position: relative;">
        <h2 style="margin-top: 0; color: #333;">单词测试</h2>
        <p><strong>中文：</strong> <span id="quiz-chinese"></span></p>
        <input type="text" id="quiz-input" placeholder="请输入英文单词" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
        <p id="quiz-feedback" style="min-height: 20px; color: #d32f2f;"></p>
        <button id="quiz-submit" style="padding: 10px 20px; background: #1976D2; color: white; border: none; border-radius: 4px; cursor: pointer;">提交</button>
        <button id="quiz-next" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; display: none;">下一题</button>
        <button id="quiz-close" style="margin-top: 10px; background: #999; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">退出测试</button>
      </div>
    </div>`;
    document.body.appendChild(modal);

    const chineseEl = document.getElementById('quiz-chinese');
    const inputEl = document.getElementById('quiz-input');
    const feedbackEl = document.getElementById('quiz-feedback');
    const submitBtn = document.getElementById('quiz-submit');
    const nextBtn = document.getElementById('quiz-next');
    const closeBtn = document.getElementById('quiz-close');

    function showQuestion() {
        if (index >= shuffled.length) {
            endQuiz();
            return;
        }
        const item = shuffled[index];
        chineseEl.textContent = item.meaning;
        inputEl.value = '';
        feedbackEl.textContent = '';
        submitBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        inputEl.focus();
    }

    submitBtn.onclick = function () {
        const answer = inputEl.value.trim().toLowerCase();
        const correctWord = shuffled[index].word.toLowerCase();

        if (answer === correctWord) {
            feedbackEl.innerHTML = `<span style="color:#4CAF50">✅ 正确！</span>`;
            correct++;
            nextBtn.style.display = 'inline-block';
        } else {
            feedbackEl.innerHTML = `<span style="color:#d32f2f">❌ 错误！正确答案是：<code>${correctWord}</code></span>`;
        }
        submitBtn.style.display = 'none';
    };

    nextBtn.onclick = function () {
        index++;
        showQuestion();
    };

    closeBtn.onclick = function () {
        document.body.removeChild(modal);
    };

    // 开始第一题
    showQuestion();
}

function endQuiz() {
    // 这里可以扩展为显示结果统计
    alert(`测试结束！你的成绩：${correct}/${shuffled.length}，正确率 ${Math.round(correct/shuffled.length*100)}%`);
    document.body.removeChild(document.getElementById('quiz-modal').parentElement);
}