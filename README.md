# parserail-api

Official TypeScript SDK for **[ParseRail](https://parserail.thecompound.tech)**, the AI back-end for your product. Parse documents, extract fields, redact PII, analyze contracts, fight chargebacks, and enrich companies through one typed client.

```bash
npm i parserail-api
```

## Quickstart

```ts
import { ParseRailCore } from "parserail-api";

const parserail = new ParseRailCore({ apiKey: process.env.PARSERAIL_API_KEY! });

const doc = await parserail.parse({ fileUrl: "https://…/invoice.pdf" });
console.log(doc.totalAmount);              // 4820.5
console.log(doc.usage.balanceRemaining);   // 490
```

Get a key at **[parserail.thecompound.tech](https://parserail.thecompound.tech)**. ParseRail has no free tier. You buy credits up front through a $20 pack or a plan from $19/mo. ParseRail has zero runtime dependencies. ParseRail works on Node 18+, browsers, and edge/worker runtimes with a global `fetch`.

## Methods

Every method returns the endpoint result and a `usage: { credits, balanceRemaining }` envelope. A non-2xx response throws a typed `ParseRailError` and never burns credits.

```ts
await parserail.parse({ fileUrl });                              // documents → JSON
await parserail.extract({ text, fields: ["order", "total"] });   // pull named fields
await parserail.classify({ text, labels: ["billing", "tech"] }); // label text
await parserail.summarize({ text, length: "standard" });         // summary + actions
await parserail.redact({ text });                                // strip PII/PHI
await parserail.sentiment({ text, aspects: ["product"] });       // sentiment + aspects
await parserail.contract({ fileUrl });                           // contract → terms + risks
await parserail.chargeback({ reason, transaction, evidence });   // representment packet
await parserail.enrich({ email: "sam@stripe.com" });             // company profile
await parserail.account();                                       // balance
```

## Async and webhooks

A hundred-page contract does not fit in one request/response cycle. The document endpoints `parse`, `invoice`, `receipt`, `statement`, `resume`, `tables`, `split`, `compare`, and `contract` accept `async: true` and return a job instead of a result.

```ts
const job = await parserail.parse({ fileUrl, async: true });   // → { jobId, status: "queued" }
const done = await parserail.waitForJob<ParseResult>(job.jobId);

if (done.status === "succeeded") console.log(done.result!.totalAmount);
else console.error(done.error);                            // failed jobs are never charged
```

Setting `async: true` narrows the return type to a `JobHandle`, so the compiler identifies the returned type. You can poll once with `getJob(jobId)` to drive the loop yourself.

Every job reaches a terminal state. If the instance running your job dies mid-flight, the job is marked `failed` with an explanation instead of remaining `running` forever, and you are not billed for it. The system never retries jobs silently, so you must resubmit them and control the spend.

### Webhooks

Pass a `callbackUrl` (public https) and the finished job is POSTed to it, signed with your account's webhook secret from the [API keys page](https://parserail.thecompound.tech/dashboard/keys):

```ts
await parserail.parse({ fileUrl, async: true, callbackUrl: "https://you.example/hooks/parserail" });
```

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

// X-Compound-Signature: sha256=<hex HMAC-SHA256 of the RAW body>
function verify(rawBody: string, header: string, secret: string) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const got = header.replace(/^sha256=/, "");
  return got.length === expected.length &&
    timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}
```

Delivery is best-effort and never retried. **Polling is the source of truth**.

## Error handling

```ts
import { ParseRailCore, ParseRailError } from "parserail-api";

try {
  await parserail.parse({ fileUrl });
} catch (err) {
  if (err instanceof ParseRailError) {
    // err.code: "insufficient_credits" | "rate_limited" | "unauthorized" | …
    // err.status: HTTP status
    console.error(err.code, err.message);
  }
}
```

## Options

```ts
new ParseRailCore({
  apiKey: "ksk_live_…",
  baseUrl: "https://parserail.thecompound.tech", // override the origin
  timeoutMs: 60_000,                    // per-request timeout
  fetch: customFetch,                   // inject a fetch implementation
});
```

## Pricing

You pay per call with credits, and no subscription is required. Each endpoint charges at its own rate, with 1 credit = $0.01, and you pay only when the call succeeds. See [parserail.thecompound.tech/docs](https://parserail.thecompound.tech/docs).

MIT © Compound Labs
