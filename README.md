# Credit Repair App

**Mobile-first AI-powered DIY credit repair.** Stop paying credit repair companies $100-150/month for something you can do yourself — better, faster, and from your phone.

Targeting the **$6.8B US credit repair market** (growing 14% CAGR) with a massive vacuum from Lexington Law's collapse.

## What This Does

1. **Import your credit report** — Upload a PDF from annualcreditreport.com
2. **AI analyzes and flags issues** — Identifies inaccurate items, collections, late payments, unauthorized inquiries, outdated items
3. **Generates legally-grounded dispute letters** — FCRA §611, §623, FDCPA §809, goodwill letters, pay-for-delete
4. **Sends certified mail** — Built-in Lob API integration, no trips to the post office
5. **Tracks everything** — Deadlines, responses, next actions, success rates
6. **Helps you negotiate** — Settlement calculator based on insider collection agency economics

## Why This Exists

Credit repair companies charge $400-1,100+ to do something you're legally entitled to do yourself for free. They:
- Send the same template letters you can write in 20 minutes
- Drag the process out over 4+ months to maximize billing
- Have no special relationship with credit bureaus (they'll claim otherwise)
- Sometimes forge signatures and impersonate you (illegal under CROA)

This app gives you the same tools — plus AI-powered analysis and insider strategies that credit repair companies don't even use.

## Business Model

| | Free | Pro ($19-29/mo) |
|---|---|---|
| Import credit report (PDF) | Yes | Yes |
| AI analysis + flag issues | Yes | Yes |
| Dispute letters | 1/month | Unlimited |
| Educational content | Yes | Yes |
| Certified mail (Lob) | — | Yes |
| All 4 dispute rounds | Round 1 only | Yes |
| Settlement calculator | — | Yes |
| Pay-then-dispute workflow | — | Yes |
| Outcome analytics | Basic | Full |
| Push reminders | — | Yes |

## The Dispute Process

The app walks users through a proven multi-round escalation strategy:

```
Import Credit Report → AI Flags Items → Categorize
    |
    ├── Inaccurate Info → Round 1 (§611) → Round 2 (MOV) → Round 3 (Warning) → Round 4 (§623) → CFPB
    ├── Collections → Debt Validation (FDCPA) OR Settlement → Pay-then-Dispute
    ├── Late Payments → Goodwill Letter → Retry in 90 days
    ├── Hard Inquiries → Request Permissible Purpose → Dispute
    ├── Outdated Items → Dispute (should auto-remove)
    └── Personal Info Errors → Direct Bureau Dispute
```

See [dispute-flowchart.md](dispute-flowchart.md) for the complete decision tree.

## Key Strategies (From Research)

### Pay-Then-Dispute (Insider Strategy)
Source: Collection agency owner. Once you settle a debt, the creditor has zero interest in your credit report. Dispute the item → they don't respond → bureau must delete it within 30 days.

### Settlement Negotiation
- Debt portfolios are bought at **~12 cents on the dollar**
- Agencies only collect on **10-20% of accounts**
- Call on the **last business day of the month** (collectors in "bonus line")
- Offer **~50% of their number** — still profitable for them
- Get agreement **in writing (email) before paying**

### More Accounts = Faster Recovery
Payment history is 35% of your score and has razor-thin margins (97% = bad). Opening multiple credit lines and making on-time payments on all of them accelerates the % recovery exponentially vs. a single account.

## Tech Stack

```
epiphanyapps/credit/
├── apps/
│   ├── web/          # Next.js — landing page, SEO, blog
│   └── mobile/       # Expo + Ignite — core product
├── packages/
│   └── shared/       # Letter templates, calculations, types
└── research/         # Legal framework, video analysis, competitive intel
```

- **Mobile**: Expo + [Ignite](https://github.com/infinitered/ignite) (MobX-State-Tree, React Navigation, Expo Router)
- **Web**: Next.js (landing page, SEO content)
- **Mail**: Lob API (certified mail with tracking)
- **AI**: Claude API (credit report parsing, dispute letter generation)
- **Data**: Local-first (Expo SQLite or WatermelonDB)

## Research

| Document | Description |
|----------|-------------|
| [legal-framework.md](legal-framework.md) | FCRA, FDCPA, CROA — your legal rights and how to use them |
| [research/video-analysis.md](research/video-analysis.md) | Insider insights from a collection agency owner |
| [dispute-flowchart.md](dispute-flowchart.md) | Complete decision tree for the dispute process |

## Competitive Landscape

| Competitor | Price | Mobile | Mail | AI | Our Edge |
|------------|-------|--------|------|-----|----------|
| DisputeBee | $49/mo | No | No | Templates only | Mobile + mail + real AI |
| Credit Repair Cloud | $179-599/mo | Limited | CloudMail | Basic | 10x cheaper, consumer-focused |
| Dovly | Free-$40/mo | Yes | No | Marketing only | Better AI + mail + strategies |
| Dispute Panda | $12-17/dispute | No | No | No | Full workflow, not just letters |

## Milestones

- **M1: Research & Foundation** — Legal framework, competitive analysis, dispute flowchart *(mostly complete)*
- **M2: Letter Templates & Automation** — All dispute letter types + credit report import
- **M3: Physical Mail Integration** — Lob API for certified mail
- **M4: Tracking & Workflow** — Dispute tracker, settlement tools, outcome analytics

## Project Board

[GitHub Project](https://github.com/orgs/epiphanyapps/projects/24)

## Legal References

- **FCRA** (Fair Credit Reporting Act) — 15 USC §1681. Sections 609, 611, 623.
- **FDCPA** (Fair Debt Collection Practices Act) — 15 USC §1692. Section 809.
- **CROA** (Credit Repair Organizations Act) — 15 USC §1679.
- **CFPB** — consumerfinance.gov/complaint (free dispute escalation)
- Bureau addresses: Equifax (P.O. Box 740256, Atlanta, GA 30374), Experian (P.O. Box 4500, Allen, TX 75013), TransUnion (P.O. Box 2000, Chester, PA 19016)
