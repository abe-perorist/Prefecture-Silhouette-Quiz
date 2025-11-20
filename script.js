// グローバル変数
let allPrefectures = []; // { code, name, originalNode }
let clearedPrefectures = []; // codeの配列
let currentQuestion = null;
let isQuizActive = false;

// LocalStorageキー
const STORAGE_KEY = 'prefecture-quiz-cleared-v2';

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async function() {
    await initGame();
});

// ゲームの初期化
async function initGame() {
    try {
        // SVG地図の読み込み
        const response = await fetch('japan_map.svg');
        const svgText = await response.text();
        
        // 地図コンテナに挿入
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = svgText;
        
        // SVG要素の調整
        const svgElement = mapContainer.querySelector('svg');
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
        
        // 都道府県データの抽出
        extractPrefectureData();
        
        // 保存された進捗の読み込み
        loadProgress();
        
        // 地図の初期状態更新
        updateMapDisplay();
        
        // クイズ開始
        startNextQuestion();
        
    } catch (error) {
        console.error('初期化エラー:', error);
        alert('地図データの読み込みに失敗しました。ページをリロードしてください。');
    }
}

// 都道府県データをSVGから抽出
function extractPrefectureData() {
    const prefectureNodes = document.querySelectorAll('.geolonia-svg-map .prefecture');
    
    allPrefectures = Array.from(prefectureNodes).map(node => {
        const code = node.getAttribute('data-code');
        const title = node.querySelector('title').textContent;
        // "北海道 / Hokkaido" のような形式から日本語名を取得
        const name = title.split('/')[0].trim();
        
        return {
            code: code,
            name: name,
            node: node
        };
    });
}

// 進捗の読み込み
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        clearedPrefectures = JSON.parse(saved);
    }
    updateStats();
}

// 進捗の保存
function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clearedPrefectures));
    updateStats();
}

// 統計表示の更新
function updateStats() {
    const count = clearedPrefectures.length;
    const total = allPrefectures.length;
    const percentage = Math.round((count / total) * 100);
    
    document.getElementById('score-display').textContent = `正解数: ${count} / ${total}`;
    document.getElementById('completion-rate').textContent = `制覇率: ${percentage}%`;
    
    // 地図の更新
    updateMapDisplay();
}

// 地図の表示更新（正解済みを色付け）
function updateMapDisplay() {
    const allNodes = document.querySelectorAll('.geolonia-svg-map .prefecture');
    allNodes.forEach(node => {
        const code = node.getAttribute('data-code');
        if (clearedPrefectures.includes(code)) {
            node.classList.add('cleared');
        } else {
            node.classList.remove('cleared');
        }
    });
}

// 次の問題を開始
function startNextQuestion() {
    // 未クリアの都道府県をフィルタリング
    const uncleared = allPrefectures.filter(p => !clearedPrefectures.includes(p.code));
    
    if (uncleared.length === 0) {
        gameClear();
        return;
    }
    
    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * uncleared.length);
    currentQuestion = uncleared[randomIndex];
    
    // 問題番号更新
    const currentNum = clearedPrefectures.length + 1;
    document.getElementById('question-number').textContent = `問題 ${currentNum} / 47`;
    
    // シルエット表示
    renderSilhouette(currentQuestion);
    
    // 選択肢生成
    generateChoices(currentQuestion);
    
    // UIリセット
    document.getElementById('feedback').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
    isQuizActive = true;
}

// シルエットを描画
function renderSilhouette(prefecture) {
    const svgContainer = document.getElementById('silhouette-svg');
    svgContainer.innerHTML = ''; // クリア
    
    // ノードをクローンして挿入
    const clone = prefecture.node.cloneNode(true);
    
    // クラスや属性を調整
    clone.removeAttribute('transform'); // 個別のtransformは維持しつつ、親のtransformの影響を考慮する必要がある
    // しかし、geoloniaのSVGは親のg要素にtransformがかかっている
    // 単純にpath/polygonの座標からbboxを計算してviewBoxを合わせるのが確実
    
    svgContainer.appendChild(clone);
    
    // バウンディングボックスを計算してviewBoxを設定
    const bbox = calculateBBox(clone);
    if (bbox) {
        // 余白を持たせる
        const padding = Math.max(bbox.width, bbox.height) * 0.1;
        const x = bbox.x - padding;
        const y = bbox.y - padding;
        const width = bbox.width + padding * 2;
        const height = bbox.height + padding * 2;
        
        svgContainer.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    }
}

