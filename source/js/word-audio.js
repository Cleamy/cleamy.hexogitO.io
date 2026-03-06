// word-audio.js - 英语单词听读弹窗（完全独立，无需 import，兼容所有 Hexo 主题）
document.addEventListener('DOMContentLoaded', function () {
    
    
    // 仅在指定页面运行
    const pageTitle = document.querySelector('.post-meta__tag-list');
    const pageCategory = document.querySelector('.post-meta-categories');
    if (!(!pageTitle || !(pageTitle.textContent.trim().includes(['英语单词'])) ||
        !pageCategory || !(pageCategory.textContent.trim().includes(['英语单词'])))) {
        return;
    }
    

    // 找到所有表格并添加“听读”按钮
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;

            const word = cells[0].textContent.trim();
            const meaning = cells[1].textContent.trim();
            const actionCell = cells[3]; // 第三列用于放按钮


            // ✅ 直接清空第三列，并插入测试按钮（不再判断 [test]）
            actionCell.innerHTML = ''; // 清空原有内容
            // 添加到表格
            // 创建按钮
            const listenBtn = document.createElement('button');
            listenBtn.textContent = '🔊 听读';
            listenBtn.style.cssText = `
                margin:2px;
                padding:4px 8px;
                font-size:12px;
                background:#4CAF50;
                color:white;
                border:none;
                border-radius:4px;
                cursor:pointer;
            `;

            // 添加到表格
            // const actionCell = document.createElement('td');
            // actionCell.appendChild(listenBtn);
            // row.appendChild(actionCell);

            // 点击事件
            listenBtn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                showListenModal(word, meaning);
            };
            actionCell.appendChild(listenBtn);
        });
    });

    // 缓存机制
    function getCached(key) {
        const cached = localStorage.getItem(key);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < 86400000) { // 24小时
                    return data.result;
                }
            } catch (e) {}
        }
        return null;
    }

    function setCached(key, result) {
        localStorage.setItem(key, JSON.stringify({ result, timestamp: Date.now() }));
    }

    // 请求 API 获取单词数据
    async function fetchFromXxApi(word) {
        const cacheKey = `word_audio_xxapi_${word}`;
        const cached = getCached(cacheKey);
        if (cached) return cached;

        const url = `https://v2.xxapi.cn/api/englishwords?word=${encodeURIComponent(word)}`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                mode: 'cors'
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            if (json.code !== 200) throw new Error(json.msg || 'API error');

            const data = json.data;

            const result = {
                phonetic: data.usphone ? `/ ${data.usphone} /` : '暂无音标',
                ukPhonetic: data.ukphone ? `/ ${data.ukphone} /` : '',
                audioSrc: data.usspeech || null,
                ukAudioSrc: data.ukspeech || null,
                translation: data.translations?.map(t => t.tran_cn).join('; ') || '暂无释义',
                sentences: data.sentences || [],
                phrases: data.phrases || []
            };

            setCached(cacheKey, result);
            return result;
        } catch (err) {
            console.warn(`[xxapi.cn 失败] ${word}`, err);
            return {
                phonetic: '暂无音标',
                ukPhonetic: '',
                audioSrc: null,
                ukAudioSrc: null,
                translation: '暂无释义',
                sentences: [],
                phrases: []
            };
        }
    }

    // 显示弹窗
    function showListenModal(word, meaning) {
        // 防止重复打开
        if (document.getElementById('listen-modal')) {
            document.getElementById('listen-modal').remove();
        }

        // 创建弹窗 HTML
        const modal = document.createElement('div');
        modal.id = 'listen-modal';
        modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
          <div style="
            background: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 500px;
            text-align: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            user-select: none;
            color: black; /* 👈 强制黑色文字 */
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          ">
            <h3 style="color:#1a73e8; margin-top: 0;">🔊 发音学习</h3>
            <p><strong>单词：</strong><span style="font-size:1.3em; color:#1976D2;">${word}</span></p>
            <p><strong>美式音标：</strong><code id="modal-phonetic">加载中...</code></p>
            <p><strong>英式音标：</strong><code id="modal-uk-phonetic"></code></p>
            <p><strong>释义：</strong><span id="modal-meaning">${meaning}</span></p>

            <div style="margin:12px 0;">
              <button id="speak-us" style="
                padding:8px 16px;
                background:#f44336;
                color:white;
                border:none;
                border-radius:4px;
                margin:0 5px;
              ">🇺🇸 美音播放</button>
              <button id="speak-uk" style="
                padding:8px 16px;
                background:#2196f3;
                color:white;
                border:none;
                border-radius:4px;
                margin:0 5px;
              ">🇬🇧 英音播放</button>
            </div>

            <details style="text-align:left; margin:10px 0;">
              <summary style="cursor:pointer; font-weight:bold; color:#1a73e8;">📌 例句</summary>
              <ul id="sentence-list" style="font-size:14px; line-height:1.6; color:black; padding-left:20px;"></ul>
            </details>

            <details style="text-align:left; margin:10px 0;">
              <summary style="cursor:pointer; font-weight:bold; color:#1a73e8;">📘 常见短语</summary>
              <ul id="phrase-list" style="font-size:14px; line-height:1.6; color:black; padding-left:20px;"></ul>
            </details>

            <button id="close-btn" style="
              padding:10px 20px;
              background:#999;
              color:white;
              border:none;
              border-radius:6px;
              margin-top:10px;
            ">❌ 关闭</button>
          </div>
        </div>`;

        // 添加到页面
        document.body.appendChild(modal);

        // 获取 DOM 元素
        const phoneticEl = document.getElementById('modal-phonetic');
        const ukPhoneticEl = document.getElementById('modal-uk-phonetic');
        const meaningEl = document.getElementById('modal-meaning');
        const speakUsBtn = document.getElementById('speak-us');
        const speakUkBtn = document.getElementById('speak-uk');
        const closeBtn = document.getElementById('close-btn');
        const sentenceList = document.getElementById('sentence-list');
        const phraseList = document.getElementById('phrase-list');

        // 请求数据并填充
        fetchFromXxApi(word).then(data => {
            phoneticEl.textContent = data.phonetic;
            ukPhoneticEl.textContent = data.ukPhonetic || '';
            meaningEl.textContent = data.translation;

            // 填充例句
            sentenceList.innerHTML = '';
            if (data.sentences.length > 0) {
                data.sentences.slice(0, 3).forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = `<em>${s.s_content}</em><br><small>${s.s_cn}</small>`;
                    sentenceList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = '暂无例句';
                sentenceList.appendChild(li);
            }

            // 填充短语
            phraseList.innerHTML = '';
            if (data.phrases.length > 0) {
                data.phrases.slice(0, 5).forEach(p => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${p.p_content}</strong> — ${p.p_cn}`;
                    phraseList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = '暂无短语';
                phraseList.appendChild(li);
            }

            // 播放美音
            if (data.audioSrc) {
                const audioUs = new Audio(data.audioSrc);
                speakUsBtn.onclick = () => {
                    audioUs.play().catch(err => console.error('播放失败:', err));
                };
            } else {
                speakUsBtn.disabled = true;
                speakUsBtn.style.opacity = '0.6';
            }

            // 播放英音
            if (data.ukAudioSrc) {
                const audioUk = new Audio(data.ukAudioSrc);
                speakUkBtn.onclick = () => {
                    audioUk.play().catch(err => console.error('播放失败:', err));
                };
            } else {
                speakUkBtn.disabled = true;
                speakUkBtn.style.opacity = '0.6';
            }
        });

        // 关闭弹窗
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };

        // 点击遮罩关闭
        modal.querySelector('div').onclick = (e) => {
            if (e.target === modal.querySelector('div')) {
                document.body.removeChild(modal);
            }
        };
    }
});