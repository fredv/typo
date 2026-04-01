// === State ===
const state = {
  lang: 'en',          // 'en' | 'de' — controls course & UI language
  layout: 'us',        // 'us' | 'de' | 'us-umlaut' — controls visual keyboard only
  currentDay: 0,       // 0-indexed
  currentExercise: 0,
  charIndex: 0,
  errors: 0,
  totalChars: 0,
  startTime: null,
  timerInterval: null,
  finished: false,
  history: [],         // [{date, day, lesson, wpm, accuracy, time, errors}]
  completedDays: new Set(),
  isMistakePractice: false,
  // Mistake tracker: { word: { count: number, correct: number } }
  mistakes: {},
};

const CORRECT_THRESHOLD = 3;

// US+Umlauts: Option+key mapping (char → base key)
const UMLAUT_OPTION_MAP = {
  'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 's', '€': 'e',
  'Ä': 'a', 'Ö': 'o', 'Ü': 'u', 'ẞ': 's',
};

// === DOM refs ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const textContent = $('#text-content');
const typingInput = $('#typing-input');
const liveWpm = $('#live-wpm');
const liveAccuracy = $('#live-accuracy');
const liveTime = $('#live-time');
const currentDayEl = $('#current-day');
const currentLessonTitle = $('#current-lesson-title');
const layoutSelect = $('#layout-select');

function getCurriculum() {
  return state.lang === 'de' ? CURRICULUM_DE : CURRICULUM;
}

// === Persistence ===
function saveState() {
  const data = {
    lang: state.lang,
    layout: state.layout,
    currentDay: state.currentDay,
    history: state.history,
    completedDays: [...state.completedDays],
    mistakes: state.mistakes,
  };
  localStorage.setItem('typo-state', JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem('typo-state');
    if (!raw) return;
    const data = JSON.parse(raw);
    state.lang = data.lang || 'en';
    state.layout = data.layout || (data.lang === 'de' ? 'de' : 'us');
    state.currentDay = data.currentDay || 0;
    state.history = data.history || [];
    state.completedDays = new Set(data.completedDays || []);
    state.mistakes = data.mistakes || {};
  } catch (e) {
    console.warn('Failed to load state', e);
  }
}

// === i18n ===
function applyI18n() {
  $$('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  $$('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.getElementById('html-root').lang = state.lang === 'de' ? 'de' : 'en';
}

// === Language Toggle (course selection) ===
$$('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const newLang = btn.dataset.lang;
    if (newLang === state.lang) return;

    state.lang = newLang;
    $$('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Clamp currentDay to new curriculum length
    const cur = getCurriculum();
    if (state.currentDay >= cur.length) state.currentDay = 0;

    applyI18n();
    loadLesson(state.currentDay, 0);
    renderMistakeTrainer();
    saveState();
  });
});

// === Keyboard Layout Selector (visual keyboard only) ===
function showKeyboardForLayout(layout) {
  $('#keyboard-en').style.display = 'none';
  $('#keyboard-de').style.display = 'none';
  $('#keyboard-us-umlaut').style.display = 'none';

  if (layout === 'de') {
    $('#keyboard-de').style.display = '';
  } else if (layout === 'us-umlaut') {
    $('#keyboard-us-umlaut').style.display = '';
  } else {
    $('#keyboard-en').style.display = '';
  }
}

layoutSelect.addEventListener('change', () => {
  const newLayout = layoutSelect.value;
  if (newLayout === state.layout) return;

  state.layout = newLayout;
  showKeyboardForLayout(newLayout);

  // Re-highlight the current key for the new keyboard
  const text = getCurrentText();
  if (!state.finished && state.charIndex < text.length) {
    highlightNextKey(text, state.charIndex);
  }

  saveState();
});

// === Navigation ===
$$('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.view').forEach(v => v.classList.remove('active'));
    $(`#view-${btn.dataset.view}`).classList.add('active');

    if (btn.dataset.view === 'curriculum') renderCurriculum();
    if (btn.dataset.view === 'stats') renderStats();
    if (btn.dataset.view === 'practice') typingInput.focus();
  });
});

