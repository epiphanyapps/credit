# Credit Repair Dispute Flowchart
## Complete Decision Tree for Mobile App UX

---

## MASTER FLOW OVERVIEW

```
USER IMPORTS CREDIT REPORT
        |
        v
AI SCANS & FLAGS ITEMS
        |
        v
CATEGORIZE EACH FLAGGED ITEM
        |
        +---> [A] Inaccurate Information
        +---> [B] Collection Accounts
        +---> [C] Late Payments
        +---> [D] Hard Inquiries
        +---> [E] Outdated Items (>7 yrs / >10 yrs bankruptcy)
        +---> [F] Personal Information Errors
        |
        v
PARALLEL TRACK (always running):
  - Credit Building Path
  - Utilization Optimization
```

---

## ENTRY POINT: CREDIT REPORT IMPORT & AI ANALYSIS

```
[START]
   |
   v
User connects credit report
(via API, PDF upload, or manual entry)
   |
   v
APP DATA NEEDED:
  - Full credit report from all 3 bureaus
  - User's state of residence (for SOL lookup)
  - User's financial situation (income, savings — for settlement path)
   |
   v
AI ENGINE SCANS REPORT
   |
   +---> Flag accounts with wrong balances
   +---> Flag accounts with wrong dates
   +---> Flag accounts user doesn't recognize
   +---> Flag collection accounts
   +---> Flag late payment marks
   +---> Flag hard inquiries (cross-reference with user's known applications)
   +---> Flag items older than 7 years (10 for bankruptcy)
   +---> Flag personal info errors (wrong name spelling, wrong address, wrong SSN)
   +---> Flag duplicate accounts (same debt reported by multiple parties)
   |
   v
PRESENT FLAGGED ITEMS TO USER
   |
   v
USER DECISION: For each item, confirm or dismiss the flag
   |
   +---> User confirms: "Yes, this is wrong" --> Route to appropriate path
   +---> User dismisses: "No, this is accurate" --> Remove from dispute queue
   +---> User unsure: "I need to check" --> Mark as pending, remind in 3 days
   |
   v
PRIORITIZATION ENGINE
   |
   APP LOGIC: Rank items by estimated score impact:
   |  1. Inaccurate accounts (highest impact — entire tradeline removal)
   |  2. Collection accounts (high impact — derogatory marks)
   |  3. Late payments (high impact — payment history = 35% of score)
   |  4. Outdated items (medium — should be easy wins)
   |  5. Hard inquiries (low impact — 10% of score, temporary)
   |  6. Personal info errors (no direct score impact, but affects matching)
   |
   v
BUREAU PRIORITY: Start with TransUnion (most complete data,
cheapest for agencies to report to), then Experian, then Equifax
   |
   v
ROUTE EACH ITEM TO ITS DISPUTE PATH
```

---

## PATH A: INACCURATE INFORMATION

**Covers:** Wrong balance, wrong date, wrong account status, account not yours, duplicate entries, wrong creditor name, incorrect payment history

