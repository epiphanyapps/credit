# Getting Access to Consumer Credit Reports via API — Practical Startup Guide

## TL;DR

**Can a pre-revenue startup pull credit reports via API?** Yes, but it takes 2-4 months and ~$7-25K upfront (compliance attorney, insurance, credentialing). The PDF upload + AI parsing MVP is still the fastest path to market.

---

## The Regulatory Reality

The **FCRA** governs all access to consumer credit reports. You need a **permissible purpose** under Section 604:
- Consumer authorized (written consent for a specific purpose)
- Credit transaction (consumer applied for credit from you)
- Account review, employment, insurance, legitimate business need

**What you need as a business:**
1. Registered business entity with EIN
2. Identified permissible purpose tied to your business model
3. Physical office inspection (locked door, company logo, paper shredder)
4. GLBA-compliant data security infrastructure
5. FCRA compliance policies including dispute handling procedures
6. E&O (Errors & Omissions) insurance

---

## Vendor Comparison

### Bloom Credit (bloomcredit.io)
- **What:** Credit data infrastructure — intermediary between you and 3 bureaus
- **Onboarding:** Tech integration "in a week," but bureau credentialing takes **4-12 weeks** with Bloom facilitating (vs 6-12+ months direct)
- **Pricing:** Not public. Per-pull pricing, pay-as-you-go. Estimate ~$1-5/single-bureau, $10-30/tri-merge
- **Data:** Structured JSON, all 3 bureaus, includes scores
- **Sandbox:** Yes, separate sandbox environment (not self-serve, must contact sales)
- **Dispute support:** Has e-OSCAR integration for filing disputes electronically
- **Startup-friendly:** Yes, explicitly markets to startups. No stated minimums
- **Best for:** Raw API access, backend credit data, dispute management

### Array (array.com)
- **What:** Embedded fintech products platform — pre-built white-label components
- **Onboarding:** Deployment in "weeks" for embeddable tools
- **Pricing:** Not public. Pay-per-user or pay-per-engagement model
- **Data:** JSON, XML, PDF. MISMO 2.4 standard. 1-bureau and 3-bureau reports
- **Sandbox:** Yes, at sandbox.array.io
- **Key differentiator:** 25+ embeddable white-label components including credit report viewer, score tracker, monitoring alerts, score simulator, and **built-in KBA authentication + direct dispute filing**
- **Range:** Works with $2M credit unions to largest multinational banks
- **Best for:** Consumer-facing credit monitoring, white-label "My Credit Manager" experience

### Other Options
| Vendor | Best For | Pricing |
|--------|----------|---------|
| iSoftpull | Soft pulls only | $2.90-3.99/pull |
| Soft Pull Solutions | Easiest onboarding, no long-term contracts | Custom |
| MicroBilt | Alternative + traditional data | Custom |
| Nova Credit (YC-backed) | Cross-border / alternative data (NOT traditional bureau reports) | Custom |
| Plaid | Bank data / cash flow (NOT bureau reports) | Per-connection |

---

## Realistic Timeline for a Startup

| Phase | Duration | What Happens |
|-------|----------|--------------|
| Foundation | Week 1-2 | Legal entity, define permissible purpose, compliance office setup |
| Vendor selection + sandbox | Week 2-4 | Sales calls with Bloom/Array, get sandbox credentials, start building |
| Bureau credentialing | Week 4-12 | Paperwork, site inspection, compliance review — **this is the bottleneck** |
| Production | Week 8-16 | Production credentials, low-volume testing, launch |

**Total: 2-4 months** with a facilitator like Bloom. 6-12+ months going direct to bureaus.

## Startup Budget

| Item | Cost |
|------|------|
| Compliance attorney | $5,000 - $15,000 |
| E&O Insurance | $1,000 - $3,000/year |
| Site inspection | $200 - $500 |
| Vendor platform/setup fees | $0 - $5,000 |
| Per-pull costs (testing) | $100 - $500 |
| **Total to get started** | **~$7,000 - $25,000** |

---

## Recommendation for Our App

### Phase 1 (Launch — NOW): PDF Upload + AI Parsing
- Zero regulatory overhead
- User downloads from annualcreditreport.com, uploads PDF
- Claude API parses into structured data
- **Gets us to market immediately**

### Phase 2 (Month 2-3): Start Vendor Conversations
- Contact Bloom Credit and Array for pricing
- Get sandbox credentials
- Begin compliance setup (attorney, policies)
- Build integration in parallel using sandbox

### Phase 3 (Month 4-6): In-App Report Pulling
- Complete bureau credentialing
- Launch in-app credit report access
- Massive UX improvement — users never leave the app

### Why Both Tiers Matter
- PDF parsing = fast to market, zero cost, no regulatory burden
- API access = better UX, repeat engagement, credit monitoring features (Pro tier)
- Having both means free users get PDF import, Pro users get in-app pulling

---

## CROA Compliance Note

If we help users dispute items, we may be classified as a **Credit Repair Organization** under CROA (15 USC §1679). Requirements:
- Written contract with consumer before any services
- 3-business-day cancellation right
- Cannot charge fees before services are fully performed
- Specific required disclosures
- Cannot make false claims about what we can do

**Consult a compliance attorney before launch.**
