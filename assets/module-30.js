/* ——— 30-minute session ——— */

const module30 = document.querySelector('#module-30');

if (module30) {
  const screens = [...module30.querySelectorAll('[data-screen]')];
  const progressSteps = [...module30.querySelectorAll('[data-progress-step]')];

  let ideasA = [];
  let ideasB = [];
  const STUDY_SECONDS = 120;
  let studyInterval;

  const screenProgress = {
    intro: -1,
    setup: 0,
    study: 1,
    retrieve: 2,
    'check-a': 3,
    'fix-a': 4,
    'check-b': 5,
    'fix-b': 6,
    plan: 7,
    complete: 8
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
    const timerDisplay = module30.querySelector('[data-study-timer]');
    const timerBar = module30.querySelector('[data-timer-bar]');
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

  function buildStudyCards() {
    const listA = module30.querySelector('[data-ideas-list-a]');
    const listB = module30.querySelector('[data-ideas-list-b]');
    const topicAEl = module30.querySelector('[data-study-topic-a]');
    const topicBEl = module30.querySelector('[data-study-topic-b]');
    const topicA = module30.querySelector('#m30-topic-a')?.value.trim() || 'Topic A';
    const topicB = module30.querySelector('#m30-topic-b')?.value.trim() || 'Topic B';
    if (topicAEl) topicAEl.textContent = topicA;
    if (topicBEl) topicBEl.textContent = topicB;
    listA.replaceChildren(...ideasA.map(idea => {
      const li = document.createElement('li');
      li.textContent = idea;
      return li;
    }));
    listB.replaceChildren(...ideasB.map(idea => {
      const li = document.createElement('li');
      li.textContent = idea;
      return li;
    }));
  }

  function buildCheckboxes(ideas, fieldset) {
    const legend = fieldset.querySelector('legend');
    fieldset.replaceChildren();
    if (legend) fieldset.appendChild(legend);
    ideas.forEach((idea, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = String(index);
      input.name = fieldset.dataset.checkGroup;
      const span = document.createElement('span');
      span.textContent = idea;
      label.append(input, span);
      fieldset.appendChild(label);
    });
  }

  function updateCheckScore(fieldset, countEl, totalEl) {
    const checked = [...fieldset.querySelectorAll('input[type="checkbox"]:checked')].length;
    const total = [...fieldset.querySelectorAll('input[type="checkbox"]')].length;
    countEl.textContent = checked;
    totalEl.textContent = total;
  }

  function getMissed(fieldset) {
    return [...fieldset.querySelectorAll('input[type="checkbox"]')].filter(cb => !cb.checked);
  }

  function buildGapList(gapList, missed, ideas) {
    if (missed.length === 0) {
      const p = document.createElement('p');
      p.className = 'gap-list__success';
      const strong = document.createElement('strong');
      strong.textContent = 'You recalled all the key ideas for this topic.';
      p.append(strong, ' Try rewriting them as a single connected explanation.');
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

  function resetModule() {
    clearInterval(studyInterval);
    ideasA = [];
    ideasB = [];
    module30.querySelectorAll('textarea').forEach(t => { t.value = ''; });
    module30.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; });
    module30.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    module30.querySelector('[data-check-count-a]').textContent = '0';
    module30.querySelector('[data-ideas-total-a]').textContent = '0';
    module30.querySelector('[data-check-count-b]').textContent = '0';
    module30.querySelector('[data-ideas-total-b]').textContent = '0';
    module30.querySelector('[data-first-answer-copy-a]').textContent = '';
    module30.querySelector('[data-first-answer-copy-b]').textContent = '';
    module30.querySelectorAll('.validation-message').forEach(m => { m.hidden = true; });
    const topicAInput = module30.querySelector('#m30-topic-a');
    const topicBInput = module30.querySelector('#m30-topic-b');
    if (topicAInput) topicAInput.value = '';
    if (topicBInput) topicBInput.value = '';
    showScreen('intro');
  }

  module30.addEventListener('change', event => {
    const fieldsetA = module30.querySelector('[data-ideas-checklist-a]');
    const fieldsetB = module30.querySelector('[data-ideas-checklist-b]');
    if (fieldsetA?.contains(event.target)) {
      updateCheckScore(
        fieldsetA,
        module30.querySelector('[data-check-count-a]'),
        module30.querySelector('[data-ideas-total-a]')
      );
    }
    if (fieldsetB?.contains(event.target)) {
      updateCheckScore(
        fieldsetB,
        module30.querySelector('[data-check-count-b]'),
        module30.querySelector('[data-ideas-total-b]')
      );
    }
  });

  module30.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    if (action === 'to-setup') showScreen('setup');

    if (action === 'to-study') {
      const ideasInputA = module30.querySelector('[data-ideas-a]');
      const ideasInputB = module30.querySelector('[data-ideas-b]');
      const error = module30.querySelector('[data-setup-error]');
      const parsedA = parseIdeas(ideasInputA.value);
      const parsedB = parseIdeas(ideasInputB.value);
      if (parsedA.length < 2 || parsedB.length < 2) {
        error.hidden = false;
        if (parsedA.length < 2) ideasInputA.focus();
        else ideasInputB.focus();
        return;
      }
      error.hidden = true;
      ideasA = parsedA;
      ideasB = parsedB;
      const topicA = module30.querySelector('#m30-topic-a')?.value.trim();
      const topicB = module30.querySelector('#m30-topic-b')?.value.trim();
      if (topicA) sessionStorage.setItem('rl-subject', topicA);
      buildStudyCards();
      showScreen('study');
      startStudyTimer();
    }

    if (action === 'to-retrieve') showScreen('retrieve');

    if (action === 'to-check-a') {
      const firstAnswer = module30.querySelector('[data-first-answer]');
      const error = module30.querySelector('[data-retrieve-error]');
      if (firstAnswer.value.trim().length < 5) {
        error.hidden = false;
        firstAnswer.focus();
        return;
      }
      error.hidden = true;
      const answerText = firstAnswer.value.trim();
      module30.querySelector('[data-first-answer-copy-a]').textContent = answerText;
      module30.querySelector('[data-first-answer-copy-b]').textContent = answerText;
      const fieldsetA = module30.querySelector('[data-ideas-checklist-a]');
      buildCheckboxes(ideasA, fieldsetA);
      updateCheckScore(
        fieldsetA,
        module30.querySelector('[data-check-count-a]'),
        module30.querySelector('[data-ideas-total-a]')
      );
      showScreen('check-a');
    }

    if (action === 'to-fix-a') {
      const fieldsetA = module30.querySelector('[data-ideas-checklist-a]');
      buildGapList(module30.querySelector('[data-gap-list-a]'), getMissed(fieldsetA), ideasA);
      showScreen('fix-a');
    }

    if (action === 'to-check-b') {
      const correctionA = module30.querySelector('[data-correction-a]');
      const error = module30.querySelector('[data-fix-a-error]');
      const fieldsetA = module30.querySelector('[data-ideas-checklist-a]');
      if (getMissed(fieldsetA).length > 0 && correctionA.value.trim().length < 3) {
        error.hidden = false;
        correctionA.focus();
        return;
      }
      error.hidden = true;
      const fieldsetB = module30.querySelector('[data-ideas-checklist-b]');
      buildCheckboxes(ideasB, fieldsetB);
      updateCheckScore(
        fieldsetB,
        module30.querySelector('[data-check-count-b]'),
        module30.querySelector('[data-ideas-total-b]')
      );
      showScreen('check-b');
    }

    if (action === 'to-fix-b') {
      const fieldsetB = module30.querySelector('[data-ideas-checklist-b]');
      buildGapList(module30.querySelector('[data-gap-list-b]'), getMissed(fieldsetB), ideasB);
      showScreen('fix-b');
    }

    if (action === 'to-plan') {
      const correctionB = module30.querySelector('[data-correction-b]');
      const error = module30.querySelector('[data-fix-b-error]');
      const fieldsetB = module30.querySelector('[data-ideas-checklist-b]');
      if (getMissed(fieldsetB).length > 0 && correctionB.value.trim().length < 3) {
        error.hidden = false;
        correctionB.focus();
        return;
      }
      error.hidden = true;
      const topicA = module30.querySelector('#m30-topic-a')?.value.trim() || 'Topic A';
      const topicB = module30.querySelector('#m30-topic-b')?.value.trim() || 'Topic B';
      const legendA = module30.querySelector('[data-plan-legend-a]');
      const legendB = module30.querySelector('[data-plan-legend-b]');
      if (legendA) legendA.textContent = `When will you return to ${topicA}?`;
      if (legendB) legendB.textContent = `When will you return to ${topicB}?`;
      showScreen('plan');
    }

    if (action === 'finish') {
      const returnA = module30.querySelector('input[name="return-time-a"]:checked');
      const returnB = module30.querySelector('input[name="return-time-b"]:checked');
      const returnError = module30.querySelector('[data-return-error]');
      if (!returnA || !returnB) {
        returnError.hidden = false;
        if (!returnA) module30.querySelector('input[name="return-time-a"]').focus();
        else module30.querySelector('input[name="return-time-b"]').focus();
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
      const fieldsetA = module30.querySelector('[data-ideas-checklist-a]');
      const fieldsetB = module30.querySelector('[data-ideas-checklist-b]');
      const scoreA = [...fieldsetA.querySelectorAll('input:checked')].length;
      const scoreB = [...fieldsetB.querySelectorAll('input:checked')].length;
      const topicA = module30.querySelector('#m30-topic-a')?.value.trim() || 'Topic A';
      const topicB = module30.querySelector('#m30-topic-b')?.value.trim() || 'Topic B';
      module30.querySelector('[data-final-topic-a]').textContent = topicA;
      module30.querySelector('[data-final-topic-b]').textContent = topicB;
      module30.querySelector('[data-final-score-a]').textContent = `${scoreA} / ${ideasA.length}`;
      module30.querySelector('[data-final-score-b]').textContent = `${scoreB} / ${ideasB.length}`;
      module30.querySelector('[data-final-return-a]').textContent = returnLabels[returnA.value];
      module30.querySelector('[data-final-return-b]').textContent = returnLabels[returnB.value];
      showScreen('complete');
    }

    if (action === 'restart') resetModule();
  });

  updateProgress('intro');
}
