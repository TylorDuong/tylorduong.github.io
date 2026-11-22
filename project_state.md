# Project state

Working notes for Claude Code. Updated on task completion.

## Last task — Added a CV page (/cv/) + a CV download button on the main page

Re-added a comprehensive CV, built by **reusing the résumé component** rather than a separate page
tree (the old `src/cv/` was deleted earlier; this is leaner):
- `src/resume/Resume.jsx` now takes a `variant` prop. `variant="cv"` renders `allSelected()` (the
  "show everything" selection from `selection.js`), so the CV always lists **every** project and
  experience — 14 projects + 12 experiences (3 work + 9 activities) — and auto-includes anything
  added later, with no per-record curation. It also hides the one-page `FitMeter` (CV is multi-page
  by design) and titles the projects section "Projects" (vs the résumé's "Relevant Projects").
- `src/resume/cv-main.jsx` (new) renders `<Resume variant="cv" />`; `cv/index.html` (new) is its
  shell (title "Tylor Duong — CV", script `/src/resume/cv-main.jsx`). Registered `cv:
  cv/index.html` as a 4th `rollupOptions.input` in `vite.config.js`. Reuses `src/resume/print.css`
  as-is, so `@page` margins repeat per page and Chrome's header/footer stay suppressed. Download =
  the same "Print / Save PDF" toolbar button as the résumé.
- `content/profile.json` → added `"cvUrl": "/cv/"` (passthrough via `profile` in `src/data.js`).
- `src/sections/Hero.jsx` → added a **CV** button next to Résumé in the hero CTA row (same outline
  style), linking to `profile.cvUrl`. (Footer still shows only "Résumé ↗" — left as-is.)
- Verified: `npm run lint` clean, `npm run build` clean (`dist/cv/index.html` emitted), no `__admin`
  in `dist/`. **Committed + pushed to `origin/main`** → fires `.github/workflows/deploy.yml` →
  `gh-pages` (~1–2 min). Could not verify the Actions run from here (no `gh` CLI); check
  https://github.com/TylorDuong/tylorduong.github.io/actions. NOT yet visually checked in a browser
  — confirm `/cv/` renders + the main-page button on the live site.

## Previous task — Deployed Yber experience rewrite (commit + push to main → Actions deploy)

Committed the reworked `yber` work entry in `content/experiences.json` (founding-developer framing,
5 bullets, full-stack details, new tech tags: Next.js/TypeScript/Supabase/Vercel/LearnWorlds SSO/
n8n/OpenRouter; dropped GCP/Gemini Agents/Node.js) and pushed to `origin/main` to trigger the
Actions auto-deploy. Pre-flight: `check-content.mjs` OK (14 projects / 12 experiences valid — only
pre-existing unfiled-tag notes plus the new `LearnWorlds SSO` tag, all non-fatal), `npm run lint`
clean, `npm run build` clean, no `__admin` in `dist/`. The push fires `.github/workflows/deploy.yml`
→ `gh-pages` (~1–2 min). Could not verify the Actions run from here (no `gh` CLI); check
https://github.com/TylorDuong/tylorduong.github.io/actions.

## Previous task — Published the site (commit + push to main → Actions deploy)

Committed all outstanding work (deployed token-gated admin + `github-api`/`auth`/`Login`/
`DeployedPublish`, the `.github/workflows/deploy.yml` auto-deploy workflow, the
`evaluate-job-accuracy` skill + skill-gap tracker, the `resume-from-jd` research step, every new
résumé profile, and the print-spacing/ordering fixes) as one commit `d50e213` and pushed to
`origin/main`. Pre-flight before committing: `npm run lint` clean, `npm run build` clean, and no
`__admin` string in `dist/` (isolation invariant holds). This was the **first push carrying the
workflow**, so it should trigger the Actions build → `gh-pages` deploy (~1–2 min). Active résumé
profile is still `general` (all the tailored profiles remain unpublished-as-active, by design).

- Could NOT verify the Actions run from here: `gh` CLI isn't installed on this machine. Check
  https://github.com/TylorDuong/tylorduong.github.io/actions.
- Still USER-only (unverifiable here): GitHub → Settings → Pages must serve from `gh-pages`; the
  deployed `/admin/` needs a fine-grained PAT (this repo → Contents: R/W) pasted at login.

## Previous task — Amazon System Development Engineer (Robotics) Intern profile (resume-from-jd + evaluate)

Appended profile `amazon-system-development-engineer-intern-robotics` ("System Development Engineer
Intern @ Amazon Robotics") to `content/resume-profiles.json`. Active left as `general` (not
published). DISTINCT from the existing `amazon-software-development-engineer-intern` — this JD is a
**System Development Engineer (SysDE)** on Robotics teams (systems/infra/Linux/networking/automation
+ robotics domain), NOT the general Software Development Engineer.

- JD = Amazon SysDE Intern/Co-op, Robotics (2027; Nashville ~$99k / North Reading ~$104k / Tempe
  ~$104k, in-office). Build/operate tools & systems within a larger system; hardware↔software↔
  networking↔OS interaction; systems/processes that enable other builders via automation/safety/
  agility. Basic quals: ANY of Python/C/C++/Java/Ruby/PowerShell + open-source (Linux, Spring,
  React). Preferred: TCP/IP + DNS/DHCP/NTP/SMTP/SNMP, distributed computing, automating dev/test/
  ops, OOP on Unix-like OS, robotics/CV/ML/perception/motion-planning/autonomous-nav/path-planning.
- **Research (WebSearch, confirmed):** SysDE ≠ SDE — SysDE = infra/automation/deployment pipelines/
  networking/Linux, builds systems that enable services (not the service itself). Loop = 4 pillars:
  behavioral Leadership Principles + practical/DSA coding + Linux/networking troubleshooting +
  system design. Python/C++ + robotics middleware (ROS) + DSA valued; matrix/linear-algebra.
- Projects shown (5): agat (C/C++ real-time distributed + ESP-NOW/WebSockets networking + hardware/
  OS + Kalman/collision-avoidance = robotics nav), hardware-planner/SparkBuild (Docker + n8n
  automation + system design + deterministic 3D solver = "enables builders"), yber (distributed at
  40k scale + GCP + agentic automation), shelfsmart (IoT hardware+software+networking, founder),
  moveright (YOLOv8/ViTPose++ CV/perception = robotics domain). Hid wifi-portal, quotation-engine,
  assemblisim, oratori, fit2u, vibe, sir-model, mud, surgical-video-vlm. (Networking/monitoring
  story still carried via the Yazaki work row's Wi-Fi-portal bullet.)
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA → OA).
  Hid all hackathon/activity rows + surgical-vlm.
- Skills pruned to systems/backend/robotics-perception: kept Python/JS/TS/C-C++/Java/SQL, React/
  Next/Three, Node/Express/FastAPI/WebSockets/Postgres/MySQL/Mongo, AWS/GCP/Azure/Docker/Git/GitHub,
  PyTorch/OpenCV/Pandas/NumPy/Gemini/OpenRouter/LLMs/Kalman, Arduino/ESP32/ESP-NOW/RaspberryPi.
  Dropped C#/HTML/CSS, RN/Tailwind/Styled/Figma, Supabase/Firebase/Zod, Vercel, VLM/Transformers/
  HF/LLaVA/Ollama, Unity/CAD, whole Enterprise category. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=amazon-system-development-engineer-intern-robotics`.
- **evaluate-job-accuracy: 86/100** (stack 25 / impact 25 / domain 12 / ats 15 / edu 9) — ~tied
  with the Software Development Engineer Amazon profile (87); broad-language basic quals + DSA/OOP +
  distributed/cloud breadth + genuine robotics-domain hits (AGAT nav, MoveRight perception) are a
  strong match. Held back on domain by no Linux/Unix systems + networking-ops core (the SysDE
  pillar). gap-upsert: +4 new, 7 bumped → 46 tracked. Top gaps: Linux/Unix systems programming &
  shell (JD), TCP/IP + IP protocols DNS/DHCP/NTP/SMTP/SNMP (JD), ROS/robotics middleware (inferred),
  CI/CD & operational excellence (bumped), Amazon Leadership Principles/STAR (bumped), + motion
  planning & controls, distributed-HA, advanced DSA, AWS depth, Spring, open-source. Nothing
  committed/pushed.

## Previous task — Amazon SDE Intern résumé profile (resume-from-jd + evaluate)

Appended profile `amazon-software-development-engineer-intern` ("SDE Intern @ Amazon") to
`content/resume-profiles.json`. Active left as `general` (not published).

- JD = Amazon SDE Intern (Summer 2027, 12-wk in-person, US-wide, ~$109k). General SDE: own full
  code lifecycle (design→deploy→operate), scalable/reliable distributed services, break down
  ambiguous problems, code reviews incl. AI-generated code, GenAI/AI-assisted dev tools, agile +
  CI/CD, on-call/operational excellence. Accepts ANY of Java/Python/C++/C#/Go/Rust/TypeScript +
  DSA/OOP + AI-assisted-dev experience. Preferred: AWS, SQL+NoSQL, open-source, SDLC, ownership.
  Conferral Oct 2027–Sep 2029 (candidate's 2028 fits). Specialty areas highlightable (ML, dist&data,
  DB, embedded, mobile, game, etc.).
- **Research (WebSearch, confirmed):** OA ≈ 90 min = coding (~70, array/string, sliding window,
  greedy, hashmaps, BFS/DFS graphs, trees, DP, heaps) + Workstyles (Leadership Principles) +
  survey. Loop = 1 technical (LeetCode med) + 1 behavioral; ~half the bar is the 16 Leadership
  Principles (Ownership, Customer Obsession, Dive Deep). No Amazon-specific knowledge needed.
- **Broadest/best-fit role yet:** nearly identical selection to the PayPal SWE profile (general
  full-stack/distributed). Candidate hits almost all basic + most preferred quals.
- Projects shown (5): yber (40k-student scale, agentic distributed, GCP), hardware-planner/
  SparkBuild (TS monorepo/Node/PostgreSQL/Docker/Zod, system design + data integrity + local LLM),
  shelfsmart (full-stack founder, real-time), moveright (React/Next + FastAPI REST), agat (C/C++
  real-time distributed, Node/WebSockets). Hid wifi-portal, quotation-engine, assemblisim, oratori,
  fit2u, vibe, sir-model, mud, surgical-video-vlm.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA → maps
  to the OA). Hid all hackathon/activity rows + surgical-vlm.
- Skills pruned to full-stack/backend/cloud/DSA (mirrors PayPal SWE): kept Python/JS/TS/C-C++/C#/
  Java/SQL, React/Next, Node/Express/FastAPI/WS/Postgres/MySQL/Mongo/Zod, AWS/GCP/Azure/Docker/Git/
  GitHub, Pandas/NumPy. Dropped HTML/CSS, RN/Three/Tailwind/Styled/Figma, Supabase/Firebase, Vercel,
  rest of AI, whole Hardware + Enterprise categories. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=amazon-software-development-engineer-intern`.
- **evaluate-job-accuracy: 87/100** (stack 26 / impact 25 / domain 12 / ats 15 / edu 9) — highest
  of any profile; Amazon's broad language acceptance + DSA/OOP/AI-dev basic quals + full-stack/
  scale/cloud breadth are a near-complete match. Held back on domain by no AWS-native depth, no
  at-scale distributed infra. 6 gaps (4 new, 2 bumped → 42 tracked): Amazon Leadership Principles/
  STAR (inferred), CI/CD & operational excellence/on-call (JD), AWS cloud services Lambda/DynamoDB/
  S3/EC2 (JD), distributed systems & HA at scale (inferred, bumped), advanced DSA segment trees/
  graphs/DP (inferred, bumped), open-source contributions (JD). Nothing committed/pushed.

## Previous task — PayPal Mobile Engineer Intern résumé profile (resume-from-jd + evaluate)

Appended profile `paypal-mobile-engineer-intern` ("Mobile Engineer @ PayPal") to
`content/resume-profiles.json`. Active left as `general` (not published). THIRD PayPal profile,
distinct from `paypal-software-engineer-intern` (full-stack) and
`paypal-machine-learning-engineer-intern` (ML) — this one leads with front-end/React + React
Native + UI/UX.

- JD = Mobile SWE Intern (Summer 2027, San Jose, req R0138583). Native iOS (Swift/Objective-C) OR
  Android (Kotlin/Java); mobile UI/UX principles, REST/JSON, cloud AWS/GCP/Azure, SQL+NoSQL, ORM
  (Hibernate/JPA), multithreaded/async. PayPal auto-matched tags were all web/general (TS, React,
  Node, Docker, Tailwind, Java, SQL, MySQL, Python, AI, CSS, JS).
- **Research (WebSearch, confirmed):** PayPal/Venmo mobile is NATIVE (Swift/Obj-C iOS, Kotlin/Java
  Android); interview topics Swift, Obj-C, Core Data, protocols, threading, memory management.
  Venmo Android intern posting says native is "optional but great to have" — they build the UI
  layer + domain layer talking to Venmo REST APIs, so they value strong general eng + front-end/UI
  + REST and will teach native. **Candidate has NO native mobile** (no Swift/Kotlin/Obj-C/Android
  SDK/Core Data); closest = React Native + strong React/Next/TS/Tailwind + UI/UX (Figma) + REST via
  FastAPI/Node + Java (DSA) + SQL/NoSQL (Postgres/MySQL/Mongo/Firebase).
- **Stretch role** — tailored to the front-end/UI adjacency, not native.
- Projects shown (5): moveright (responsive React/Next UI + React Webcam camera + FastAPI REST),
  yber (React/Node app dev, 40k scale), shelfsmart (React/Next/Node full-stack founder), fit2u
  (React/Tailwind mobile-first consumer app + Weather REST APIs), assemblisim (responsive
  React/TS/Tailwind UI + image upload/webcam/real-time preview). Hid wifi-portal, quotation-engine,
  oratori, vibe, sir-model, mud, surgical-video-vlm, hardware-planner, agat.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA). Hid
  all hackathon/activity rows incl. epics-moveright (Frontend Team Lead — its project card covers
  it) + surgical-vlm.
