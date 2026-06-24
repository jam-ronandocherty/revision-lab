const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('revision-lab-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme) {
  root.dataset.theme = theme;

  if (toggle) {
    toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

toggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('revision-lab-theme', nextTheme);
});

const moduleElement = document.querySelector('#module');

if (moduleElement) {
  const screens = [...moduleElement.querySelectorAll('[data-screen]')];
  const progressSteps = [...moduleElement.querySelectorAll('[data-progress-step]')];
  const firstAnswer = moduleElement.querySelector('[data-first-answer]');
  const secondAnswer = moduleElement.querySelector('[data-second-answer]');
  const correction = moduleElement.querySelector('[data-correction]');
  const checklist = moduleElement.querySelector('[data-checklist]');
  const checkboxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
  const timerDisplay = moduleElement.querySelector('[data-study-timer]');
  const timerBar = moduleElement.querySelector('[data-timer-bar]');
  let studyInterval;

  const screenProgress = {
    intro: -1,
    study: 0,
    retrieve: 1,
    check: 2,
    fix: 3,
    retry: 4,
    compare: 4,
    return: 5,
    complete: 6
  };

  const gapContent = {
    temperature: {
      title: 'Same temperature',
      detail: 'Metal and wood can both be at the same room temperature.'
    },
    conduction: {
      title: 'Faster conduction',
      detail: 'Metal transfers heat away from your hand more quickly.'
    },
    sensation: {
      title: 'What your skin senses',
      detail: 'The faster loss of heat is what makes the metal feel colder.'
    }
  };

  function updateProgress(screenName) {
    const currentIndex = screenProgress[screenName];

    progressSteps.forEach((step, index) => {
      step.classList.toggle('is-current', index === currentIndex);
      step.classList.toggle('is-complete', index < currentIndex);
      step.setAttribute('aria-current', index === currentIndex ? 'step' : 'false');
    });
  }

  function showScreen(name) {
    clearInterval(studyInterval);

    screens.forEach((screen) => {
      const active = screen.dataset.screen === name;
      screen.hidden = !active;
      screen.classList.toggle('is-active', active);
    });

    updateProgress(name);

    const activeScreen = screens.find((screen) => screen.dataset.screen === name);
    const heading = activeScreen?.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startStudyTimer() {
    let seconds = 25;
    timerDisplay.textContent = seconds;
    timerBar.style.transform = 'scaleX(1)';

    studyInterval = window.setInterval(() => {
      seconds -= 1;
      timerDisplay.textContent = seconds > 0 ? seconds : 'Ready';
      timerBar.style.transform = `scaleX(${Math.max(seconds, 0) / 25})`;

      if (seconds <= 0) clearInterval(studyInterval);
    }, 1000);
  }

  function getFirstScore() {
    return checkboxes.filter((checkbox) => checkbox.checked).length;
  }

  function updateCheckScore() {
    moduleElement.querySelector('[data-check-count]').textContent = getFirstScore();
  }

  function buildGapList() {
    const gapList = moduleElement.querySelector('[data-gap-list]');
    const missing = checkboxes.filter((checkbox) => !checkbox.checked);

    if (missing.length === 0) {
      gapList.innerHTML = '<p class="gap-list__success"><strong>You found all three ideas.</strong> Strengthen the chain by rewriting it once in your own words.</p>';
      return;
    }

    gapList.replaceChildren(...missing.map((checkbox, index) => {
      const gap = gapContent[checkbox.value];
      const article = document.createElement('article');
      const number = document.createElement('span');
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      const detail = document.createElement('p');

      number.textContent = String(index + 1).padStart(2, '0');
      title.textContent = gap.title;
      detail.textContent = gap.detail;
      copy.append(title, detail);
      article.append(number, copy);
      return article;
    }));
  }

  function resetModule() {
    moduleElement.querySelectorAll('textarea').forEach((field) => { field.value = ''; });
    moduleElement.querySelectorAll('input').forEach((input) => { input.checked = false; });
    moduleElement.querySelector('[data-check-count]').textContent = '0';
    moduleElement.querySelector('[data-first-answer-copy]').textContent = '';
    moduleElement.querySelector('[data-second-answer-copy]').textContent = '';
    moduleElement.querySelectorAll('.validation-message').forEach((message) => { message.hidden = true; });
    showScreen('intro');
  }

  moduleElement.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    if (action === 'start') {
      showScreen('study');
      startStudyTimer();
    }

    if (action === 'hide') showScreen('retrieve');

    if (action === 'check') {
      const error = moduleElement.querySelector('[data-retrieve-error]');
      if (firstAnswer.value.trim().length < 5) {
        error.hidden = false;
        firstAnswer.focus();
        return;
      }

      error.hidden = true;
      moduleElement.querySelector('[data-first-answer-copy]').textContent = firstAnswer.value.trim();
      showScreen('check');
    }

    if (action === 'fix') {
      buildGapList();
      showScreen('fix');
    }

    if (action === 'retry') {
      const error = moduleElement.querySelector('[data-fix-error]');
      if (correction.value.trim().length < 5) {
        error.hidden = false;
        correction.focus();
        return;
      }

      error.hidden = true;
      showScreen('retry');
    }

    if (action === 'reveal') {
      const error = moduleElement.querySelector('[data-retry-error]');
      if (secondAnswer.value.trim().length < 5) {
        error.hidden = false;
        secondAnswer.focus();
        return;
      }

      error.hidden = true;
      moduleElement.querySelector('[data-second-answer-copy]').textContent = secondAnswer.value.trim();
      showScreen('compare');
    }

    if (action === 'return') showScreen('return');

    if (action === 'finish') {
      const returnChoice = moduleElement.querySelector('input[name="return-time"]:checked');
      const retryChoice = moduleElement.querySelector('input[name="retry-score"]:checked');
      const returnError = moduleElement.querySelector('[data-return-error]');
      const returnLabels = {
        tomorrow: 'Tomorrow',
        'three-days': 'In 3 days',
        'one-week': 'In 1 week'
      };

      if (!returnChoice) {
        returnError.hidden = false;
        moduleElement.querySelector('input[name="return-time"]').focus();
        return;
      }

      returnError.hidden = true;

      moduleElement.querySelector('[data-final-first-score]').textContent = getFirstScore();
      moduleElement.querySelector('[data-final-second-score]').textContent = retryChoice ? `${retryChoice.value} / 3 ideas` : 'Not rated';
      moduleElement.querySelector('[data-final-return]').textContent = returnLabels[returnChoice.value];
      showScreen('complete');
    }

    if (action === 'restart') resetModule();
  });

  checklist.addEventListener('change', updateCheckScore);
}