```
[A-START] Inaccurate Information Identified
   |
   v
APP DATA NEEDED:
  - Specific inaccuracy type (balance, date, status, ownership, etc.)
  - Supporting documentation (bank statements, payment receipts, ID theft report)
  - Account number, creditor name, bureau(s) reporting it
   |
   v
USER DECISION: What type of inaccuracy?
   |
   +---> "Not my account" --> Identity theft sub-path (see A-ID below)
   +---> "Wrong balance/date/status" --> Standard dispute path
   +---> "Duplicate entry" --> Standard dispute path (cite duplicate)
   |
   v
==============================
ROUND 1: Bureau Dispute (FCRA Section 611)
==============================
   |
   v
APP ACTION: Generate dispute letter
   - Cite FCRA Section 611
   - Identify specific inaccuracy with evidence
   - Send via certified mail (or online if user prefers speed over paper trail)
   - Send to ALL bureaus reporting the item
   |
   TIMER: 30-day countdown starts on date letter received
   |        (up to 45 days if user submits additional info during window)
   |
   v
APP MONITORS: Check for response at day 25, 30, 35
   |
   v
OUTCOME?
   |
   +---> ITEM REMOVED/CORRECTED
   |        |
   |        v
   |     [DONE - SUCCESS]
   |     APP ACTION: Log result, update score estimate,
   |     celebrate with user, move to next item
   |
   +---> ITEM VERIFIED (bureau says "verified as accurate")
   |        |
   |        v
   |     ROUND 2 (see below)
   |
   +---> NO RESPONSE WITHIN 30 DAYS
   |        |
   |        v
   |     APP ACTION: Item must be deleted per FCRA Section 611
   |     Generate follow-up letter demanding deletion
   |     If bureau still does not comply --> CFPB complaint (skip to Round 5)
   |
   +---> DISPUTE MARKED "FRIVOLOUS"
            |
            v
         APP ACTION: Bureau is claiming dispute lacks substance
         USER DECISION: Gather stronger documentation and resubmit
         APP GUIDANCE: Explain what "frivolous" means, suggest specific
         evidence types (bank statements, police reports, etc.)
         --> Resubmit as new Round 1 with better evidence

==============================
ROUND 2: Method of Verification Request (FCRA Section 611(a)(6)-(7))
==============================
   |
   v
APP ACTION: Generate MOV request letter
   - Cite FCRA Section 611(a)(6) and (7)
   - Reference the dispute ID / investigation number from Round 1
   - Request: How did you verify? What documents were reviewed?
     Who at the furnisher confirmed? What method was used?
   - Send via certified mail
   |
   TIMER: 15-day countdown (bureau must respond with MOV info)
   |
   v
OUTCOME?
   |
   +---> MOV REVEALS INADEQUATE INVESTIGATION
   |     (e.g., "verified via e-OSCAR automated system" or
   |      generic response without specifics)
   |        |
   |        v
   |     APP INSIGHT: Display to user — "The bureau used an automated
   |     system that reduces your dispute to a 2-digit code. This may
   |     not meet the FCRA's 'reasonable reinvestigation' standard."
   |        |
   |        v
   |     ROUND 3 (see below)
   |
   +---> MOV SHOWS LEGITIMATE VERIFICATION
   |     (furnisher provided actual documentation)
   |        |
   |        v
   |     USER DECISION: Is the verification convincing?
   |        +---> Yes --> Item may be accurate. User can add 100-word
   |        |             consumer statement or accept and move on.
   |        +---> No --> ROUND 3 (see below)
   |
   +---> NO RESPONSE TO MOV REQUEST
            |
            v
         APP ACTION: Bureau violated FCRA by not providing MOV within 15 days
         --> Skip to ROUND 3 with this violation as additional leverage

==============================
ROUND 3: Warning / Intent to Litigate Letter
==============================
   |
   v
APP ACTION: Generate escalation letter
   - Reference all prior disputes and their results
   - Cite e-OSCAR inadequacy / MOV failures
   - State: "Failure to conduct a reasonable reinvestigation
     per FCRA Section 611 constitutes a willful violation"
   - Reference damages: $100-$1,000 per willful violation + punitive + attorney fees
   - State intent to pursue legal remedies if not resolved within 30 days
   - Send via certified mail
   |
   TIMER: 30-day countdown
   |
   v
OUTCOME?
   |
   +---> ITEM REMOVED/CORRECTED --> [DONE - SUCCESS]
   |
   +---> STILL VERIFIED --> ROUND 4 (see below)

==============================
ROUND 4: Direct Furnisher Dispute (FCRA Section 623)
==============================
   |
   v
APP DATA NEEDED:
  - Furnisher name and mailing address (from credit report)
  - Account number
  - All prior dispute documentation and results
   |
   v
APP ACTION: Generate Section 623 direct dispute letter
   - Send directly to the creditor/furnisher (bypassing the bureau)
   - Cite FCRA Section 623(a)(8) — direct dispute right
   - Include all evidence of inaccuracy
   - Reference prior bureau disputes and their inadequate investigations
   - Send via certified mail
   |
   TIMER: 30-day countdown (furnisher must investigate and respond)
   |
   v
OUTCOME?
   |
   +---> FURNISHER CORRECTS/DELETES --> [DONE - SUCCESS]
   |     (Furnisher must notify all CRAs per Section 623)
   |
   +---> FURNISHER VERIFIES AS ACCURATE --> ROUND 5 (see below)
   |
   +---> NO RESPONSE --> ROUND 5 with non-response as violation

==============================
ROUND 5: CFPB Complaint
==============================
   |
   v
APP ACTION: Guide user through CFPB complaint at consumerfinance.gov/complaint
   - Pre-fill complaint with all dispute history
   - Include: dates of all disputes, responses received, evidence submitted
   - Reference specific FCRA violations
   |
   TIMER: Company typically responds within 15 days; final response up to 60 days
   |
   v
OUTCOME?
   |
   +---> ITEM REMOVED/CORRECTED --> [DONE - SUCCESS]
   |
   +---> COMPANY RESPONDS BUT ITEM REMAINS
   |        |
   |        v
   |     USER DECISION: Provide feedback via CFPB post-complaint survey
   |     --> ROUND 6 (see below)
   |
   +---> NO RESPONSE FROM COMPANY --> ROUND 6

==============================
ROUND 6: Legal Escalation
==============================
   |
   v
APP GUIDANCE: Present options to user
   |
   +---> Option A: Consult FCRA attorney
   |     - FCRA is a fee-shifting statute (defendant pays if you win)
   |     - Many attorneys take cases on contingency
   |     - Willful violations: $100-$1,000 statutory damages per violation
   |       + punitive damages + attorney fees
   |     - APP ACTION: Provide attorney referral resources
   |
   +---> Option B: Small claims court
   |     - File pro se (without attorney)
   |     - Lower cost, but limited damages
   |     - APP ACTION: Provide small claims guide for user's state
   |
   +---> Option C: State attorney general complaint
   |     - Additional regulatory pressure
   |     - APP ACTION: Provide AG contact for user's state
   |
   +---> Option D: Accept and wait
         - Add 100-word consumer statement to credit report
         - Item falls off after 7 years from date of first delinquency
         - Focus on other score improvement strategies
```

### Sub-Path A-ID: Identity Theft / Not My Account