- Skills kept front-end/mobile-adjacent broad: ALL frontend (React/Next/**React Native**/Three/
  Tailwind/Styled/Figma), Python/JS/TS/Java/SQL/**HTML/CSS** (HTML/CSS kept — front-end role!), ALL
  backend (Node/Express/FastAPI/WS/Postgres/MySQL/Mongo/Supabase/Firebase/Zod — Firebase=mobile
  BaaS, Mongo=NoSQL), ALL cloud (AWS/GCP/Azure/Vercel/Docker/Git/GitHub), trimmed AI (PyTorch/
  OpenCV/Pandas/NumPy/Gemini/OpenRouter/LLMs). Dropped C/C++, C#; VLMs/Transformers/HF/LLaVA/Ollama/
  Kalman; whole Hardware + Enterprise categories. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=paypal-mobile-engineer-intern`.
- **evaluate-job-accuracy: 81/100** (stack 23 / impact 24 / domain 10 / ats 15 / edu 9) — lower
  than the SWE (85) and ML (86) PayPal profiles because mobile is a genuine stretch (no native
  iOS/Android), partly offset by strong React/Java/REST adjacency + Venmo's "will teach native."
  7 new gaps (38 tracked): Swift (JD), Kotlin (JD), native mobile dev/iOS-Android SDK (JD),
  Objective-C (JD), Core Data (inferred), ORM Hibernate/JPA (JD), multithreaded/async (JD).
  Nothing committed/pushed.

## Previous task — PayPal ML Engineer Intern résumé profile (resume-from-jd + evaluate)

Appended profile `paypal-machine-learning-engineer-intern` ("ML Engineer @ PayPal") to
`content/resume-profiles.json`. Active left as `general` (not published). Distinct from the
existing `paypal-software-engineer-intern` — this one is the ML/AI-flavored sibling.

- JD = ML Engineer Intern (Summer 2027, San Jose, req R0138581). Tags: NumPy, Pandas, AI, Data
  Structures, Docker, Algorithms, Python, Git, Java, Language Modeling, CS. Day-to-day: develop/
  test/optimize ML models, prepare/clean/analyze datasets, run experiments + eval metrics, support
  scalable ML pipelines + deployment/monitoring. Min quals: ≥1 lang, ML frameworks (scikit-learn/
  TensorFlow/similar), DSA/stats. No sponsorship; returning Fall 2027.
- **Research (WebSearch):** PayPal ML = Python + NumPy/Pandas/scikit-learn/TensorFlow/PyTorch, SQL,
  UNIX; advanced roles Hadoop/MapReduce/Hive. Core app = fraud/risk modeling on imbalanced payments
  data, + NLP/LLMs, recommendation, customer-service ML; emphasis on data prep, eval metrics
  (precision/recall/AUC), ML pipelines, MLOps deployment+monitoring, Docker.
- **Pivot vs the SWE PayPal profile:** leads with the deep-learning/LLM/CV ML work, not full-stack.
- Projects shown (5): surgical-video-vlm (PyTorch/HF VLM, language modeling, baseline-vs-fine-tune
  eval), moveright (YOLOv8/ViTPose++ CV, custom dataset + annotation, FastAPI serving), yber
  (agentic LLM architecture, 40k-student scale, autonomous grading), shelfsmart (real-time
  predictive forecasting), hardware-planner/SparkBuild (Docker + Ollama local LLM + pgvector RAG).
  Hid wifi-portal, quotation-engine, assemblisim, oratori, fit2u, vibe, sir-model, mud, agat.
- Experiences shown (5): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA) +
  **asu-capstone-surgical-vlm un-hidden** (ML research credential — intentional double-emphasis
  alongside the surgical-video-vlm project card, like the Waymo profile; offered to drop one). Hid
  hackathon/activity rows incl. epics-moveright.
- Skills pruned to ML/data/deployment: kept Python/JS/TS/C-C++/Java/SQL, React/Next, Node/Express/
  FastAPI/WS/Postgres/MySQL/Mongo, AWS/GCP/Azure/Docker/Git/GitHub, and the WHOLE AI&Data category
  (PyTorch/OpenCV/Pandas/NumPy/Gemini/OpenRouter/LLMs/VLMs/Transformers/HuggingFace/LLaVA/Ollama/
  Kalman). Dropped HTML/CSS, RN/Three/Tailwind/Styled/Figma, Supabase/Firebase/Zod, Vercel, whole
  Hardware + Enterprise categories. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=paypal-machine-learning-engineer-intern`.
- **evaluate-job-accuracy: 86/100** (stack 26 / impact 24 / domain 12 / ats 15 / edu 9) — highest
  of any profile so far; the candidate's genuine ML/LLM core (capstone VLM research, PyTorch,
  Pandas/NumPy, Language Modeling) is a near-direct hit. Held back on domain by no fintech/fraud-
  risk modeling, no classical/tabular ML, no MLOps. 6 new gaps (31 tracked, all new): scikit-learn
  (JD), TensorFlow (JD), fraud/risk modeling on imbalanced data (inferred), MLOps/model deploy+
  monitoring (JD), statistics & probability (JD), big data Spark/Hadoop/Hive (inferred). Nothing
  committed/pushed.

## Previous task — PayPal SWE Intern résumé profile (resume-from-jd + evaluate)

Appended profile `paypal-software-engineer-intern` ("Software Engineer Intern @ PayPal") to
`content/resume-profiles.json`. Active left as `general` (not published).

- JD = full-stack/backend SWE intern in fintech/payments (Summer 2027, San Jose + others); stack
  Java/Python/Node.js/React/SQL/REST; build distributed systems at scale; develop/optimize DBs,
  ensure data integrity + performance; SDLC, code/design reviews. Min quals: ≥1 language, DSA/OOP/
  debugging, projects. No sponsorship; returning to school Fall 2027.
- **Research (WebSearch, confirmed):** PayPal eng builds with Java/Node/Python/Spring Boot on
  distributed cloud-native infra; emphasizes scalability, DB selection, caching, Kafka, idempotency
  in payments, high-availability. Interview = video app + recruiter + 2 technical; easy-med DSA
  (hashmaps recurring), Java internals (HashMap/Collections/GC/multithreading), OOP, SQL joins.
- **Pivot from embedded profiles:** this one leads with the WEB/full-stack + scale work.
- Projects shown (5): Yber (React/Node/GCP, agentic distributed, 40k-student scale), SparkBuild
  (TS/React/Node/PostgreSQL/Zod/Docker — backend + data integrity + system design), ShelfSmart
  (full-stack + real-time), MoveRight (React/Next + FastAPI REST), AGAT (Node.js/WebSockets
  real-time distributed). Hid wifi-portal, quotation-engine, assemblisim, oratori, fit2u, vibe,
  sir-model, mud, surgical-video-vlm.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA → maps
  to the OA). Hid hackathon/activity rows + surgical-vlm.
- Skills pruned to full-stack/backend/data: kept Python/JS/TS/C-C++/C#/Java/SQL, React/Next,
  Node/Express/FastAPI/WebSockets/PostgreSQL/MySQL/MongoDB/Zod, AWS/GCP/Azure/Docker/Git/GitHub,
  Pandas/NumPy. Dropped HTML/CSS, RN/Three/Tailwind/Styled/Figma, Supabase/Firebase, Vercel, all
  ML/VLM, whole Hardware + Enterprise categories. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=paypal-software-engineer-intern`.
- **evaluate-job-accuracy: 85/100** (stack 25 / impact 24 / domain 12 / ats 15 / edu 9) — best
  stack overlap of any profile (near-complete Java/Python/Node/React/SQL/REST match), held back on
  domain by no fintech + no true distributed-systems-at-scale depth. 7 new gaps (25 tracked, all
  inferred except none): Spring Boot, Kafka, distributed/HA at scale, caching (Redis), Java
  concurrency/internals, payments/fintech idempotency, microservices/REST-at-scale. Nothing
  committed/pushed.

## Previous task — Application-pipeline roadmap (FUTURE_PLANS Phases 14–16)

Captured the proposed end-to-end job-application pipeline as three new design-only phases in
`FUTURE_PLANS.md` (table rows + sections), building on Phase 13's n8n design:
- **Phase 14 — Job registry + dedup** (★★★☆☆): new root `applications.json` + `app-registry.mjs`
  (zero-dep, mirrors `gap-upsert.mjs`). Stable `jobKey` (ATS id / normalized URL / text+hash) +
  content hash → skip/update/create-new decision wired into both skills' step 1. Kept out of
  `content/`/`ENTITIES` (career meta).
- **Phase 15 — Batch runner + triage + dashboard** (★★★★☆): paste-a-list, fit-gated triage
  (tailor only ≥70), generated `APPLICATIONS.md` (scoreboard, status tracker, learning-ROI =
  gaps ranked by jobs-unlocked × priority, score-drift), optional per-job outreach draft.
- **Phase 16 — Discovery + notifications** (★★★★★): n8n cron polls Greenhouse/Lever/Ashby +
  Adzuna for target companies, dedups via Phase 14, scores, pushes top matches to
  email/Telegram/Slack. Don't scrape LinkedIn/Indeed.
Nothing built yet — design only. Natural next build step: Phase 14 (makes pasted batches
idempotent).

## Last task — Honeywell Aerospace SWE Intern résumé profile (resume-from-jd + evaluate)

Appended profile `honeywell-aerospace-software-engineering-intern` ("Software Engineering Intern @
Honeywell Aerospace") to `content/resume-profiles.json`. Active left as `general` (not published).

- JD = general SWE intern for "highly complex software applications" in Aerospace; min quals
  CS/CE bachelor's, grad Dec 2027+, 3.0 GPA, no sponsorship. WE VALUE: SDLC, efficient/high-quality
  software, software configuration management + change management, teaming, communication, fast
  learning, decisiveness under complexity.
- **Research (WebSearch, confirmed):** Honeywell Aerospace SWE intern work is predominantly
  embedded **C/C++ on safety-critical avionics under DO-178/DO-178C** (design/impl/test/doc), SCM
  via Git/Bitbucket, DSA-heavy OA (3 medium/hard — segment trees, graphs, DP), avionics
  architecture knowledge, strong CS fundamentals, teamwork.
- **Standout fit:** candidate has THREE Honeywell-sponsored DevilsInvent projects — AGAT (aviation
  TCAS, embedded C/C++), V.I.B.E (aerospace VR), AssembliSim (DevilsInvent Honeywell factory twin).
- Projects shown (5): AGAT, V.I.B.E, AssembliSim, ShelfSmart (IoT embedded), MUD (C/OOP/Git —
  fundamentals + SCM). Hid yber, wifi-portal, quotation-engine, moveright, oratori, fit2u,
  sir-model, surgical-video-vlm, hardware-planner.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java DSA → maps
  to the OA). Hid the rest incl. the AGAT/VIBE/AssembliSim hackathon rows (project cards already
  represent them) and surgical-vlm research.
- Skills pruned to C/C++/embedded/systems/fundamentals (mirrors Garmin/Qualcomm): kept C/C++, C#,
  Java, Python, JS/TS, SQL, React/Next/Three, Node/FastAPI/WebSockets/PostgreSQL, AWS/GCP/Azure/
  Docker/Git/GitHub, PyTorch/OpenCV/Pandas/NumPy/Kalman, Unity/Arduino/ESP32/ESP-NOW/RaspberryPi/
  Altium. Dropped whole Enterprise category + web/LLM/CAD items. Coursework kept (intern role).
- `check-content.mjs` passes. Preview: `/resume/?profile=honeywell-aerospace-software-engineering-intern`.
- **evaluate-job-accuracy: 85/100** (stack 24 / impact 24 / domain 13 / ats 15 / edu 9) — highest
  across profiles so far, driven by the Honeywell-sponsored aerospace domain match. 7 new gaps
  recorded (18 tracked): DO-178C/safety-critical SDLC, RTOS (VxWorks/INTEGRITY/Deos), avionics
  architectures (ARINC 653/IMA), requirements-based V&V testing, advanced DSA (all inferred),
  MISRA C/bare-metal drivers (inferred), Bitbucket/formal change management (JD). Nothing
  committed/pushed.

## Previous task — evaluate-job-accuracy skill + research step + skill-gap tracker (+ n8n design)

Added a new skill that scores the résumé against a JD out of 100 and a rolling gap tracker, wired
`resume-from-jd` to research + chain into it, and documented the n8n productization as a roadmap
phase. Plan file: `C:\Users\tduon\.claude\plans\cosmic-exploring-floyd.md`.

**New skill `.claude/skills/evaluate-job-accuracy/`** (`SKILL.md` + `scripts/gap-upsert.mjs`):
- Reads candidate data (skills/projects/experiences/profile, and a profile's visible set via the
  hidden-model in `src/resume/selection.js`), **requires live web research** on company+role to
  infer the unwritten "traditional hire" bar, then scores the 5-dimension rubric (Technical Stack
  30 / Impact & Scale 30 / Domain 15 / ATS 15 / Education 10). Scoring is agent judgment; the only
  script is deterministic gap bookkeeping. Read-only over `content/*.json`.
- `gap-upsert.mjs` (zero-dep, CRLF-safe, same conventions as `scaffold-visuals.mjs`) takes a
  payload JSON, **upserts gaps by normalized name** (bumps `demandCount`, unions `roles`, keeps
  earliest `firstSeen`, **preserves user-edited `status`** — learning/done never reset), appends
  the run, and regenerates the human view. Verified: ran twice with overlapping gaps + a simulated
  `status:"learning"` edit — bump/union/preserve all correct.

**Tracker files at repo ROOT (deliberately NOT in `content/` or `ENTITIES` — career meta, not site
content, must not touch the build):**
- `skill-gaps.json` — source of truth (`{version,updated,runs[],gaps[]}`).
- `SKILL_GAPS.md` — generated view (most-demanded gaps table + recent-evaluations table). Banner
  says edit `status` in the JSON, not the md.
- Seeded with a real first run: **Qualcomm SWE Intern scored 79/100** (stack 23 / impact 23 /
  domain 9 / ats 15 / edu 9). 11 gaps recorded — RTOS, Embedded Linux/Yocto, ARM assembly,
  bare-metal firmware/drivers, multithreading primitives (all high), + multi-core, perf-opt, Linux
  networking, JTAG/GDB, bit-manip/memory, Perforce. Research sourced from Qualcomm interview/role
  reports (jointaro, glassdoor, interviewquery, dataford).

**`resume-from-jd` SKILL.md updated:** step 1 now **requires company/role web research** feeding
the ranking; new **step 6 invokes `evaluate-job-accuracy`** (Skill tool) with the same JD + the new
`profileId` and folds the score + top gaps into the hand-off; intro notes the score+gap outcome.

**`FUTURE_PLANS.md` Phase 13 (design only, ★★★★★):** n8n pipeline triggered from the deployed
admin — admin JD form → secured n8n webhook (LLM/search/GitHub PAT server-side) → research + rubric
LLM nodes → validate → commit profile + upsert skill-gaps to `main` → deploy → return score. Reuses
`github-api.js` commit flow, `content-schema.js` validate, and `gap-upsert.mjs` upsert rules. Not
built.

**Verified:** `gap-upsert.mjs` merge semantics (twice-run + status preservation);
`check-content.mjs` still OK (only pre-existing unfiled-tech notes); gap files confirmed outside
`content/`. Nothing committed/pushed (per usual).

## Previous task — Qualcomm SWE Intern résumé profile (resume-from-jd)

Appended profile `qualcomm-software-engineering-intern` ("Software Engineering Intern @ Qualcomm")
to `content/resume-profiles.json`. Active left as `general` (not published).

- Qualcomm JD = C/C++/Python SWE intern for wireless devices; preferred quals are all systems:
  OOP, distributed systems + networking protocols (bridging/routing in Linux), multi-threaded,
  multi-core/multi-processor, system performance optimization, complex debugging, modeling
  concepts (discrete-event simulation, polyglot programming). Student/new-grad role → coursework kept.
- Projects shown (5): AGAT (C/C++ embedded, ESP-NOW/WebSockets networking, Kalman, real-time
  distributed), MUD (C + OOP + collaborative systems), AssembliSim (digital-twin = discrete-event
  simulation), SparkBuild/hardware-planner (polyglot monorepo, deterministic solver, perf, Docker/
  pgvector/Ollama), ShelfSmart (IoT embedded + real-time forecasting). Hid yber, wifi-portal,
  quotation-engine, moveright, oratori, fit2u, vibe, sir-model, surgical-video-vlm.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java, algorithms/
  data structures, team under time — maps to the HackerRank screen). Hid the rest incl. the
  AGAT/AssembliSim hackathon rows (project cards already represent them) and surgical-vlm research.
- Skills pruned to C/C++/systems/embedded/networking: kept Python/JS/TS/C-C++/C#/Java/SQL, React/
  Next/Three, Node/FastAPI/WebSockets/PostgreSQL, AWS/GCP/Azure/Docker/Git/GitHub, OpenCV/Pandas/
  NumPy/Kalman, Unity/Arduino/ESP32/ESP-NOW/Raspberry Pi. Dropped whole Enterprise category and the
  web/LLM/CAD items. `check-content.mjs` passes (only the pre-existing unfiled-tech notes remain).
  Preview: `/resume/?profile=qualcomm-software-engineering-intern`.

## Previous task — Deployed, token-gated admin + auto-deploy + résumé print spacing

**Goal:** make `/admin/` usable on the live site (not just locally), password-protected, unlinked
(type the path), with edits auto-publishing. Plus: fix résumé export so pages aren't cut off / jammed
at the top margin.

**Hard constraint surfaced to user:** GitHub Pages is static — the local admin backend (file writes +
`npm run deploy` via `tools/vite-plugin-admin.js`) can't run there. User chose the **GitHub token +
Actions** approach.

**Admin now has two interchangeable backends** (picked in `admin/api.js` by `import.meta.env.PROD`):
- local dev → existing `localApi` / `/__admin/api` (unchanged).
- deployed → new `admin/github-api.js` (`githubApi`): reads/writes `content/*.json` and image uploads
  straight to `main` via the GitHub Contents API. Concurrency rides the git blob SHA (threaded through
  the UI's `mtimeMs`). Save = commit = triggers deploy.
- Gate: `admin/auth.js` + `admin/Login.jsx` — a GitHub token (the real password) stored only in
  localStorage, never in the bundle. Validated via `githubApi.whoami()` (GET repo, checks it's reachable;
  does NOT hard-block on the write bit to avoid false lockout of fine-grained tokens). `LOCK` button in
  the header clears it. Login/logout only in PROD; local dev skips it.
- `admin/DeployedPublish.jsx` replaces the `Publish` tab in PROD (explains "Save is Publish", links to
  Actions + live site).

**Build/deploy wiring:**
- `vite.config.js` — added `admin: admin/index.html` as a 3rd rollup input (admin now ships). Updated
  `admin/index.html` comment accordingly.
- `.github/workflows/deploy.yml` (NEW) — on push to `main` (or manual dispatch): `npm ci` → `npm run
  build` → `peaceiris/actions-gh-pages@v4` publishes `dist/` to `gh-pages`. `permissions: contents:
  write`. This is what makes a `githubApi` content commit actually go live.
- Isolation invariant still holds: `grep -ril "__admin" dist/` prints nothing (localApi branch +
  `/__admin/api` string tree-shake out in PROD). Verified. `npm run lint` + `npm run build` clean.

**Résumé print spacing** (`src/resume/print.css`): reverted the previous `@page { margin: 0 }` to
`@page { margin: 0.5in }`, and set `.r-page` print `padding: 0` (was `0.5in`). Reason: container padding
only insets page 1's top and the last page's bottom, so a 2-page résumé printed with its continuation
jammed against the top edge. A real `@page` margin repeats on every page. TRADEOFF: this re-enables
Chrome's ability to draw its URL/date header/footer *if* "Headers and footers" is ticked in the print
dialog — it's unticked by default-after-first-use; noted in the CSS comment. Screen `@media screen`
padding unchanged, so the on-screen sheet and the DEV FitMeter are unaffected.

**USER MUST DO (not automatable here):** (1) create a fine-grained PAT (only this repo → Contents: Read
and write) to paste at `/admin/` login; (2) commit + push all this to `main` so the workflow + admin
ship; (3) confirm GitHub → Settings → Pages still serves from `gh-pages`; (4) first deploy still needs
the workflow present on `main`. Nothing committed/pushed yet (per usual — only on request).

**Not verified in a real browser** (Claude-in-Chrome extension wasn't connected): the login screen
render and the actual print-preview margins. Logic + CSS are standard; confirm with Ctrl+P.

**Résumé project ordering** (`src/resume/selection.js` `deriveVisible`): `resumeProjects` now falls back
to `byRecency` (date, most recent first) instead of the projects array's incidental order; explicit
`resume.order` still leads where set. Matches the documented "resume.order overrides ordering where set"
intent (the default it overrides is now date). Lint + build clean.

## Previous task — Removed the /cv/ page

Reverted the comprehensive CV added earlier: deleted `cv/index.html`, `src/cv/` (Cv.jsx, main.jsx,
print.css), removed the `cv` entry from `vite.config.js` `rollupOptions.input`, and cleaned
`dist/cv/`. `npm run lint` + `npm run build` clean (build emits only main + resume). The surgical
VLM content update and the Waymo profile tweak were left in place.

## Previous task — Surgical VLM content + Waymo profile tweak

- Updated `surgical-video-vlm` (projects.json) and `asu-capstone-surgical-vlm` (experiences.json):
  description + first bullet now state it's a two-semester ASU capstone **in partnership with
  Barrow Neurological Institute**, advised by **Professor Yalin Wang** (ASU School of Computing and
  Augmented Intelligence). Did NOT add his phone/email (not résumé-appropriate).
- Waymo profile (`waymo-ml-accelerator-kernels-intern`): un-hid `asu-capstone-surgical-vlm` so the
  research credential shows in the Experience/Activities section. NOTE: the Waymo résumé now shows
  BOTH the surgical-video-vlm project card and the capstone experience (same work, two framings) —
  intentional double-emphasis for a research-heavy role; offered to drop one if undesired.
- `check-content.mjs` passes.

## Previous task — Comprehensive CV page (/cv/) + Waymo profile

**New `/cv/` Vite entry** — the comprehensive counterpart to `/resume/`. Where the résumé renders
a tailored *selection*, the CV shows everything in `src/data.js` (all work + activities, all
projects sorted by recency, full skills, full coursework) and flows across multiple Letter pages.
- `cv/index.html` (3rd entry), `src/cv/main.jsx`, `src/cv/Cv.jsx`, `src/cv/print.css`.
- Reuses the résumé's `r-*` classes + `src/resume/print.css` (imported, not duplicated); CV CSS
  only adds the `.cv-kicker` label and lets the on-screen sheet grow past 11in.
- Registered `cv: cv/index.html` in `vite.config.js` `rollupOptions.input`.
- Verified: `npm run lint` + `npm run build` clean, `dist/cv/index.html` emitted, no `__admin` in
  `dist/`. Preview at `/cv/` (Print / Save-PDF, header/footer already suppressed).

**Waymo profile** — appended `waymo-ml-accelerator-kernels-intern` ("ML Accelerator Kernels Intern
@ Waymo") to `content/resume-profiles.json`. Active left as `general`. NOTE: this role (low-level
ML-accelerator kernels in CUDA/Triton DSLs, transformer-inference perf optimization, agentic
kernel-gen harnesses) is a stretch vs the portfolio — no CUDA/Triton/kernel experience; selected
the closest fits only (surgical-video-vlm, hardware-planner/SparkBuild agentic harness, moveright
real-time inference, agat C/C++ low-level). Shown projects: moveright, surgical-video-vlm,
hardware-planner, agat. Shown exp: 3 work + soda-code-challenge. Kept full AI/Data skills.

## Previous task — Garmin SWE Intern résumé profile (resume-from-jd)

Appended profile `garmin-software-engineering-intern` ("Software Engineering Intern @ Garmin") to
`content/resume-profiles.json`. Active left as `general` (user chose not to publish).

- Garmin JD = embedded C/C++/Assembly for communication & navigation (avionics) products, testing
  with debuggers/emulators/simulators/logic analyzers, DevOps/Mobile/Web teams, data-structures +
  OOP fundamentals, teamwork; desired Aerospace focus.
- Projects shown (5): AGAT (embedded C/C++ aviation TCAS, Kalman filter), V.I.B.E (aerospace VR),
  MUD (C/C#/OOP + Git teamwork), ShelfSmart (IoT embedded + sensors), AssembliSim (simulation).
  Hid yber, wifi-portal, quotation-engine, moveright, oratori, fit2u, sir-model,
  surgical-video-vlm, hardware-planner.
- Experiences shown (4): 3 work (ShelfSmart, Yber, Yazaki) + soda-code-challenge (Java/data
  structures/team). Hid the rest incl. the AGAT/VIBE/AssembliSim hackathon rows (project cards
  already represent them) and the AI/web activities.
- Skills pruned to embedded/systems/fundamentals: kept C/C++, C#, Java, Python, React Native
  (mobile), Three.js, WebSockets, Docker/Git/GitHub, OpenCV, Kalman Filter, Arduino/ESP32/ESP-NOW/
  Raspberry Pi/Altium. Dropped the whole Enterprise category and most AI/LLM + styling/CAD items.
- Coursework kept (Data Structures, OOP, OS, Programming Languages directly match the JD).
  `check-content.mjs` passes. Preview: `/resume/?profile=garmin-software-engineering-intern`.

## Previous task — Suppress browser print header/footer on /resume/

`src/resume/print.css`: set `@page { margin: 0 }` (Chrome only injects its URL/date/title/
page-number header & footer when the page margin leaves room) and moved the 0.5in inset onto
`.r-page { padding: 0.5in }` in the `@media print` block so the layout is unchanged. This removes
the top-left date, top-center "Tylor Duong - Resume" title, bottom URL, and bottom page number
from exported/printed résumés.

## Previous task — Intel SWE Intern résumé profile (resume-from-jd)

Appended profile `intel-software-engineering-intern` ("Software Engineering Intern @ Intel") to
`content/resume-profiles.json`. Active profile left as `general` (user chose not to publish).

- Projects shown (5): AGAT, AssembliSim, ShelfSmart, SparkBuild, MoveRight — firmware/embedded,
  manufacturing simulation, IoT hardware+data, hardware+validation, AI/CV (maps to Intel's
  firmware/systems/GPU/AI-frameworks tracks). Hid yber, wifi-portal, quotation-engine, oratori,
  fit2u, vibe, sir-model, mud, surgical-video-vlm.
- Experiences shown (5): 3 work (ShelfSmart, Yber, Yazaki) + asu-capstone-surgical-vlm (research)
  + soda-code-challenge (problem solving). Hid the hackathon/activity entries incl. the
  AGAT/AssembliSim hackathon rows (their project cards already represent them).
- Skills pruned per category (hid web-only/niche items: HTML/CSS, RN/Tailwind/Styled/Figma,
  Express/MySQL/Mongo/Supabase/Firebase, Vercel, Gemini API/OpenRouter/LLaVA/Ollama, Blender,
  Power Platform/Apps/n8n/SharePoint). Kept C/C++, Python, PyTorch, Arduino/ESP32/Altium, etc.
- Coursework kept (new-grad/intern role). `check-content.mjs` passes (only the pre-existing
  unfiled-tech notes remain). Preview: `/resume/?profile=intel-software-engineering-intern`.

## Previous task — Résumé profiles (admin tab + 2 skills)

Added deployable, admin-managed résumé profiles and two Claude skills.

**What shipped**
- New content entity `content/resume-profiles.json` — `{ active, profiles: [{ id, name, selection }] }`.
  `selection` uses the "store what is HIDDEN" model from `src/resume/selection.js`. Seeded one
  `general` profile equal to the previous curated (`resume.include`) selection.
- `tools/content-schema.js` — `resume-profiles` added to `ENTITIES` + a `validate` case.
- `src/data.js` — exports `resumeProfiles`, `activeResumeProfileId` (raw passthrough; resolving a
  selection here would cycle with `selection.js`).
- `src/resume/selection.js` — new `profileSelection(id)` (falls back to curated).
- `src/resume/Resume.jsx` — renders the active profile, or `?profile=<id>` override (admin preview).
- Retired the dev-only panel: deleted `src/resume/ExportPanel.jsx`, `src/resume/presets.js`, and the
  `body.has-export-panel` block in `print.css`.
- `admin/App.jsx` — "Résumé" tab added to the tab bar (replaced the old header `RÉSUMÉ ↗` arrow).
- `admin/ResumePane.jsx` — new: profile list (new/duplicate/delete/rename/set-live) + checkbox
  selection editor (info/contact, experience, projects, skills) + Preview/Download link to
  `/resume/?profile=<id>`.
- Skills: `.claude/skills/resume-from-jd/` (JD → tailored profile) and `.claude/skills/tidy-skills/`
  (file unfiled tech tags into Skills & Tools categories + relevance audit).

**Verified**: `npm run lint`, `npm run build` (no `__admin` in `dist/`), `check-content.mjs` passes,
live admin API serves the new entity (`active: general`, 1 profile).

**Open follow-ups (not done)**
- The Skills backlog `check-content.mjs` still reports (Unity2D, YOLOv8, ViTPose++, Vosk, etc.) is
  intentionally left for the user to run the `tidy-skills` skill on.
- Nothing published — `npm run deploy` only on request.