/* ——— Plan your week ——— */

const plannerEl = document.querySelector('#planner');

if (plannerEl) {
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function getWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const offset = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - offset);
    monday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  function todayDayIndex() {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  }


  function createSessionCard(session) {
    const li = document.createElement('li');
    li.className = 'session-card';
    li.dataset.sessionId = session.id;

    const body = document.createElement('div');
    body.className = 'session-card__body';

    const subjectEl = document.createElement('span');
    subjectEl.className = 'session-subject';
    subjectEl.textContent = session.subject;

    const durationEl = document.createElement('span');
    durationEl.className = 'session-duration';
    durationEl.textContent = `${session.duration} min`;

    body.append(subjectEl, durationEl);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'session-remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', `Remove ${session.subject}`);
    removeBtn.dataset.remove = session.id;
    removeBtn.textContent = '×';

    li.append(body, removeBtn);
    return li;
  }

  function dayColHTML(date, dayIndex, isToday) {
    const todayBadge = isToday ? '<span class="day-today">Today</span>' : '';
    const dayLabel = DAY_NAMES[dayIndex];
    return `<div class="day-col${isToday ? ' day-col--today' : ''}" aria-label="${dayLabel}, ${date.getDate()}">
      <div class="day-col__header">
        <span class="day-name">${DAY_SHORT[dayIndex]}</span>
        <span class="day-date">${date.getDate()}</span>
        ${todayBadge}
      </div>
      <ul class="day-sessions" aria-label="Sessions for ${dayLabel}"></ul>
      <button class="add-session-btn" type="button" data-add="${dayIndex}">+ Add session</button>
      <form class="add-session-form" data-day-form="${dayIndex}" hidden>
        <label class="add-session-label">
          <span>Subject</span>
          <input class="subject-input" type="text" placeholder="e.g. Chemistry" maxlength="40" autocomplete="off">
        </label>
        <fieldset class="duration-picker" aria-label="Session length">
          <label><input type="radio" name="dur-${dayIndex}" value="5"> <span>5 min</span></label>
          <label><input type="radio" name="dur-${dayIndex}" value="15" checked> <span>15 min</span></label>
          <label><input type="radio" name="dur-${dayIndex}" value="30"> <span>30 min</span></label>
        </fieldset>
        <div class="add-session-actions">
          <button class="add-session-submit" type="submit">Add</button>
          <button class="add-session-cancel" type="button" data-cancel="${dayIndex}">Cancel</button>
        </div>
      </form>
    </div>`;
  }

  const dates = getWeekDates();
  let sessions = [];

  function renderWeek() {
    const grid = plannerEl.querySelector('[data-week-grid]');
    const weekTitle = plannerEl.querySelector('[data-week-title]');
    const clearBtn = plannerEl.querySelector('[data-clear-plan]');
    const today = todayDayIndex();

    const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'long' });
    const first = dates[0];
    const last = dates[6];
    const title = first.getMonth() === last.getMonth()
      ? `${first.getDate()}–${last.getDate()} ${monthFmt.format(first)} ${first.getFullYear()}`
      : `${first.getDate()} ${monthFmt.format(first)} – ${last.getDate()} ${monthFmt.format(last)} ${last.getFullYear()}`;
    weekTitle.textContent = title;

    grid.innerHTML = dates.map((date, i) => dayColHTML(date, i, i === today)).join('');

    dates.forEach((_, dayIndex) => {
      const list = grid.querySelectorAll('.day-sessions')[dayIndex];
      sessions.filter(s => s.dayIndex === dayIndex).forEach(s => list.appendChild(createSessionCard(s)));
    });

    clearBtn.hidden = sessions.length === 0;
  }

  plannerEl.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const dayIndex = addBtn.dataset.add;
      const form = plannerEl.querySelector(`[data-day-form="${dayIndex}"]`);
      addBtn.hidden = true;
      form.hidden = false;
      form.querySelector('.subject-input').focus();
      return;
    }

    const cancelBtn = e.target.closest('[data-cancel]');
    if (cancelBtn) {
      const dayIndex = cancelBtn.dataset.cancel;
      const form = plannerEl.querySelector(`[data-day-form="${dayIndex}"]`);
      const addBtn = plannerEl.querySelector(`[data-add="${dayIndex}"]`);
      form.hidden = true;
      addBtn.hidden = false;
      addBtn.focus();
      return;
    }

    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      sessions = sessions.filter(s => s.id !== removeBtn.dataset.remove);
      renderWeek();
      return;
    }

    if (e.target.closest('[data-clear-plan]')) {
      sessions = [];
      renderWeek();
      return;
    }

    if (e.target.closest('[data-print]')) {
      window.print();
    }
  });

  plannerEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target.closest('[data-day-form]');
    if (!form) return;

    const dayIndex = Number(form.dataset.dayForm);
    const subject = form.querySelector('.subject-input').value.trim();
    if (!subject) {
      form.querySelector('.subject-input').focus();
      return;
    }

    const duration = Number(form.querySelector(`input[name="dur-${dayIndex}"]:checked`)?.value ?? 15);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    sessions.push({ id, dayIndex, subject, duration });
    renderWeek();
  });

  renderWeek();
}

/* ——— Start a session ——— */

const chooser = document.querySelector('#session-chooser');

if (chooser) {
  const steps = [...chooser.querySelectorAll('[data-step]')];
  let chosenTime = '5';

  function showStep(name) {
    steps.forEach(step => {
      if (step.dataset.step === name) {
        step.removeAttribute('hidden');
        const heading = step.querySelector('h1, h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      } else {
        step.setAttribute('hidden', '');
      }
    });
  }

  chooser.querySelectorAll('[data-time]').forEach(tile => {
    tile.addEventListener('click', () => {
      chosenTime = tile.dataset.time;
      showStep('focus');
    });
  });

  chooser.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'back') showStep('time');
    if (btn.dataset.action === 'begin') {
      const subject = chooser.querySelector('#subject-input')?.value.trim() || '';
      sessionStorage.setItem('rl-subject', subject);
      sessionStorage.setItem('rl-time', chosenTime);
      const destinations = { '5': 'module.html', '15': 'module-15.html' };
      window.location.href = destinations[chosenTime] || 'module.html';
    }
  });
}
