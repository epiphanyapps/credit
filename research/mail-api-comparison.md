# Certified Mail API Comparison

## Recommendation: PostGrid (for now), Lob at scale

**PostGrid wins for startup phase** — no monthly fee, comparable per-letter pricing, Node.js SDK, free address verification. Switch to Lob if we hit thousands of letters/month.

---

## Head-to-Head

| Feature | Lob | PostGrid | Click2Mail |
|---------|-----|----------|------------|
| **Certified Mail** | Yes | Yes | Yes |
| **Return Receipt** | Electronic | Yes | Electronic + Physical |
| **Monthly Fee** | $260+ for certified | **$0 (Starter)** | $0 |
| **Per Letter (Certified+RR)** | ~$10.38 | ~$10.53 | ~$11.04 |
| **Node.js/TS SDK** | Official TS SDK | Official + Community | No SDK |
| **Test Mode** | Yes (test_ keys) | Yes (sandbox) | Yes (staging) |
| **Webhooks** | Yes | Yes (JWT-signed) | No |
| **Address Verification** | Paid add-on | **Included free** | Included |
| **HTML Templates** | Yes | Yes | Limited |
| **PDF Upload** | Yes | Yes | Yes |
| **API Docs Quality** | Excellent | Good | Basic |

## Cost Per Certified Letter (with return receipt)

| Service | Letter | Certified | Return Receipt | **Total** |
|---------|--------|-----------|----------------|-----------|
| Lob (Startup $260/mo) | $0.86 | $6.70 | $2.82 | **$10.38** |
| PostGrid (Free tier) | $1.02 | $6.69 | $2.82 | **$10.53** |
| Click2Mail | varies | $6.66 | $4.38 | **$11.04** |

## Cost Projection (100 letters over 6 months)

| Service | Monthly Fee | Letters | **Total** |
|---------|-------------|---------|-----------|
| PostGrid | $0 | $1,053 | **$1,053** |
| Click2Mail | $0 | $1,104 | **$1,104** |
| Lob | $1,560 | $1,038 | **$2,598** |

## Why PostGrid for MVP

1. **$0/month** — no fixed cost until we have volume. Lob requires $260/month minimum for certified mail
2. **Certified mail + electronic return receipt** — creates the legal paper trail credit disputes need
3. **Node.js SDK** — `postgrid-node-client` on npm
4. **Free address verification** — Lob charges per verification
5. **Webhook simulation in test mode** — can step through processing stages during dev
6. **Higher G2 satisfaction** than Lob

## When to Switch to Lob

- Thousands of letters/month → Lob Growth tier ($550/mo) has lower per-letter cost ($0.83 vs $1.02)
- Need more polished TS SDK and docs
- Need advanced webhook rate limiting

## Architecture Note

**Never call mail APIs from the mobile client.** Architecture:
```
Mobile App → Our Backend (Node.js) → PostGrid API
                  ↑
          PostGrid Webhooks (delivery status)
                  ↓
          Push Notification to Mobile
```

This keeps API keys secure and enables webhook-driven delivery status updates.

## Key API Details

### PostGrid
- **Create letter**: `POST /v1/letters`
- **Auth**: API key in header
- **Certified mail**: Set `mailingClass: "certified_mail"` and `extraService: "certified_return_receipt"`
- **Templates**: HTML with `{{variables}}`, saved via API
- **Tracking**: Real-time via dashboard + webhooks
- **Test mode**: Separate test API key, full sandbox

### Lob
- **Create letter**: `POST /v1/letters`
- **Auth**: HTTP basic auth (API key as username)
- **Certified mail**: `extra_services: ["certified"]` or `["certified_return_receipt"]`
- **Templates**: HTML with merge variables, saved via API
- **Tracking**: USPS tracking number + webhooks
- **Test mode**: `test_` prefixed API keys
- **SDK**: `@lob/lob-typescript-sdk`

## Bureau Mailing Addresses

These are the dispute department addresses for certified mail:

| Bureau | Address |
|--------|---------|
| Equifax | P.O. Box 740256, Atlanta, GA 30374 |
| Experian | P.O. Box 4500, Allen, TX 75013 |
| TransUnion | P.O. Box 2000, Chester, PA 19016 |

---

Sources: Lob docs (docs.lob.com), PostGrid docs (postgrid.readme.io), Click2Mail (developers.click2mail.com), G2 comparisons, USPS 2026 certified mail rates
