// === State ===
const state = {
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

// === Persistence ===
function saveState() {
  const data = {
    currentDay: state.currentDay,
    history: state.history,
    completedDays: [...state.completedDays],
  };
  localStorage.setItem('typo-state', JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem('typo-state');
    if (!raw) return;
    const data = JSON.parse(raw);
    state.currentDay = data.currentDay || 0;
    state.history = data.history || [];
    state.completedDays = new Set(data.completedDays || []);
  } catch (e) {
    console.warn('Failed to load state', e);
  }
}

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
  state.currentDay = dayIndex;
  state.currentExercise = exerciseIndex;
  state.charIndex = 0;
  state.errors = 0;
  state.totalChars = 0;
  state.startTime = null;
  state.finished = false;

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;

  const lesson = CURRICULUM[dayIndex];
  currentDayEl.textContent = `Day ${lesson.day}`;
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
  return CURRICULUM[state.currentDay].exercises[state.currentExercise];
}

// === Typing Logic ===
typingInput.addEventListener('input', (e) => {
  if (state.finished) return;

  const text = getCurrentText();
  const chars = textContent.querySelectorAll('.char');
  const typed = typingInput.value;

  // Start timer on first input
  if (!state.startTime) {
    state.startTime = Date.now();
    state.timerInterval = setInterval(updateTimer, 200);
  }

  // Process all typed characters
  let errors = 0;
  for (let i = 0; i < typed.length && i < text.length; i++) {
    if (typed[i] === text[i]) {
      chars[i].className = 'char correct';
    } else {
      chars[i].className = 'char incorrect';
      errors++;
    }
  }

  // Mark remaining as pending
  for (let i = typed.length; i < text.length; i++) {
    chars[i].className = `char ${i === typed.length ? 'current' : 'pending'}`;
  }

  state.charIndex = typed.length;
  state.errors = errors;
  state.totalChars = typed.length;

  // Update live stats
  updateLiveStats();

  // Highlight the next key on the virtual keyboard
  if (typed.length < text.length) {
    highlightNextKey(text, typed.length);
  }

  // Check completion
  if (typed.length >= text.length) {
    finishExercise();
  }
});

// Prevent paste
typingInput.addEventListener('paste', (e) => e.preventDefault());

// Click on text display focuses input
$('#text-display').addEventListener('click', () => typingInput.focus());

function updateLiveStats() {
  if (!state.startTime) return;
  const elapsed = (Date.now() - state.startTime) / 1000;
  const minutes = elapsed / 60;
  const wordsTyped = state.totalChars / 5; // Standard: 1 word = 5 chars
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
  const wordsTyped = text.length / 5;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
  const accuracy = state.totalChars > 0
    ? Math.round(((state.totalChars - state.errors) / state.totalChars) * 100)
    : 100;

  const timeStr = formatTime(elapsed);

  // Show results modal
  $('#result-wpm').textContent = wpm;
  $('#result-accuracy').textContent = `${accuracy}%`;
  $('#result-time').textContent = timeStr;
  $('#result-errors').textContent = state.errors;

  // Message based on performance
  let msg = '';
  if (accuracy >= 98 && wpm >= 40) msg = 'Outstanding! You are typing like a pro!';
  else if (accuracy >= 95 && wpm >= 30) msg = 'Great job! Your accuracy and speed are excellent.';
  else if (accuracy >= 90) msg = 'Good work! Keep focusing on accuracy — speed will follow.';
  else if (accuracy >= 80) msg = 'Nice effort. Try slowing down a bit to reduce errors.';
  else msg = 'Keep practicing! Focus on hitting the right keys, even if it feels slow.';
  $('#results-message').textContent = msg;

  $('#results-modal').classList.remove('hidden');

  // Save to history
  const record = {
    date: new Date().toISOString(),
    day: state.currentDay + 1,
    lesson: CURRICULUM[state.currentDay].title,
    exercise: state.currentExercise + 1,
    wpm,
    accuracy,
    time: elapsed,
    errors: state.errors,
  };
  state.history.push(record);

  // Mark day as completed if all exercises done or accuracy >= 80%
  const lesson = CURRICULUM[state.currentDay];
  const isLastExercise = state.currentExercise >= lesson.exercises.length - 1;
  if (isLastExercise && accuracy >= 80) {
    state.completedDays.add(state.currentDay);
  }

  saveState();
  clearKeyboardHighlights();
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// === Keyboard Highlighting ===
function highlightNextKey(text, index) {
  clearKeyboardHighlights();
  if (index >= text.length) return;

  const nextChar = text[index].toLowerCase();
  const keyEl = document.querySelector(`.key[data-key="${CSS.escape(nextChar)}"]`);
  if (keyEl) keyEl.classList.add('highlight');

  // Also highlight shift if needed
  const original = text[index];
  if (original !== original.toLowerCase() || '~!@#$%^&*()_+{}|:"<>?'.includes(original)) {
    const shifts = document.querySelectorAll('.key[data-key="ShiftLeft"], .key[data-key="ShiftRight"]');
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
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.code;
  const keyEl = document.querySelector(`.key[data-key="${CSS.escape(key)}"]`)
    || document.querySelector(`.key[data-key="${CSS.escape(e.key)}"]`);
  if (keyEl) keyEl.classList.add('pressed');
});

document.addEventListener('keyup', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.code;
  const keyEl = document.querySelector(`.key[data-key="${CSS.escape(key)}"]`)
    || document.querySelector(`.key[data-key="${CSS.escape(e.key)}"]`);
  if (keyEl) keyEl.classList.remove('pressed');
});