// === Lesson Loading ===
function loadLesson(dayIndex, exerciseIndex = 0) {
  state.isMistakePractice = false;
  const cur = getCurriculum();
  state.currentDay = dayIndex;
  state.currentExercise = exerciseIndex;
  state.charIndex = 0;
  state.errors = 0;
  state.totalChars = 0;
  state.startTime = null;
  state.finished = false;

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;

  const lesson = cur[dayIndex];
  currentDayEl.textContent = `${t('day')} ${lesson.day}`;
  currentLessonTitle.textContent = lesson.title;

  const text = lesson.exercises[exerciseIndex];
  renderText(text);

  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();

  liveWpm.textContent = '0';
  liveAccuracy.textContent = '100';
  liveTime.textContent = '0:00';

  highlightNextKey(text, 0);
  saveState();
}

function loadMistakePractice() {
  const words = getMistakeWords();
  if (words.length === 0) return;

  state.isMistakePractice = true;
  state.charIndex = 0;
  state.errors = 0;
  state.totalChars = 0;
  state.startTime = null;
  state.finished = false;

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;

  currentDayEl.textContent = t('mistakeTrainer');
  currentLessonTitle.textContent = t('mistakeDesc');

  const practiceWords = [];
  words.forEach(w => {
    const reps = Math.min(5, Math.max(2, state.mistakes[w].count));
    for (let i = 0; i < reps; i++) practiceWords.push(w);
  });
  for (let i = practiceWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [practiceWords[i], practiceWords[j]] = [practiceWords[j], practiceWords[i]];
  }

  const text = practiceWords.join(' ');
  renderText(text);

  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();

  liveWpm.textContent = '0';
  liveAccuracy.textContent = '100';
  liveTime.textContent = '0:00';

  highlightNextKey(text, 0);
}

function renderText(text) {
  textContent.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = `char ${i === 0 ? 'current' : 'pending'}`;
    span.textContent = text[i];
    textContent.appendChild(span);
  }
}

function getCurrentText() {
  if (state.isMistakePractice) {
    return Array.from(textContent.querySelectorAll('.char')).map(c => c.textContent).join('');
  }
  return getCurriculum()[state.currentDay].exercises[state.currentExercise];
}

// === Typing Logic ===
typingInput.addEventListener('input', (e) => {
  if (state.finished) return;

  const text = getCurrentText();
  const chars = textContent.querySelectorAll('.char');
  const typed = typingInput.value;

  if (!state.startTime) {
    state.startTime = Date.now();
    state.timerInterval = setInterval(updateTimer, 200);
  }

  let errors = 0;
  for (let i = 0; i < typed.length && i < text.length; i++) {
    if (typed[i] === text[i]) {
      chars[i].className = 'char correct';
    } else {
      chars[i].className = 'char incorrect';
      errors++;
    }
  }

  for (let i = typed.length; i < text.length; i++) {
    chars[i].className = `char ${i === typed.length ? 'current' : 'pending'}`;
  }

  state.charIndex = typed.length;
  state.errors = errors;
  state.totalChars = typed.length;

  updateLiveStats();

  if (typed.length < text.length) {
    highlightNextKey(text, typed.length);
  }

  if (typed.length >= text.length) {
    finishExercise();
  }
});

typingInput.addEventListener('paste', (e) => e.preventDefault());
$('#text-display').addEventListener('click', () => typingInput.focus());

function updateLiveStats() {
  if (!state.startTime) return;
  const elapsed = (Date.now() - state.startTime) / 1000;
  const minutes = elapsed / 60;
  const wordsTyped = state.totalChars / 5;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  const accuracy = state.totalChars > 0
    ? Math.round(((state.totalChars - state.errors) / state.totalChars) * 100)
    : 100;

  liveWpm.textContent = wpm;
  liveAccuracy.textContent = accuracy;
}

