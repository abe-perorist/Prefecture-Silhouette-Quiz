// 都道府県クイズデータ
const quizData = [
  {
    id: 1,
    answer: "北海道",
    image: "images/hokkaido_silhouette.png",
    incorrect_choices: ["青森県", "沖縄県", "福岡県"]
  },
  {
    id: 2,
    answer: "京都府",
    image: "images/kyoto_silhouette.png",
    incorrect_choices: ["奈良県", "大阪府", "滋賀県"]
  },
  {
    id: 3,
    answer: "東京都",
    image: "images/tokyo_silhouette.png",
    incorrect_choices: ["神奈川県", "千葉県", "埼玉県"]
  },
  {
    id: 4,
    answer: "沖縄県",
    image: "images/okinawa_silhouette.png",
    incorrect_choices: ["鹿児島県", "長崎県", "宮崎県"]
  },
  {
    id: 5,
    answer: "長野県",
    image: "images/nagano_silhouette.png",
    incorrect_choices: ["山梨県", "岐阜県", "群馬県"]
  },
  {
    id: 6,
    answer: "大阪府",
    image: "images/osaka_silhouette.png",
    incorrect_choices: ["兵庫県", "京都府", "奈良県"]
  },
  {
    id: 7,
    answer: "福岡県",
    image: "images/fukuoka_silhouette.png",
    incorrect_choices: ["佐賀県", "熊本県", "大分県"]
  }
];

// グローバル変数
let currentQuestionIndex = 0;
let usedQuestions = [];
let correctCount = 0;
let totalQuestions = 5; // 1ゲームあたりの問題数
let currentAnswer = "";
let selectedChoice = null;

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
  initQuiz();
});

// クイズの初期化
function initQuiz() {
  currentQuestionIndex = 0;
  usedQuestions = [];
  correctCount = 0;
  selectedChoice = null;
  
  document.getElementById('quiz-container').style.display = 'block';
  document.getElementById('result-container').style.display = 'none';
  
  loadNextQuestion();
}

// 次の問題を読み込む
function loadNextQuestion() {
  // 全問題が終了したか確認
  if (currentQuestionIndex >= totalQuestions) {
    showFinalResult();
    return;
  }
  
  // まだ使っていない問題からランダムに選択
  let availableQuestions = quizData.filter(q => !usedQuestions.includes(q.id));
  
  // 全問題を使い切った場合はリセット
  if (availableQuestions.length === 0) {
    usedQuestions = [];
    availableQuestions = quizData;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const currentQuestion = availableQuestions[randomIndex];
  
  usedQuestions.push(currentQuestion.id);
  currentAnswer = currentQuestion.answer;
  
  // 問題番号を更新
  document.getElementById('question-number').textContent = `問題 ${currentQuestionIndex + 1} / ${totalQuestions}`;
  
  // 画像を表示
  const silhouetteImg = document.getElementById('silhouette-image');
  silhouetteImg.src = currentQuestion.image;
  silhouetteImg.alt = `都道府県のシルエット`;
  
  // 選択肢を生成
  generateChoices(currentQuestion);
  
  // フィードバックをクリア
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  
  // ボタンの状態をリセット
  document.getElementById('submit-btn').style.display = 'inline-block';
  document.getElementById('next-btn').style.display = 'none';
  
  selectedChoice = null;
}

// 選択肢を生成（4択）
function generateChoices(question) {
  const choicesContainer = document.getElementById('choices-container');
  choicesContainer.innerHTML = '';
  
  // 正解と誤答を混ぜる
  const allChoices = [question.answer, ...question.incorrect_choices];
  
  // シャッフル
  const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);
  
  // 選択肢ボタンを生成
  shuffledChoices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.className = 'choice-btn';
    button.textContent = choice;
    button.onclick = () => selectChoice(choice, button);
    choicesContainer.appendChild(button);
  });
}

// 選択肢を選択
function selectChoice(choice, buttonElement) {
  // 以前の選択を解除
  const allButtons = document.querySelectorAll('.choice-btn');
  allButtons.forEach(btn => btn.classList.remove('selected'));
  
  // 新しい選択を適用
  buttonElement.classList.add('selected');
  selectedChoice = choice;
}

// 回答を送信
function submitAnswer() {
  if (selectedChoice === null) {
    alert('選択肢を選んでください！');
    return;
  }
  
  const feedback = document.getElementById('feedback');
  
  if (selectedChoice === currentAnswer) {
    feedback.textContent = '⭕ 正解です！';
    feedback.className = 'feedback correct';
    correctCount++;
  } else {
    feedback.textContent = `❌ 不正解です。正解は「${currentAnswer}」でした。`;
    feedback.className = 'feedback incorrect';
  }
  
  // ボタンの表示を切り替え
  document.getElementById('submit-btn').style.display = 'none';
  const nextBtn = document.getElementById('next-btn');
  nextBtn.style.display = 'inline-block';
  
  // 最終問題かどうかで文言を変更
  if (currentQuestionIndex + 1 >= totalQuestions) {
    nextBtn.textContent = '結果を確認する 🎯';
  } else {
    nextBtn.textContent = '次の問題へ →';
  }
  
  // 選択肢ボタンを無効化
  const allButtons = document.querySelectorAll('.choice-btn');
  allButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === currentAnswer) {
      btn.classList.add('correct-answer');
    }
  });
}

// 次の問題へ
function nextQuestion() {
  currentQuestionIndex++;
  loadNextQuestion();
}

// 最終結果を表示
function showFinalResult() {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  document.getElementById('final-score').textContent = 
    `${totalQuestions}問中 ${correctCount}問正解でした！`;
  document.getElementById('accuracy').textContent = 
    `正答率: ${percentage}%`;
  
  // 評価コメント
  let comment = '';
  if (percentage === 100) {
    comment = '完璧です！素晴らしい！🎉';
  } else if (percentage >= 80) {
    comment = 'とても良くできました！👏';
  } else if (percentage >= 60) {
    comment = 'もう少し頑張りましょう！💪';
  } else {
    comment = '次回は頑張りましょう！📚';
  }
  document.getElementById('comment').textContent = comment;
}

// もう一度挑戦
function restartQuiz() {
  initQuiz();
}

