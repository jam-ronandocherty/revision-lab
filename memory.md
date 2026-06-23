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

## Current status

- Local repository created.
- Public GitHub repository created and connected as `origin`.
- Initial responsive landing page committed and pushed.
- Light and dark themes implemented and tested.
- Desktop and mobile layouts checked locally.
- Cloudflare Pages project is not connected yet; Cloudflare authentication is required first.

## Immediate next steps

1. Authenticate with Cloudflare and connect the GitHub repository to a Pages project.
2. Agree the product brief, audience needs and success measures.
3. Finalise the sitemap and first-release scope.
4. Design and build one complete interactive learning module as the reference pattern.
5. Test the module with pupils and staff before expanding the content library.

## Safeguards

- Never include pupil names, identifiers or personal progress data.
- Do not make claims about learning research without a reliable source.
- Avoid presenting one revision technique as suitable for every kind of task.
- Do not allow engagement features to displace retrieval, feedback or meaningful practice.
- Keep the interface calm, readable and age-appropriate rather than childish or corporate.

## Working convention

Update this file whenever a durable product, technical or content decision is made. Do not use it as a task log for minor implementation details.