function updateTimer() {
  if (!state.startTime) return;
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  liveTime.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

function finishExercise() {
  state.finished = true;
  typingInput.disabled = true;
  if (state.timerInterval) clearInterval(state.timerInterval);

  const elapsed = (Date.now() - state.startTime) / 1000;
  const minutes = elapsed / 60;
  const text = getCurrentText();
  const typed = typingInput.value;
  const wordsTyped = text.length / 5;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  const accuracy = state.totalChars > 0
    ? Math.round(((state.totalChars - state.errors) / state.totalChars) * 100)
    : 100;

  const timeStr = formatTime(elapsed);

  trackMistakes(text, typed);

  $('#result-wpm').textContent = wpm;
  $('#result-accuracy').textContent = `${accuracy}%`;
  $('#result-time').textContent = timeStr;
  $('#result-errors').textContent = state.errors;

  let msg = '';
  if (accuracy >= 98 && wpm >= 40) msg = t('msgOutstanding');
  else if (accuracy >= 95 && wpm >= 30) msg = t('msgGreat');
  else if (accuracy >= 90) msg = t('msgGood');
  else if (accuracy >= 80) msg = t('msgNice');
  else msg = t('msgKeep');
  $('#results-message').textContent = msg;

  $('#results-modal').classList.remove('hidden');

  if (!state.isMistakePractice) {
    const cur = getCurriculum();
    const record = {
      date: new Date().toISOString(),
      day: state.currentDay + 1,
      lesson: cur[state.currentDay].title,
      exercise: state.currentExercise + 1,
      wpm,
      accuracy,
      time: elapsed,
      errors: state.errors,
      lang: state.lang,
    };
    state.history.push(record);

    const lesson = cur[state.currentDay];
    const isLastExercise = state.currentExercise >= lesson.exercises.length - 1;
    if (isLastExercise && accuracy >= 80) {
      state.completedDays.add(state.currentDay);
    }
  }

  saveState();
  clearKeyboardHighlights();
  renderMistakeTrainer();
}

// === Mistake Tracking ===
function trackMistakes(expected, typed) {
  const expectedWords = expected.split(/\s+/);
  const typedWords = typed.split(/\s+/);

  for (let i = 0; i < expectedWords.length; i++) {
    const ew = expectedWords[i];
    const tw = typedWords[i] || '';

    if (ew !== tw) {
      const key = ew.toLowerCase();
      if (!state.mistakes[key]) {
        state.mistakes[key] = { count: 0, correct: 0 };
      }
      state.mistakes[key].count++;
      state.mistakes[key].correct = 0;
    } else {
      const key = ew.toLowerCase();
      if (state.mistakes[key]) {
        state.mistakes[key].correct++;
        if (state.mistakes[key].correct >= CORRECT_THRESHOLD) {
          delete state.mistakes[key];
        }
      }
    }
  }
}

function getMistakeWords() {
  return Object.keys(state.mistakes).filter(w => state.mistakes[w].correct < CORRECT_THRESHOLD);
}

function renderMistakeTrainer() {
  const words = getMistakeWords();
  const container = $('#mistake-words');
  const countEl = $('#mistake-count');
  const practiceBtn = $('#btn-practice-mistakes');

  container.innerHTML = '';

  if (words.length === 0) {
    countEl.textContent = Object.keys(state.mistakes).length === 0
      ? t('noMistakes')
      : t('mistakesCleared');
    practiceBtn.style.display = 'none';
    return;
  }

  countEl.textContent = `${words.length} ${t('wordsToReview')}`;
  practiceBtn.style.display = '';

  const sorted = words.sort((a, b) => state.mistakes[b].count - state.mistakes[a].count);

  sorted.slice(0, 30).forEach(word => {
    const m = state.mistakes[word];
    const el = document.createElement('span');
    el.className = 'mistake-word';
    el.innerHTML = `${word} <span class="mistake-n">${m.count}</span>`;
    container.appendChild(el);
  });
}

$('#btn-practice-mistakes').addEventListener('click', () => {
  loadMistakePractice();
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// === Keyboard Highlighting ===
function getActiveKeyboard() {
  if (state.layout === 'de') return $('#keyboard-de');
  if (state.layout === 'us-umlaut') return $('#keyboard-us-umlaut');
  return $('#keyboard-en');
}

function highlightNextKey(text, index) {
  clearKeyboardHighlights();
  if (index >= text.length) return;

  const kb = getActiveKeyboard();
  const ch = text[index];
  const chLower = ch.toLowerCase();

  // For US+Umlauts layout: umlauts are typed via Option+base key
  if (state.layout === 'us-umlaut' && UMLAUT_OPTION_MAP[ch]) {
    const baseKey = UMLAUT_OPTION_MAP[ch];
    const keyEl = kb.querySelector(`.key[data-key="${CSS.escape(baseKey)}"]`);
    if (keyEl) keyEl.classList.add('highlight');
    // Highlight Option key
    const optKeys = kb.querySelectorAll('.key[data-key="Alt"]');
    optKeys.forEach(k => k.classList.add('highlight'));
    // Also highlight Shift for uppercase umlauts (Ä, Ö, Ü, ẞ)
    if (ch !== chLower && ch !== '€') {
      const shifts = kb.querySelectorAll('.key[data-key="ShiftLeft"], .key[data-key="ShiftRight"]');
      shifts.forEach(s => s.classList.add('highlight'));
    }
    return;
  }

  // Standard key highlighting
  const keyEl = kb.querySelector(`.key[data-key="${CSS.escape(chLower)}"]`);
  if (keyEl) keyEl.classList.add('highlight');

  // Highlight Shift for uppercase or shifted symbols
  if (ch !== chLower || '~!@#$%^&*()_+{}|:"<>?'.includes(ch)) {
    const shifts = kb.querySelectorAll('.key[data-key="ShiftLeft"], .key[data-key="ShiftRight"]');
    shifts.forEach(s => s.classList.add('highlight'));
  }
}

function clearKeyboardHighlights() {
  $$('.key.highlight').forEach(k => k.classList.remove('highlight'));
}

// Enter key to dismiss results modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('#results-modal').classList.contains('hidden')) {
    e.preventDefault();
    $('#results-modal').classList.add('hidden');
    advanceLesson();
    return;
  }
});