// === Button Handlers ===
$('#btn-restart').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  loadLesson(state.currentDay, state.currentExercise);
});

$('#btn-retry').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  loadLesson(state.currentDay, state.currentExercise);
});

$('#btn-next').addEventListener('click', advanceLesson);
$('#btn-continue').addEventListener('click', () => {
  $('#results-modal').classList.add('hidden');
  advanceLesson();
});

function advanceLesson() {
  const lesson = CURRICULUM[state.currentDay];
  if (state.currentExercise < lesson.exercises.length - 1) {
    loadLesson(state.currentDay, state.currentExercise + 1);
  } else if (state.currentDay < CURRICULUM.length - 1) {
    loadLesson(state.currentDay + 1, 0);
  } else {
    // Completed all lessons — reload day 30
    loadLesson(CURRICULUM.length - 1, 0);
  }
  $('#results-modal').classList.add('hidden');
}

// === Curriculum View ===
function renderCurriculum() {
  const list = $('#curriculum-list');
  list.innerHTML = '';

  CURRICULUM.forEach((lesson, i) => {
    const card = document.createElement('div');
    const isCompleted = state.completedDays.has(i);
    const isCurrent = i === state.currentDay;
    const isLocked = i > state.currentDay + 1 && !isCompleted && !state.completedDays.has(i - 1);

    let cls = 'day-card';
    if (isCompleted) cls += ' completed';
    if (isCurrent) cls += ' current-day-card';
    if (isLocked) cls += ' locked';
    card.className = cls;

    // Best WPM for this day
    const dayRecords = state.history.filter(r => r.day === lesson.day);
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
        // Switch to practice view
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
  const h = state.history;
  if (h.length === 0) {
    $('#stat-best-wpm').textContent = '0';
    $('#stat-avg-wpm').textContent = '0';
    $('#stat-avg-accuracy').textContent = '0%';
    $('#stat-lessons-done').textContent = '0';
    $('#stat-total-time').textContent = '0m';
    $('#stat-streak').textContent = '0';
    $('#history-body').innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-dim)">No data yet. Complete a lesson to see stats.</td></tr>';
    drawChart([]);
    return;
  }

  const bestWpm = Math.max(...h.map(r => r.wpm));
  const avgWpm = Math.round(h.reduce((s, r) => s + r.wpm, 0) / h.length);
  const avgAcc = Math.round(h.reduce((s, r) => s + r.accuracy, 0) / h.length);
  const totalTime = h.reduce((s, r) => s + r.time, 0);
  const totalMin = Math.round(totalTime / 60);

  // Calculate streak
  const streak = calculateStreak();

  $('#stat-best-wpm').textContent = bestWpm;
  $('#stat-avg-wpm').textContent = avgWpm;
  $('#stat-avg-accuracy').textContent = `${avgAcc}%`;
  $('#stat-lessons-done').textContent = state.completedDays.size;
  $('#stat-total-time').textContent = totalMin >= 60 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : `${totalMin}m`;
  $('#stat-streak').textContent = streak;

  // History table (most recent first)
  const tbody = $('#history-body');
  tbody.innerHTML = '';
  [...h].reverse().slice(0, 50).forEach(r => {
    const row = document.createElement('tr');
    const date = new Date(r.date);
    row.innerHTML = `
      <td>${date.toLocaleDateString()}</td>
      <td>Day ${r.day}: Ex ${r.exercise || 1}</td>
      <td>${r.wpm}</td>
      <td>${r.accuracy}%</td>
      <td>${formatTime(r.time)}</td>
    `;
    tbody.appendChild(row);
  });

  // Draw WPM chart
  drawChart(h);
}

function calculateStreak() {
  const dates = [...new Set(state.history.map(r => new Date(r.date).toDateString()))];
  if (dates.length === 0) return 0;

  // Sort dates descending
  const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastPractice = new Date(sorted[0]);
  lastPractice.setHours(0, 0, 0, 0);

  // If last practice was not today or yesterday, streak is 0
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

  // Set actual pixel size
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
    ctx.fillText('Complete more lessons to see your progress chart', w / 2, h / 2);
    return;
  }

  const wpms = history.map(r => r.wpm);
  const maxWpm = Math.max(...wpms, 20);
  const minWpm = Math.min(...wpms);

  // Grid lines
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

  // Plot line
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

  // Dots
  wpms.forEach((wpm, i) => {
    const x = pad.left + (i / (wpms.length - 1)) * plotW;
    const y = pad.top + plotH - ((wpm - minWpm + 5) / rangeY) * plotH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#6c8cff';
    ctx.fill();
  });

  // X-axis label
  ctx.fillStyle = '#8b8fa3';
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Sessions', w / 2, h - 5);
}

// === Reset Data ===
$('#btn-reset-data').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
    localStorage.removeItem('typo-state');
    state.currentDay = 0;
    state.history = [];
    state.completedDays = new Set();
    loadLesson(0, 0);
    renderStats();
  }
});

// === Init ===
loadState();
loadLesson(state.currentDay, 0);