// SVG要素のバウンディングボックスを計算（簡易版）
function calculateBBox(element) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    const polygons = element.querySelectorAll('polygon');
    const paths = element.querySelectorAll('path');
    
    // Polygonの処理
    polygons.forEach(poly => {
        const points = poly.getAttribute('points').trim().split(/\s+/);
        for (let i = 0; i < points.length; i++) {
            // "x,y" または "x y" 形式に対応
            const coords = points[i].split(',');
            let x, y;
            if (coords.length === 2) {
                x = parseFloat(coords[0]);
                y = parseFloat(coords[1]);
            } else if (i + 1 < points.length) {
                x = parseFloat(points[i]);
                y = parseFloat(points[i+1]);
                i++; // 次の要素はyなのでスキップ
            } else {
                continue;
            }
            
            if (!isNaN(x)) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            if (!isNaN(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
    });
    
    // Pathの処理（簡易的なMコマンドとLコマンドのみ対応）
    // 複雑なカーブがある場合は正確ではないが、都道府県シルエットなら概ね大丈夫
    paths.forEach(path => {
        const d = path.getAttribute('d');
        // 数字の羅列を抽出
        const numbers = d.match(/-?\d+(\.\d+)?/g);
        if (numbers) {
            for (let i = 0; i < numbers.length; i += 2) {
                const x = parseFloat(numbers[i]);
                const y = parseFloat(numbers[i+1]);
                
                if (!isNaN(x)) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                }
                if (!isNaN(y)) {
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }
    });
    
    if (minX === Infinity) return null;
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

// 選択肢を生成
function generateChoices(correctPref) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    
    // 正解以外の都道府県リスト
    const otherPrefs = allPrefectures.filter(p => p.code !== correctPref.code);
    
    // ランダムに3つ選ぶ
    const wrongChoices = [];
    while (wrongChoices.length < 3) {
        const random = otherPrefs[Math.floor(Math.random() * otherPrefs.length)];
        if (!wrongChoices.includes(random)) {
            wrongChoices.push(random);
        }
    }
    
    // 正解と混ぜる
    const choices = [correctPref, ...wrongChoices];
    // シャッフル
    choices.sort(() => Math.random() - 0.5);
    
    // ボタン生成
    choices.forEach(pref => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = pref.name;
        btn.onclick = () => submitAnswer(pref, btn);
        container.appendChild(btn);
    });
}

// 回答送信
function submitAnswer(selectedPref, btnElement) {
    if (!isQuizActive) return;
    isQuizActive = false;
    
    const isCorrect = selectedPref.code === currentQuestion.code;
    const feedback = document.getElementById('feedback');
    const allBtns = document.querySelectorAll('.choice-btn');
    
    // ボタンの無効化と正解表示
    allBtns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentQuestion.name) {
            btn.classList.add('correct-answer');
        }
    });
    
    if (isCorrect) {
        btnElement.classList.add('correct-answer');
        feedback.textContent = '⭕ 正解！';
        feedback.className = 'feedback correct';
        
        // 進捗保存
        clearedPrefectures.push(currentQuestion.code);
        saveProgress();
        
        // 次へボタン表示
        setTimeout(() => {
            nextQuestion();
        }, 1000); // 正解時は自動で次へ（1秒後）
        
    } else {
        btnElement.classList.add('wrong-answer');
        feedback.textContent = `❌ 残念... 正解は「${currentQuestion.name}」でした`;
        feedback.className = 'feedback incorrect';
        
        // 不正解時はボタンを表示して手動で次へ
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

// 次の問題へ（ボタン用）
function nextQuestion() {
    startNextQuestion();
}

// ゲームクリア
function gameClear() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
}

// リセット
function resetProgress() {
    if (confirm('これまでの記録を削除して最初から始めますか？')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