// Physical key press visual feedback
document.addEventListener('keydown', (e) => {
  const kb = getActiveKeyboard();
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.code;
  const keyEl = kb.querySelector(`.key[data-key="${CSS.escape(key)}"]`)
    || kb.querySelector(`.key[data-key="${CSS.escape(e.key)}"]`);
  if (keyEl) keyEl.classList.add('pressed');
});

document.addEventListener('keyup', (e) => {
  const kb = getActiveKeyboard();
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.code;
  const keyEl = kb.querySelector(`.key[data-key="${CSS.escape(key)}"]`)
    || kb.querySelector(`.key[data-key="${CSS.escape(e.key)}"]`);
  if (keyEl) keyEl.classList.remove('pressed');
});

// === Button Handlers ===
$('#btn-restart').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  if (state.isMistakePractice) {
    loadMistakePractice();
  } else {
    loadLesson(state.currentDay, state.currentExercise);
  }
});

$('#btn-retry').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  if (state.isMistakePractice) {
    loadMistakePractice();
  } else {
    loadLesson(state.currentDay, state.currentExercise);
  }
});

$('#btn-next').addEventListener('click', advanceLesson);
$('#btn-continue').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  advanceLesson();
});

function advanceLesson() {
  if (state.isMistakePractice) {
    loadLesson(state.currentDay, state.currentExercise);
    $('#results-modal').classList.add('hidden');
    return;
  }
  const cur = getCurriculum();
  const lesson = cur[state.currentDay];
  if (state.currentExercise < lesson.exercises.length - 1) {
    loadLesson(state.currentDay, state.currentExercise + 1);
  } else if (state.currentDay < cur.length - 1) {
    loadLesson(state.currentDay + 1, 0);
  } else {
    loadLesson(cur.length - 1, 0);
  }
  $('#results-modal').classList.add('hidden');
}

// === Curriculum View ===
function renderCurriculum() {
  const list = $('#curriculum-list');
  list.innerHTML = '';
  const cur = getCurriculum();

  cur.forEach((lesson, i) => {
    const card = document.createElement('div');
    const isCompleted = state.completedDays.has(i);
    const isCurrent = i === state.currentDay;
    const isLocked = i > state.currentDay + 1 && !isCompleted && !state.completedDays.has(i - 1);

    let cls = 'day-card';
    if (isCompleted) cls += ' completed';
    if (isCurrent) cls += ' current-day-card';
    if (isLocked) cls += ' locked';
    card.className = cls;

    const dayRecords = state.history.filter(r => r.day === lesson.day && (r.lang || 'en') === state.lang);
    const bestWpm = dayRecords.length > 0 ? Math.max(...dayRecords.map(r => r.wpm)) : null;

    card.innerHTML = `
      <div class="day-num">${lesson.day}</div>
      <div class="day-info">
        <div class="day-title">${lesson.title}</div>
        <div class="day-desc">${lesson.desc}</div>
      </div>
      <div class="day-badge">${isCompleted ? '&#10003;' : ''} ${bestWpm !== null ? bestWpm + ' WPM' : ''}</div>
    `;

    if (!isLocked) {
      card.addEventListener('click', () => {
        loadLesson(i, 0);
        $$('.nav-btn').forEach(b => b.classList.remove('active'));
        $$('.nav-btn')[0].classList.add('active');
        $$('.view').forEach(v => v.classList.remove('active'));
        $('#view-practice').classList.add('active');
      });
    }

    list.appendChild(card);
  });
}

