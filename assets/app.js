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
