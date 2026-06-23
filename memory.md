# Revision Lab — Project Memory

Last updated: 23 June 2026

## Purpose

Revision Lab is a whole-school resource that teaches secondary pupils how to revise effectively and helps them put evidence-informed methods into practice.

It is not a Computing Science resource, although Computing Science may provide some examples. The core methods must transfer across subjects and different kinds of learning.

## Core proposition

Teach revision by having pupils revise—not by presenting another long list of revision tips.

The central learning cycle is:

1. **Retrieve** — attempt an answer without notes.
2. **Check** — compare it with reliable feedback.
3. **Fix** — correct errors and fill gaps.
4. **Retry** — attempt the knowledge or skill again.
5. **Return** — revisit it after an appropriate delay.

## Audience

### Primary audience: pupils

- Revision Lab is first and foremost for pupils.
- It must support pupils in exam years while introducing revision as a learnable skill from the younger secondary years, before high-stakes assessments make it urgent.
- It should help pupils become increasingly independent, accurate and realistic in how they plan, carry out and evaluate revision.
- Its guidance and activities must reflect the school's diverse range of subjects, knowledge, skills and assessment formats rather than assuming that all revision means memorising factual content or sitting a written exam.

### Secondary audience: families

- Revision Lab should help parents and carers understand what effective revision looks like and how they can support it at home.
- Family guidance should assume no prior knowledge of revision research, current courses or assessment practices.
- It should offer clear, practical ways to help without expecting families to become subject teachers, police revision hours or create unnecessary pressure.
- Advice should acknowledge that families have different amounts of time, confidence, space and resources available.

## Success measures

Revision Lab is successful when:

### Pupil habits and independence

- Pupils establish a regular routine of independent study outside the classroom.
- Pupils increasingly take ownership of deciding what to revise, selecting an appropriate method, checking their learning and deciding what to revisit.
- Independent study is effective and extends learning rather than merely occupying time or repeating comfortable tasks.
- Pupils can adapt their revision to different subjects, skills and forms of assessment.

### Family confidence

- Parents and carers understand the main features of effective revision and feel able to provide calm, practical support.
- Families are confident that their child is working purposefully and to the best of their ability.
- This confidence should come from helpful routines, conversations and visible learning processes—not surveillance, comparison or hours logged.

### Attainment

- Pupils retain and apply more of what they have learned.
- Pupils are better prepared for class tests, prelims and final examinations.
- Ultimately, more pupils pass their tests and examinations and achieve outcomes that reflect their ability.

Habit and confidence measures are useful early indicators; attainment is the essential longer-term outcome. Revision Lab should not claim sole responsibility for examination results, which are influenced by teaching, attendance, prior learning and wider circumstances.

## Product principles

- Make starting easier: offer useful activities for 5, 15 and 30-minute sessions.
- Keep explanations short and make pupils perform the strategy immediately.
- Show improvement through first attempts, corrections and retries.
- Treat confidence and accuracy separately so pupils learn to judge their knowledge.
- Use challenge through recall, connection and transfer—not simply longer worksheets.
- Support facts, vocabulary, processes, calculations, extended writing, languages, technical skills and practical performance.
- Avoid childish gamification, noisy dashboards and empty points or badges.
- Be useful to pupils, staff and families without requiring an account.
- Collect no pupil data. Any optional progress should remain on the device.
- Meet accessibility, responsive-design and reduced-motion expectations.

## Evidence foundations

The resource should accurately explain and apply:

- Retrieval practice and the testing effect
- Spaced and distributed practice
- Interleaving and mixed practice
- Timely feedback and correction
- Worked examples with gradually faded support
- Metacognition: planning, monitoring and evaluating learning
- The difference between familiarity, confidence and durable recall

Rereading, highlighting and copying notes should not be described as entirely useless. The important distinction is that they are usually weak as standalone revision strategies because they do not reliably require retrieval or application.

## Initial content direction

Potential learning modules:

1. Why revision can feel misleading
2. How to retrieve knowledge
3. How to space revision
4. How to make useful flashcards
5. How to use practice questions
6. How to learn from mistakes
7. How to plan realistic revision
8. How to adapt revision to different kinds of learning

Potential tools:

- Strategy finder
- Guided 5/15/30-minute session builder
- Weekly revision planner
- Flashcard repair activity
- Error log
- Confidence-versus-accuracy reflection

## First-release scope

The first release will provide five clear sections:

1. **Home** — explain Revision Lab and provide a prominent route to start revising.
2. **Start a session** — let pupils choose a 5, 15 or 30-minute session, then identify the subject and type of learning or assessment task.
3. **Learn the method** — teach one complete interactive module using the Retrieve → Check → Fix → Retry → Return cycle.
4. **Plan your week** — help pupils make a small, realistic revision plan across different subjects and assessment types.
5. **For families** — explain effective revision, offer useful questions to ask and show how to support a routine without increasing pressure.

The first reference module will be **Can you remember it without looking?** It will teach retrieval practice as the foundation for later methods and connect directly to the current landing-page concept.

The core first-release journey is: **learn one effective method, use it in a timed session, plan when to return, and help families support the routine.**

### Deliberately deferred

- Accounts or cloud-saved pupil progress
- Dashboards, points, badges or other gamification
- A large subject-specific resource library
- Flashcard repair and error-log tools
- A broad library of separate learning modules

## Technical decisions

- Separate public GitHub repository: `jam-ronandocherty/revision-lab`
- Local folder: `/Users/ronandocherty/Library/CloudStorage/OneDrive-TheCityofEdinburghCouncil/Whole School/Revision-Lab`
- Production hosting: Cloudflare Pages
- Production branch: `main`
- Initial implementation: semantic HTML, shared CSS and vanilla JavaScript
- Avoid a frontend framework unless the product becomes complex enough to justify one
- Prefer static content and client-side interactions for the first release
- Use `localStorage` only for optional device-local preferences or progress
- Keep the site printable and usable on school laptops, tablets and phones

## Brand direction

- Revision Lab should feel unmistakably connected to James Gillespie's High School while remaining fun, uplifting and contemporary.
- Use the school crest as the primary institutional anchor, paired with a compact Revision Lab wordmark rather than treating the crest as background decoration.
- Build the core palette from the crest: burgundy, heraldic gold, warm paper and dark ink. Avoid unrelated primary-brand colours such as generic product blue.
- Use the school motto, *Fidelis et Fortis*, sparingly as a quiet signature rather than a repeated slogan.
- The visual language may borrow from practical lab sheets, annotations and study materials, but should remain calm, age-appropriate and accessible rather than childish or heavily gamified.

## Current status

- Local repository created.
- Public GitHub repository created and connected as `origin`.
- Initial responsive landing page committed and pushed.
- Light and dark themes implemented and tested.
- Desktop and mobile layouts checked locally.
- Cloudflare Pages is connected and the production site is live at `https://revision-lab.pages.dev`.
- The first reference module, **Can you remember it without looking?**, is implemented as a self-contained five-minute retrieval-practice experience. It uses a neutral science explanation to take pupils through Study → Retrieve → Check → Fix → Retry → Return, keeps responses in the current page only and uses honest self-assessment rather than automated keyword marking.

## Immediate next steps

1. Design and build **Can you remember it without looking?** as the complete reference module.
2. Connect the module to the landing page and timed-session journey.
3. Test the module with pupils, families and staff before expanding the content library.

## Safeguards

- Never include pupil names, identifiers or personal progress data.
- Do not make claims about learning research without a reliable source.
- Avoid presenting one revision technique as suitable for every kind of task.
- Do not allow engagement features to displace retrieval, feedback or meaningful practice.
- Keep the interface calm, readable and age-appropriate rather than childish or corporate.

## Working convention

Update this file whenever a durable product, technical or content decision is made. Do not use it as a task log for minor implementation details.