// === Stats View ===
function renderStats() {
  const h = state.history.filter(r => (r.lang || 'en') === state.lang);
  if (h.length === 0) {
    $('#stat-best-wpm').textContent = '0';
    $('#stat-avg-wpm').textContent = '0';
    $('#stat-avg-accuracy').textContent = '0%';
    $('#stat-lessons-done').textContent = '0';
    $('#stat-total-time').textContent = '0m';
    $('#stat-streak').textContent = '0';
    $('#history-body').innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-dim)">${t('noDataYet')}</td></tr>`;
    drawChart([]);
    return;
  }

  const bestWpm = Math.max(...h.map(r => r.wpm));
  const avgWpm = Math.round(h.reduce((s, r) => s + r.wpm, 0) / h.length);
  const avgAcc = Math.round(h.reduce((s, r) => s + r.accuracy, 0) / h.length);
  const totalTime = h.reduce((s, r) => s + r.time, 0);
  const totalMin = Math.round(totalTime / 60);

  const streak = calculateStreak(h);

  $('#stat-best-wpm').textContent = bestWpm;
  $('#stat-avg-wpm').textContent = avgWpm;
  $('#stat-avg-accuracy').textContent = `${avgAcc}%`;
  $('#stat-lessons-done').textContent = state.completedDays.size;
  $('#stat-total-time').textContent = totalMin >= 60 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : `${totalMin}m`;
  $('#stat-streak').textContent = streak;

  const tbody = $('#history-body');
  tbody.innerHTML = '';
  [...h].reverse().slice(0, 50).forEach(r => {
    const row = document.createElement('tr');
    const date = new Date(r.date);
    row.innerHTML = `
      <td>${date.toLocaleDateString()}</td>
      <td>${t('day')} ${r.day}: Ex ${r.exercise || 1}</td>
      <td>${r.wpm}</td>
      <td>${r.accuracy}%</td>
      <td>${formatTime(r.time)}</td>
    `;
    tbody.appendChild(row);
  });

  drawChart(h);
}

function calculateStreak(history) {
  const dates = [...new Set(history.map(r => new Date(r.date).toDateString()))];
  if (dates.length === 0) return 0;

  const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastPractice = new Date(sorted[0]);
  lastPractice.setHours(0, 0, 0, 0);

  const diffFromToday = (today - lastPractice) / (1000 * 60 * 60 * 24);
  if (diffFromToday > 1) return 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function drawChart(history) {
  const canvas = $('#chart-wpm');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  if (history.length < 2) {
    ctx.fillStyle = '#8b8fa3';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(t('chartEmpty'), w / 2, h / 2);
    return;
  }

  const wpms = history.map(r => r.wpm);
  const maxWpm = Math.max(...wpms, 20);
  const minWpm = Math.min(...wpms);

  ctx.strokeStyle = '#2e3340';
  ctx.lineWidth = 1;
  const gridSteps = 5;
  for (let i = 0; i <= gridSteps; i++) {
    const y = pad.top + (plotH / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();

    const val = Math.round(maxWpm - (maxWpm - minWpm + 10) * (i / gridSteps));
    ctx.fillStyle = '#8b8fa3';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(val, pad.left - 8, y + 4);
  }

  const rangeY = (maxWpm - minWpm + 10) || 1;
  ctx.beginPath();
  ctx.strokeStyle = '#6c8cff';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';

  wpms.forEach((wpm, i) => {
    const x = pad.left + (i / (wpms.length - 1)) * plotW;
    const y = pad.top + plotH - ((wpm - minWpm + 5) / rangeY) * plotH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  wpms.forEach((wpm, i) => {
    const x = pad.left + (i / (wpms.length - 1)) * plotW;
    const y = pad.top + plotH - ((wpm - minWpm + 5) / rangeY) * plotH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#6c8cff';
    ctx.fill();
  });

  ctx.fillStyle = '#8b8fa3';
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(t('sessions'), w / 2, h - 5);
}

// === Reset Data ===
$('#btn-reset-data').addEventListener('click', () => {
  if (confirm(t('resetConfirm'))) {
    localStorage.removeItem('typo-state');
    state.currentDay = 0;
    state.history = [];
    state.completedDays = new Set();
    state.mistakes = {};
    loadLesson(0, 0);
    renderStats();
    renderMistakeTrainer();
  }
});

// === Init ===
loadState();

// Apply saved language toggle
$$('.lang-btn').forEach(b => b.classList.remove('active'));
$(`.lang-btn[data-lang="${state.lang}"]`).classList.add('active');

// Apply saved keyboard layout
layoutSelect.value = state.layout;
showKeyboardForLayout(state.layout);

applyI18n();
loadLesson(state.currentDay, 0);
renderMistakeTrainer();
