# Interactive Workflows & Flowcharts

This page illustrates the core engineering workflows in this repository through interactive Mermaid diagrams.

---

## 1. Continuous Task & Issue Queue Workflow

How tasks are created, locked, executed, verified, and completed autonomously across single or multiple terminal sessions.

```mermaid
flowchart TD
    Start([👤 User queues new issue or roadmap item]) --> Step1[1. Task recorded in .agents/state/progress.json]
    Step1 --> Step2{Any active task in progress?}
    
    Step2 -- Yes --> Step3[Task waits in TODO queue]
    Step2 -- No --> Step4[2. Lock task as IN_PROGRESS]
    
    Step4 --> Step5[3. Assign specialized Subagent swarm]
    Step5 --> Step6[4. Subagents implement Schema, API & UI]
    
    Step6 --> Step7[5. Run Quality Gate: npm run agent:doctor]
    Step7 --> Step8{All 23 checks passed?}
    
    Step8 -- No --> Step9[Subagent fixes lints/types/errors]
    Step9 --> Step7
    
    Step8 -- Yes --> Step10[6. Mark COMPLETED in progress.json & roadmap]
    Step10 --> Step11[7. Unlock next item in queue]
    Step11 --> Step2
```

---

## 2. Multi-Agent Swarm & Peer Consensus Workflow

How specialized subagents collaborate, discuss API contracts, and agree on technical solutions before committing code.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Developer / User
    participant Lead as 🤖 Lead Agent (Orchestrator)
    participant DB as 🗄️ db-engineer
    participant UI as 🎨 ui-designer
    participant Doc as 📝 doc-writer

    User->>Lead: "Implement Issue #2: Rich Media Project Cards"
    Lead->>Lead: Break down task (DB Schema + Video UI + ADR)
    Lead-->>User: Propose Swarm: db-engineer + ui-designer + doc-writer
    User->>Lead: Approve

    rect rgb(20, 30, 45)
    Note over DB,UI: Peer Discussion & Interface Consensus
    UI->>DB: "What field names for video and gallery screenshots?"
    DB-->>UI: "videoPreviewUrl (String?) and galleryImages (String? CSV)"
    UI->>DB: "Agreed. Default to nullable so existing records don't break."
    end

    par Parallel Database & Doc Creation
        DB->>DB: Update schema.prisma & run prisma db push
    and
        Doc->>Doc: Draft ADR in docs/adr/
    end

    DB-->>UI: "Schema pushed and Prisma Client generated"
    UI->>UI: Build ProjectMediaPreview.tsx with Framer Motion

    Lead->>Lead: Execute npm run agent:doctor & build
    Lead-->>User: "Issue #2 completed and verified! (23/23 passed)"
```

---

## 3. 4-Stage CI/CD Quality Gate Pipeline

Every Pull Request and commit to `main` must pass all 4 quality gates in `.github/workflows/ci.yml`.

```mermaid
flowchart LR
    Commit([🚀 Git Push / PR]) --> Gate1
    
    subgraph Pipeline [GitHub Actions CI Pipeline]
        Gate1[1. Prisma Validate<br/>npx prisma validate] --> Gate2[2. Type Check<br/>npx tsc --noEmit]
        Gate2 --> Gate3[3. ESLint Check<br/>npm run lint]
        Gate3 --> Gate4[4. Next.js Build<br/>npm run build]
    end
    
    Gate4 --> Success([✅ Pass: Ready to Deploy])
```