```
[A-ID] Account does not belong to user
   |
   v
USER DECISION: Do you suspect identity theft?
   |
   +---> YES: Identity Theft Path
   |     |
   |     v
   |     APP ACTIONS (guide user through all):
   |     1. File identity theft report at IdentityTheft.gov
   |     2. Place fraud alert with one bureau (it propagates to all 3)
   |     3. Consider credit freeze with all 3 bureaus
   |     4. File police report (optional but strengthens case)
   |     5. Send identity theft dispute letter to all bureaus
   |        - Include FTC Identity Theft Report
   |        - Cite FCRA Section 605B (identity theft block)
   |        - Bureau must block item within 4 business days
   |     |
   |     TIMER: 4 business days for block
   |     |
   |     v
   |     If not blocked --> CFPB complaint + attorney referral
   |
   +---> NO: Mixed file / data error
         |
         v
         Route to standard ROUND 1 dispute path
         Emphasize: "This account does not belong to me"
         Include: Photo ID, proof of address, SSN documentation
```

---

## PATH B: COLLECTION ACCOUNTS

```
[B-START] Collection Account Identified
   |
   v
APP DATA NEEDED:
  - Original creditor name
  - Current collector name
  - Original balance vs. current balance
  - Date of first delinquency (DOFD)
  - Date collection was placed
  - User's state of residence
  - User's financial situation
   |
   v
APP CALCULATES:
  - Time since DOFD (is it near the 7-year reporting limit?)
  - State statute of limitations (SOL) — is debt time-barred?
  - Estimated purchase price by collector (~12 cents on the dollar)
  - Settlement range suggestion (40-50% of collector's offer)
   |
   v
TRIAGE DECISION TREE:
   |
   +---> Is debt older than 7 years from DOFD?
   |     +---> YES --> Route to PATH E (Outdated Items)
   |     +---> NO --> Continue
   |
   +---> Is state SOL expired?
   |     +---> YES --> PATH B-C (Time-Barred Debt) below
   |     +---> NO --> Continue
   |
   +---> Does user recognize the debt as legitimate?
   |     +---> NO / UNSURE --> PATH B-A (Debt Validation)
   |     +---> YES --> Continue
   |
   +---> Can user afford to settle?
         +---> NO --> PATH B-A (Debt Validation — challenge it)
         +---> YES --> PATH B-B (Settlement + Pay-Then-Dispute)

==============================
PATH B-A: Debt Validation (Can't Pay / Don't Recognize)
==============================
   |
   v
APP ACTION: Generate debt validation letter (FDCPA Section 809)
   - Request: Original creditor name, original signed agreement,
     complete payment history, itemized balance breakdown,
     proof collector is licensed in user's state
   - Send via certified mail within 30 days of first collector contact
   - CRITICAL: Do NOT acknowledge the debt or promise payment
   |
   APP WARNING: If debt is near SOL expiry, warn user that
   |  acknowledging the debt could restart the SOL clock in some states
   |
   TIMER: No statutory deadline for collector to respond, BUT
          collector must CEASE all collection activity until validated
   |
   v
OUTCOME?
   |
   +---> COLLECTOR CANNOT VALIDATE / NO RESPONSE
   |     |
   |     v
   |     APP ACTIONS:
   |     1. Generate dispute letter to all 3 bureaus
   |        - "Collection account not validated per FDCPA Section 809"
   |        - Include copy of validation request + certified mail receipt
   |     2. If collector continues reporting:
   |        - This is an FDCPA violation
   |        - File CFPB complaint
   |        - Consider FDCPA lawsuit ($1,000 statutory damages per suit
   |          + actual damages + attorney fees)
   |     |
   |     TIMER: 30 days for bureau investigation
   |     |
   |     v
   |     ITEM REMOVED --> [DONE - SUCCESS]
   |     ITEM VERIFIED --> Escalate per Path A rounds (MOV, 623, CFPB)
   |
   +---> COLLECTOR VALIDATES WITH DOCUMENTATION
         |
         v
         USER DECISION: Is the validation convincing?
         |
         +---> NO (incomplete, inconsistent, no original agreement)
         |     |
         |     v
         |     APP ACTION: Generate follow-up letter challenging
         |     the adequacy of validation
         |     - Itemize what's missing
         |     - Demand complete documentation
         |     - If still inadequate --> Dispute with bureaus
         |
         +---> YES (debt appears legitimate)
               |
               v
               USER DECISION: Can you afford to settle now?
               +---> YES --> Route to PATH B-B
               +---> NO --> APP GUIDANCE:
                     - Do not ignore — SOL may still be running
                     - Consider hardship options
                     - Set reminder to revisit in 3 months
                     - Focus on credit building in parallel

==============================
PATH B-B: Settlement + Pay-Then-Dispute Strategy
==============================
   |
   v
APP CALCULATES:
  - Collector likely paid ~12 cents on the dollar for this debt
  - If collector offers $4,500 --> suggest settling for ~$2,250 (50%)
  - Even 50% of their offer is highly profitable for them
   |
   v
NEGOTIATION GUIDANCE:
   |
   v
STEP 1: Timing
   - APP ACTION: Show calendar highlighting last business day of each month
   - REASON: Collectors on "bonus line" — already hit monthly goal,
     extra collections go toward personal bonus, highly motivated to close
   |
   v
STEP 2: The Call
   - APP PROVIDES: Script for negotiation call
   - Key phrases: "I can settle this today if we can agree on a number"
   - Start at 30-40% of their stated amount
   - Target: 40-50% of their stated amount
   - NEVER agree to more than 60% unless debt is very recent
   |
   v
STEP 3: Get It in Writing
   - CRITICAL: Do NOT pay until you have written settlement agreement
   - Agreement must state: amount accepted as settlement in full,
     account will be reported as "paid/settled," no further collection
   - Get it via email or mail before sending payment
   - APP ACTION: Provide checklist of what the agreement must contain
   |
   v
STEP 4: Pay
   - Pay via method that creates a clear record (check, bank transfer)
   - Do NOT give them direct access to your bank account
   - Save all payment confirmation
   |
   TIMER: Wait for payment to post and confirmation to arrive (7-14 days)
   |
   v
STEP 5: Pay-Then-Dispute
   - APP INSIGHT: "Once paid, the creditor/collector has no financial
     interest in your credit report. They are unlikely to spend time
     responding to a bureau dispute."
   - APP ACTION: Generate dispute letters to ALL 3 bureaus
   - Dispute the entire tradeline (not just the balance)
   - Bureau contacts collector --> Collector doesn't bother responding
     --> Item deleted for non-verification within 30 days
   |
   TIMER: 30-day countdown per bureau
   |
   v
OUTCOME?
   |
   +---> ITEM REMOVED FROM ALL 3 BUREAUS --> [DONE - SUCCESS]
   |
   +---> ITEM REMOVED FROM SOME BUT NOT ALL
   |     |
   |     v
   |     APP ACTION: Send second round of disputes to remaining bureaus
   |     with evidence of removal from other bureau(s)
   |
   +---> ITEM VERIFIED (collector actually responded)
         |
         v
         Route to Path A escalation rounds (MOV, 623, CFPB)
         Additional leverage: "I paid this debt, the balance
         is zero, continued negative reporting is inaccurate"

==============================
PATH B-C: Time-Barred Debt (SOL Expired)
==============================
   |
   v
APP DISPLAYS:
  - "This debt is past the statute of limitations in your state"
  - "The collector CANNOT sue you or threaten to sue you (FDCPA violation)"
  - "However, the debt may still appear on your credit report until
     7 years from the date of first delinquency"
   |
   v
APP WARNING:
  - "Do NOT make a payment or acknowledge this debt in writing"
  - "In many states, this can restart the statute of limitations"
  - "Do NOT provide your date of birth or SSN to the collector"
   |
   v
APP ACTION: Generate dispute letter to bureaus
   - Cite that debt is time-barred
   - Request removal or note that SOL has expired
   - If collector is threatening legal action, this is an FDCPA
     violation --> File CFPB complaint + consider FDCPA lawsuit
   |
   TIMER: 30 days for bureau investigation
   |
   v
OUTCOME?
   |
   +---> REMOVED --> [DONE - SUCCESS]
   +---> VERIFIED --> Escalate per Path A rounds
         NOTE: Time-barred status is strong leverage for
         CFPB complaints and legal escalation
```

