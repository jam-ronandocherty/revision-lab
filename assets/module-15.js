/* ——— 15-minute session ——— */

const module15 = document.querySelector('#module-15');

if (module15) {
  const screens = [...module15.querySelectorAll('[data-screen]')];
  const progressSteps = [...module15.querySelectorAll('[data-progress-step]')];

  let ideas = [];
  const STUDY_SECONDS = 90;
  let studyInterval;

  const screenProgress = {
    intro: -1,
    setup: 0,
    study: 1,
    retrieve: 2,
    check: 3,
    fix: 4,
    retry: 5,
    compare: 5,
    plan: 6,
    complete: 7
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
    screens.forEach(screen => {
      const active = screen.dataset.screen === name;
      screen.hidden = !active;
      screen.classList.toggle('is-active', active);
    });
    updateProgress(name);
    const activeScreen = screens.find(s => s.dataset.screen === name);
    const heading = activeScreen?.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startStudyTimer() {
    const timerDisplay = module15.querySelector('[data-study-timer]');
    const timerBar = module15.querySelector('[data-timer-bar]');
    let seconds = STUDY_SECONDS;
    timerDisplay.textContent = seconds;
    timerBar.style.transform = 'scaleX(1)';
    studyInterval = window.setInterval(() => {
      seconds -= 1;
      timerDisplay.textContent = seconds > 0 ? seconds : 'Ready';
      timerBar.style.transform = `scaleX(${Math.max(seconds, 0) / STUDY_SECONDS})`;
      if (seconds <= 0) clearInterval(studyInterval);
    }, 1000);
  }

  function parseIdeas(text) {
    return text
      .split('\n')
      .map(line => line.replace(/^[\d.)\-*•]+\s*/, '').trim())
      .filter(line => line.length > 2)
      .slice(0, 8);
  }

  function buildStudyCard() {
    const list = module15.querySelector('[data-ideas-list]');
    list.replaceChildren(...ideas.map(idea => {
      const li = document.createElement('li');
      li.textContent = idea;
      return li;
    }));
    const topicEl = module15.querySelector('[data-study-topic]');
    const topic = module15.querySelector('#m15-topic')?.value.trim()
      || sessionStorage.getItem('rl-subject') || '';
    if (topicEl) topicEl.textContent = topic || 'Your key ideas';
  }

  function buildCheckboxes() {
    const fieldset = module15.querySelector('[data-ideas-checklist]');
    const legend = fieldset.querySelector('legend');
    fieldset.innerHTML = '';
    if (legend) fieldset.appendChild(legend);
    ideas.forEach((idea, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = String(index);
      input.name = 'idea-check';
      const span = document.createElement('span');
      span.textContent = idea;
      label.append(input, span);
      fieldset.appendChild(label);
    });
    updateCheckScore();
  }

  function updateCheckScore() {
    const checked = [...module15.querySelectorAll('[name="idea-check"]:checked')].length;
    module15.querySelector('[data-check-count]').textContent = checked;
    module15.querySelector('[data-ideas-total]').textContent = ideas.length;
  }

  function getFirstScore() {
    return [...module15.querySelectorAll('[name="idea-check"]:checked')].length;
  }

  function getMissedIdeas() {
    return [...module15.querySelectorAll('[name="idea-check"]')].filter(cb => !cb.checked);
  }

  function buildGapList() {
    const gapList = module15.querySelector('[data-gap-list]');
    const missed = getMissedIdeas();
    if (missed.length === 0) {
      const p = document.createElement('p');
      p.className = 'gap-list__success';
      const strong = document.createElement('strong');
      strong.textContent = 'You recalled all your key ideas.';
      p.append(strong, ' Strengthen them by rewriting the whole set as a single connected explanation.');
      gapList.replaceChildren(p);
      return;
    }
    gapList.replaceChildren(...missed.map((cb, index) => {
      const idea = ideas[Number(cb.value)];
      const article = document.createElement('article');
      const number = document.createElement('span');
      const text = document.createElement('p');
      number.textContent = String(index + 1).padStart(2, '0');
      text.textContent = idea;
      article.append(number, text);
      return article;
    }));
  }

  function buildCompareIdeas() {
    const list = module15.querySelector('[data-compare-ideas]');
    if (!list) return;
    list.replaceChildren(...ideas.map(idea => {
      const li = document.createElement('li');
      li.textContent = idea;
      return li;
    }));
  }

  function resetModule() {
    clearInterval(studyInterval);
    ideas = [];
    module15.querySelectorAll('textarea').forEach(t => { t.value = ''; });
    module15.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
    module15.querySelector('[data-check-count]').textContent = '0';
    module15.querySelector('[data-ideas-total]').textContent = '0';
    module15.querySelector('[data-first-answer-copy]').textContent = '';
    module15.querySelector('[data-second-answer-copy]').textContent = '';
    module15.querySelectorAll('.validation-message').forEach(m => { m.hidden = true; });
    const topicInput = module15.querySelector('#m15-topic');
    if (topicInput) topicInput.value = sessionStorage.getItem('rl-subject') || '';
    showScreen('intro');
  }

  // Pre-fill topic from sessionStorage on load
  const topicInput = module15.querySelector('#m15-topic');
  if (topicInput) topicInput.value = sessionStorage.getItem('rl-subject') || '';

  module15.addEventListener('change', event => {
    if (event.target.name === 'idea-check') updateCheckScore();
  });

  module15.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    if (action === 'to-setup') showScreen('setup');

    if (action === 'to-study') {
      const ideasInput = module15.querySelector('[data-ideas-input]');
      const error = module15.querySelector('[data-setup-error]');
      const parsed = parseIdeas(ideasInput.value);
      if (parsed.length < 2) {
        error.hidden = false;
        ideasInput.focus();
        return;
      }
      error.hidden = true;
      ideas = parsed;
      const topic = module15.querySelector('#m15-topic')?.value.trim() || '';
      if (topic) sessionStorage.setItem('rl-subject', topic);
      buildStudyCard();
      showScreen('study');
      startStudyTimer();
    }

    if (action === 'to-retrieve') showScreen('retrieve');

    if (action === 'to-check') {
      const firstAnswer = module15.querySelector('[data-first-answer]');
      const error = module15.querySelector('[data-retrieve-error]');
      if (firstAnswer.value.trim().length < 5) {
        error.hidden = false;
        firstAnswer.focus();
        return;
      }
      error.hidden = true;
      module15.querySelector('[data-first-answer-copy]').textContent = firstAnswer.value.trim();
      buildCheckboxes();
      showScreen('check');
    }

    if (action === 'to-fix') {
      buildGapList();
      showScreen('fix');
    }

    if (action === 'to-retry') {
      const correction = module15.querySelector('[data-correction]');
      const error = module15.querySelector('[data-fix-error]');
      const missed = getMissedIdeas();
      if (missed.length > 0 && correction.value.trim().length < 3) {
        error.hidden = false;
        correction.focus();
        return;
      }
      error.hidden = true;
      showScreen('retry');
    }

    if (action === 'to-compare') {
      const secondAnswer = module15.querySelector('[data-second-answer]');
      const error = module15.querySelector('[data-retry-error]');
      if (secondAnswer.value.trim().length < 5) {
        error.hidden = false;
        secondAnswer.focus();
        return;
      }
      error.hidden = true;
      module15.querySelector('[data-second-answer-copy]').textContent = secondAnswer.value.trim();
      buildCompareIdeas();
      showScreen('compare');
    }

    if (action === 'to-plan') showScreen('plan');

    if (action === 'finish') {
      const returnChoice = module15.querySelector('input[name="return-time"]:checked');
      const returnError = module15.querySelector('[data-return-error]');
      if (!returnChoice) {
        returnError.hidden = false;
        module15.querySelector('input[name="return-time"]').focus();
        return;
      }
      returnError.hidden = true;
      const returnLabels = {
        tonight: 'Tonight',
        tomorrow: 'Tomorrow',
        'three-days': 'In 3 days',
        'one-week': 'In 1 week',
        'two-weeks': 'In 2 weeks'
      };
      const topic = module15.querySelector('#m15-topic')?.value.trim()
        || sessionStorage.getItem('rl-subject') || '—';
      module15.querySelector('[data-final-topic]').textContent = topic;
      module15.querySelector('[data-final-first-score]').textContent = `${getFirstScore()} / ${ideas.length}`;
      module15.querySelector('[data-final-return]').textContent = returnLabels[returnChoice.value];
      showScreen('complete');
    }

    if (action === 'restart') resetModule();
  });

  updateProgress('intro');
}