---

## PATH C: LATE PAYMENTS

```
[C-START] Late Payment(s) Identified
   |
   v
APP DATA NEEDED:
  - Which creditor reported the late payment
  - How many late payments on this account
  - How late (30/60/90/120+ days)
  - Is the account currently in good standing?
  - How long has user been a customer?
  - Is the late payment actually inaccurate?
   |
   v
TRIAGE:
   |
   +---> Is the late payment actually INACCURATE?
   |     (User has proof they paid on time)
   |     +---> YES --> Route to PATH A (Inaccurate Information)
   |     +---> NO --> Continue (late payment is real)
   |
   +---> Is it a single late payment on an otherwise good account?
   |     +---> YES --> PATH C-GOODWILL (best chance of removal)
   |     +---> NO --> Continue
   |
   +---> Is it a pattern of late payments?
         +---> YES --> PATH C-PATTERN (focus on dilution strategy)

==============================
PATH C-GOODWILL: Goodwill Letter (Single/Few Late Payments)
==============================
   |
   v
APP ACTION: Generate goodwill letter to ORIGINAL CREDITOR
   (NOT the bureau — the creditor is the one who can remove it)
   |
   LETTER INCLUDES:
   - Acknowledge the late payment was your responsibility
   - Explain the circumstance (hardship, emergency, oversight)
   - Highlight your positive history with the creditor
   - Reference how long you've been a customer
   - Politely request a "goodwill adjustment" to remove the late mark
   - Do NOT cite laws or threaten — this is a courtesy request
   |
   APP GUIDANCE:
   - Works best for: long-term customers, single incidents, small creditors
   - Works worst for: repeated late payments, large banks with rigid policies
   - Best sent via: physical mail to executive office (not customer service)
   |
   TIMER: 30-day wait for response
   |
   v
OUTCOME?
   |
   +---> CREDITOR AGREES --> Late payment removed --> [DONE - SUCCESS]
   |
   +---> CREDITOR DENIES
   |     |
   |     v
   |     USER DECISION: Try again?
   |     |
   |     +---> YES --> APP ACTION: Set 3-month reminder
   |     |     - Generate slightly different goodwill letter
   |     |     - May reach different representative
   |     |     - Mention continued on-time payments since the incident
   |     |     - LIMIT: Try up to 3 times total, then move on
   |     |
   |     +---> NO --> Accept and focus on dilution (PATH C-PATTERN)
   |
   +---> NO RESPONSE
         |
         v
         APP ACTION: Try calling the creditor directly
         - Provide phone script for goodwill request
         - If verbal agreement obtained, request written confirmation
         - If denied verbally, set reminder for 3 months

==============================
PATH C-PATTERN: Payment History Recovery (Multiple Late Payments)
==============================
   |
   v
APP CALCULATES:
  - Current payment history percentage
  - Number of late payments across all accounts
  - Number of open accounts making on-time payments
  - Projected timeline to reach 97%, 98%, 99%, 100%
   |
   v
APP INSIGHT:
  "You have 13 late payments. Each on-time payment across ALL your
   accounts counts. With 1 account, recovery takes years. With 4+
   accounts reporting on-time payments monthly, recovery is 4x faster."
   |
   v
APP RECOMMENDATIONS:
  1. Ensure ALL current accounts are on autopay (prevent new lates)
  2. Open additional accounts if possible (more on-time data points)
     --> Link to PARALLEL TRACK: Credit Building
  3. Request goodwill removal on any single-incident late payments
  4. Set realistic timeline expectations
   |
   v
APP TRACKING: Monthly progress bar showing payment history %
   - Recalculate after each reporting cycle
   - Show projected date to reach target percentages
```

---

## PATH D: HARD INQUIRIES

```
[D-START] Hard Inquiry Identified
   |
   v
APP DATA NEEDED:
  - Lender/company name that pulled the inquiry
  - Date of inquiry
  - User's list of known credit applications
   |
   v
TRIAGE:
   |
   +---> Does user recognize this inquiry?
   |     (Did they apply for credit with this company?)
   |     |
   |     +---> YES, and it's tied to an open account
   |     |     |
   |     |     v
   |     |     APP GUIDANCE: "This inquiry is tied to your [account name].
   |     |     Disputing it could trigger a review of that account.
   |     |     Recommendation: Do NOT dispute."
   |     |     --> [NO ACTION - SKIP]
   |     |
   |     +---> YES, but application was denied / no account opened
   |     |     |
   |     |     v
   |     |     APP GUIDANCE: "You authorized this inquiry. While it wasn't
   |     |     tied to an approved account, you did give permission.
   |     |     Disputing is unlikely to succeed. Inquiries fall off
   |     |     after 2 years and stop affecting score after ~12 months."
   |     |     |
   |     |     USER DECISION: Dispute anyway or skip?
   |     |     +---> Dispute anyway --> STEP 1 below
   |     |     +---> Skip --> [NO ACTION]
   |     |
   |     +---> NO / DON'T RECOGNIZE
   |           |
   |           v
   |           STEP 1 (see below)
   |
   v

==============================
STEP 1: Request Permissible Purpose Documentation
==============================
   |
   v
APP ACTION: Generate letter to the LENDER (not the bureau)
   - "I do not recognize this inquiry on my credit report"
   - "Please provide proof of my written authorization or
     documentation of the permissible purpose under FCRA Section 604"
   - Send via certified mail
   |
   TIMER: 30-day wait
   |
   v
OUTCOME?
   |
   +---> LENDER PROVIDES PROOF OF AUTHORIZATION
   |     |
   |     v
   |     USER DECISION: Do you recognize the authorization now?
   |     +---> YES --> [ACCEPT - inquiry is legitimate]
   |     +---> NO --> Possible identity theft
   |           --> Route to PATH A-ID (Identity Theft sub-path)
   |
   +---> LENDER CANNOT PROVIDE AUTHORIZATION / NO RESPONSE
         |
         v
         STEP 2: Dispute with Bureau
         |
         v
         APP ACTION: Generate inquiry dispute letter to bureau
         - "Lender could not provide permissible purpose
            documentation for this inquiry"
         - Include copy of letter to lender + proof of delivery
         - Request removal of unauthorized inquiry
         |
         TIMER: 30-day countdown
         |
         v
         OUTCOME?
         |
         +---> INQUIRY REMOVED --> [DONE - SUCCESS]
         +---> NOT REMOVED --> CFPB complaint
               (unauthorized access to credit report is serious)

==============================
INQUIRY IMPACT CONTEXT (displayed to user)
==============================

APP DISPLAYS:
  - Current inquiry count per bracket: 0 | 1-2 | 3-4 | 5-8 | 9+
  - Score impact estimate based on bracket
  - "Inquiries affect your score for ~12 months and fall off after 2 years"
  - "Focus dispute efforts on inquiries that push you into a higher bracket"
    (e.g., if you have 3 inquiries, removing 1 drops you from 3-4 to 1-2 bracket)
```

---

## PATH E: OUTDATED ITEMS

```
[E-START] Outdated Item Identified (>7 years, or >10 years for bankruptcy)
   |
   v
APP DATA NEEDED:
  - Date of first delinquency (DOFD) — this is the clock start
  - Type of item (collection, charge-off, bankruptcy, tax lien, etc.)
  - Current date vs. DOFD
   |
   v
APP CALCULATES:
  - Exact date item should have fallen off
  - Days past the reporting limit
   |
   v
IS ITEM PAST THE REPORTING LIMIT?
   |
   +---> YES (older than 7 years from DOFD, or 10 for bankruptcy)
   |     |
   |     v
   |     ROUND 1: Dispute with Bureau Citing Age
   |     |
   |     APP ACTION: Generate dispute letter
   |     - Cite FCRA Section 605 (7-year / 10-year reporting limits)
   |     - Include the DOFD and calculation showing item is expired
   |     - "This item has exceeded the maximum reporting period
   |        and must be removed immediately"
   |     |
   |     TIMER: 30-day countdown (but these are usually quick wins)
   |     |
   |     v
   |     OUTCOME?
   |     |
   |     +---> REMOVED --> [DONE - SUCCESS]
   |     |
   |     +---> NOT REMOVED (rare — bureau may have wrong DOFD)
   |           |
   |           v
   |           APP ACTION: File CFPB complaint immediately
   |           - This is a clear FCRA Section 605 violation
   |           - Include proof of actual DOFD (original creditor
   |             records, prior credit reports showing the date)
   |           |
   |           TIMER: 15-60 days for CFPB response
   |           |
   |           v
   |           If STILL not removed --> Attorney referral
   |           (Clear-cut FCRA violation with statutory damages)
   |
   +---> CLOSE BUT NOT YET (within 6 months of falling off)
   |     |
   |     v
   |     APP GUIDANCE: "This item will automatically fall off on [date].
   |     You can dispute now, or wait [X] months for automatic removal.
   |     Disputing may be faster."
   |     |
   |     USER DECISION: Dispute now or wait?
   |     +---> Dispute now --> Route to appropriate path (A, B, or C)
   |     +---> Wait --> Set reminder for expected removal date
   |
   +---> NOT YET OUTDATED (user/AI miscategorized)
         |
         v
         Route to appropriate active dispute path
```

---

## PATH F: PERSONAL INFORMATION ERRORS

```
[F-START] Personal Info Error Identified
   |
   v
APP DATA NEEDED:
  - What's wrong (name spelling, address, SSN, employer, DOB)
  - Correct information + supporting documentation
   |
   v
TYPE OF ERROR?
   |
   +---> Wrong name / misspelling
   +---> Wrong address (current or historical)
   +---> Wrong SSN (partial)
   +---> Wrong date of birth
   +---> Wrong employer
   +---> Mixed file (someone else's info merged with yours)
   |
   v
APP ACTION: Generate personal information dispute letter
   - Send to ALL bureaus showing the error
   - Include: government-issued photo ID, utility bill / bank statement
     for address proof, SSN card if SSN is wrong
   - Simplest dispute path — no escalation rounds typically needed
   |
   TIMER: 30-day countdown
   |
   v
OUTCOME?
   |
   +---> CORRECTED --> [DONE - SUCCESS]
   |
   +---> NOT CORRECTED
   |     |
   |     v
   |     Is this a MIXED FILE issue? (someone else's data in your file)
   |     +---> YES --> More serious. Generate second dispute with
   |     |     additional documentation. If not fixed --> CFPB complaint
   |     |     + attorney referral (mixed files are common FCRA lawsuits)
   |     +---> NO --> Resubmit with additional documentation
   |
   +---> INFO CORRECTED BUT KEEPS REAPPEARING
         |
         v
         APP ACTION: Send letter citing FCRA anti-reinsertion provisions
         - Section 611(a)(5)(B): deleted info cannot be reinserted
           unless furnisher certifies accuracy
         - If reinserted, CRA must notify consumer within 5 business days
         - If violated --> CFPB complaint + attorney referral
```

---

## PARALLEL TRACK 1: CREDIT BUILDING PATH

```
[PARALLEL-BUILD] Runs alongside all dispute paths
   |
   v
APP ASSESSES: Current credit profile
  - Number of open accounts
  - Types of accounts (revolving, installment, mortgage)
  - Credit age (average and oldest)
  - Current score range
   |
   v
WHAT STAGE IS THE USER IN?
   |
   +---> STAGE 1: No credit or severely damaged (<500)
   |     |
   |     v
   |     APP RECOMMENDS: Secured credit card
   |     - Discover It Secured (no annual fee, reports monthly, refundable deposit)
   |     - Deposit: $49-$200
   |     - USE: Small recurring charge (e.g., streaming subscription)
   |     - PAY: In full every month on autopay
   |     - AVOID: First Premier, Orchard Bank (predatory fees)
   |     |
   |     TIMER: Use responsibly for 6-12 months
   |     |
   |     v
   |     APP MONITORS: Monthly score check
   |     When score reaches ~640 --> Prompt: "Ready for Stage 2"
   |
   +---> STAGE 2: Building (500-649)
   |     |
   |     v
   |     APP RECOMMENDS:
   |     1. Apply for unsecured card (Capital One Platinum or Discover unsecured)
   |        - Better to stay with same bank (Discover) — existing relationship
   |        - Also consider: credit union cards, student cards
   |     2. Keep secured card open for now (adds to account count)
   |     3. Request credit limit increase on secured card
   |     |
   |     TIMER: Build for 6-12 more months
   |     |
   |     v
   |     When score reaches ~700 --> Prompt: "Ready for Stage 3"
   |
   +---> STAGE 3: Optimizing (650-749)
   |     |
   |     v
   |     APP RECOMMENDS:
   |     1. Close secured card (get deposit back)
   |        - Do this EARLY — the longer you wait, the more
   |          closing it hurts your average credit age
   |     2. Request limit increases on unsecured cards
   |     3. Consider a credit-builder installment loan
   |        (adds account type diversity)
   |     4. Apply for rewards card if desired
   |
   +---> STAGE 4: Maintaining (750+)
         |
         v
         APP RECOMMENDS:
         1. Keep oldest accounts open (credit age)
         2. Keep utilization under 9%
         3. Avoid unnecessary hard inquiries
         4. Monitor for new errors quarterly
```

---

## PARALLEL TRACK 2: UTILIZATION OPTIMIZATION

```
[PARALLEL-UTIL] Runs alongside all dispute paths
   |
   v
APP CALCULATES:
  - Total credit limit across all cards
  - Total current balances
  - Per-card utilization %
  - Overall utilization %
  - Current utilization bracket:
    0% (best) | 1-9% | 10-29% | 30-49% | 50-74% | 75%+ (worst)
   |
   v
IS UTILIZATION ABOVE 9%?
   |
   +---> NO --> [OPTIMAL - no action needed]
   |     APP DISPLAYS: "Your utilization is in the best range"
   |
   +---> YES
         |
         v
         TWO LEVERS:
         |
         +---> LEVER 1: Reduce balances
         |     - APP SHOWS: "Pay down $X to reach the next bracket"
         |     - Prioritize: highest-utilization cards first
         |     - Or: spread balances across cards to equalize %
         |
         +---> LEVER 2: Increase limits
               - APP ACTION: Identify cards eligible for CLI
               - REQUEST: Credit limit increase (even if it means
                 a hard inquiry — the utilization improvement is
                 usually worth more than the inquiry hit)
               - Best timing: after 6+ months with the card,
                 after income increase, after on-time payment streak
               |
               v
               APP CALCULATES: "If you get a $X limit increase,
               your utilization drops from Y% to Z%"
               - Show projected score impact
```

---

## TIMER & NOTIFICATION SYSTEM

```
ALL ACTIVE TIMERS (managed centrally by the app):

TIMER TYPE              | DURATION    | TRIGGER NOTIFICATION AT
------------------------|-------------|----------------------------------
Bureau dispute          | 30 days     | Day 25 (prep), Day 30 (check), Day 35 (overdue)
Extended investigation  | 45 days     | Day 40 (prep), Day 45 (check), Day 50 (overdue)
MOV request response    | 15 days     | Day 12 (prep), Day 15 (check), Day 20 (overdue)
Furnisher dispute       | 30 days     | Day 25 (prep), Day 30 (check), Day 35 (overdue)
CFPB initial response   | 15 days     | Day 12 (reminder), Day 15 (check)
CFPB final response     | 60 days     | Day 50 (prep), Day 60 (check)
Debt validation         | Ongoing     | Day 30 (follow-up), Day 45 (dispute with bureau)
Settlement confirmation | 14 days     | Day 10 (check payment), Day 14 (begin dispute)
Goodwill retry          | 90 days     | Day 80 (prep new letter), Day 90 (send)
Inquiry fall-off        | 2 years     | 6 months before (remind), at date (confirm removed)
Item fall-off (7 yr)    | 7 years     | 6 months before (remind), at date (confirm removed)
Score re-check          | Monthly     | Day after reporting cycle

NOTIFICATION PRIORITY:
  1. OVERDUE — action was expected and deadline passed (RED)
  2. ACTION NEEDED — timer expired, next step ready (ORANGE)
  3. PREP — upcoming deadline, start preparing (YELLOW)
  4. INFO — progress update, score change, item removed (GREEN)
```

---

## AUTO-SUGGESTION ENGINE

```
The app should auto-suggest the next action based on:

TRIGGER                                    | AUTO-SUGGESTION
-------------------------------------------|------------------------------------------
Report imported, items flagged             | "Review these [N] flagged items"
User confirms a flagged item               | "Start Round 1 dispute for [item]"
30-day timer expires, no response          | "Bureau didn't respond — demand deletion"
Dispute comes back 'verified'              | "Request Method of Verification (Round 2)"
MOV reveals e-OSCAR / generic              | "Send warning letter (Round 3)"
Round 3 still verified                     | "Dispute directly with furnisher (Round 4)"
Round 4 still verified                     | "File CFPB complaint (Round 5)"
CFPB unsuccessful                          | "Consider attorney consultation (Round 6)"
Collection identified                      | "Send debt validation letter first"
Debt validated, user can afford            | "Let's negotiate a settlement"
Settlement paid + confirmed                | "Now dispute the tradeline with all bureaus"
Goodwill letter denied                     | "We'll try again in 3 months" + set timer
Late payments pattern detected             | "Open more accounts to accelerate recovery"
Inquiry not tied to open account           | "Request permissible purpose documentation"
Item approaching 7-year mark               | "This falls off on [date] — dispute now?"
Utilization above 30%                      | "Request a credit limit increase"
Score crosses 640 threshold                | "You may qualify for an unsecured card now"
All disputes resolved                      | "Maintenance mode — quarterly monitoring"
```

---

## DECISION SUMMARY: WHAT THE USER DECIDES AT EACH NODE

```
NODE                          | USER DECISION
------------------------------|----------------------------------------------
Flagged item review           | Confirm, dismiss, or mark as "need to check"
Inaccuracy type               | What specifically is wrong?
Collection triage             | Do you recognize it? Can you afford to settle?
Settlement amount             | Accept/counter the collector's offer
Pay-then-dispute              | Ready to pay? (only after written agreement)
Goodwill approach             | Try goodwill or accept and dilute?
Goodwill retry                | Try again in 3 months or move on?
Inquiry dispute               | Do you recognize this inquiry?
Inquiry tied to account       | Dispute (risky) or skip?
Outdated item near expiry     | Dispute now or wait for auto-removal?
Legal escalation              | Attorney, small claims, AG complaint, or accept?
Credit building stage         | Apply for recommended card?
Utilization fix               | Pay down balance or request limit increase?
```

---

## INFORMATION THE APP NEEDS AT EACH STEP

```
STEP                          | DATA REQUIRED
------------------------------|----------------------------------------------
Import                        | Credit report data (all 3 bureaus)
Flagging                      | User's known accounts, authorized inquiries
SOL calculation               | User's state of residence
Settlement strategy           | User's available funds, monthly budget
Dispute letter generation     | Full name, address, SSN (last 4), DOB,
                              | account numbers, creditor names, specific
                              | inaccuracy descriptions, supporting docs
Bureau communication          | Bureau addresses (auto-populated by app)
Furnisher communication       | Furnisher address (parsed from credit report)
CFPB complaint                | All prior dispute history, dates, responses
Timer management              | Date each letter was sent/received
Score tracking                | Updated credit data (monthly pull or API)
Credit building recs          | Current accounts, score, income (optional)
Utilization calc              | All card limits and balances
```

---

## COMPLETE STATE DIAGRAM (ALL POSSIBLE END STATES)

```
Every flagged item eventually reaches one of these terminal states:

[SUCCESS] Item removed or corrected
  --> App logs result, estimates score impact, moves to next item

[ACCEPTED] Item is accurate, user acknowledges
  --> App focuses on dilution/building strategies instead

[WAITING] Item near automatic fall-off
  --> App monitors and confirms removal on expected date

[LEGAL] User pursuing legal action
  --> App provides attorney referrals and case documentation export

[DEFERRED] User not ready to act
  --> App sets reminder and re-prompts at user-chosen interval

[SETTLED] Collection paid via negotiated settlement
  --> App initiates pay-then-dispute sequence

[IN PROGRESS] Active dispute in a timed round
  --> App manages timer and queues next action
```

---

## SOURCES

Research and legal citations incorporated into this flowchart:

- [FCRA Section 611 - Full Statute (Cornell Law)](https://www.law.cornell.edu/uscode/text/15/1681i)
- [FCRA Section 623 - Furnisher Responsibilities](https://www.consumerfinance.gov/rules-policy/regulations/1022/43/)
- [FDCPA Section 809 - Debt Validation (Cornell Law)](https://www.law.cornell.edu/uscode/text/15/1692g)
- [CFPB - How to Dispute Credit Report Errors](https://www.consumerfinance.gov/ask-cfpb/how-do-i-dispute-an-error-on-my-credit-report-en-314/)
- [CFPB - Submit a Complaint](https://www.consumerfinance.gov/complaint/)
- [Credit Info Center - Method of Verification](https://www.creditinfocenter.com/using-method-of-verification-to-repair-your-credit/)
- [Credit Mashup - How to Request Method of Verification](https://creditmashup.com/how-to-request-method-of-verification-for-verified-disputes/)
- [Nolo - Debt Validation Process](https://www.nolo.com/legal-encyclopedia/debt-validation.html)
- [Dispute Beast - 30-60-90 Day Reality of Credit Disputes](https://disputebeast.com/30-60-90-day-reality-of-credit-disputes/)
- [SmartDispute - e-OSCAR System Explained](https://www.smartdispute.ai/everything-you-need-to-know-about-the-e-oscar-system/)
- [Sherman & Ticchio - FCRA Damages](https://newyorkcreditlawyers.com/credit-report-errors-disputes-and-lawsuits-under-the-fcra/)
- [Bankrate - How to File CFPB Complaint](https://www.bankrate.com/banking/how-to-file-a-complaint-with-the-cfpb/)
- [Credit Karma - Goodwill Letters](https://www.creditkarma.com/credit/i/goodwill-letter)
- [Dispute Beast - AI Credit Dispute Workflow](https://disputebeast.com/ai-credit-dispute-workflow-step-by-step/)
- [FTC - Disputing Errors on Credit Reports](https://consumer.ftc.gov/articles/disputing-errors-your-credit-reports)
