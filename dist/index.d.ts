import type { ParseRailErrorCode, AccountResult, Job, JobHandle, ParseInput, ParseResult, ExtractInput, ExtractResult, ClassifyInput, ClassifyResult, SummarizeInput, SummarizeResult, RedactInput, RedactResult, SentimentInput, SentimentResult, ContractInput, ContractResult, ChargebackInput, ChargebackResult, EnrichInput, EnrichResult, InvoiceInput, InvoiceResult, ReceiptInput, ReceiptResult, StatementInput, StatementResult, ResumeInput, ResumeResult, TablesInput, TablesResult, SplitInput, SplitResult, CompareInput, CompareResult, StructureInput, StructureResult, NormalizeInput, NormalizeResult, MatchInput, MatchResult, CategorizeInput, CategorizeResult, DunningInput, DunningResult, PoMatchInput, PoMatchResult, QuoteInput, QuoteResult, FraudFlagInput, FraudFlagResult, ReplyInput, ReplyResult, TriageInput, TriageResult, MinutesInput, MinutesResult, OutreachInput, OutreachResult, ReviewReplyInput, ReviewReplyResult, ModerateInput, ModerateResult, RewriteInput, RewriteResult, ProductCopyInput, ProductCopyResult, DescribeInput, DescribeResult, ResearchInput, ResearchResult, ScreenInput, ScreenResult, TranscribeInput, TranscribeResult, MemoryInput, MemoryResult, ImageInput, ImageResult, SpeakInput, SpeakResult } from "./types.js";
export * from "./types.js";
export interface ParseRailCoreOptions {
    /** Your API key, e.g. `ksk_live_…`. Mint one at parserail.thecompound.tech/dashboard. */
    apiKey: string;
    /** Override the API origin (defaults to https://parserail.thecompound.tech). */
    baseUrl?: string;
    /** Inject a fetch implementation (defaults to the global fetch). */
    fetch?: typeof fetch;
    /** Per-request timeout in ms (default 60000). */
    timeoutMs?: number;
}
/** A typed error for any non-2xx API response. Mirrors `{ error: { code, message } }`. */
export declare class ParseRailError extends Error {
    readonly code: ParseRailErrorCode;
    readonly status: number;
    constructor(code: ParseRailErrorCode, message: string, status: number);
}
export declare class ParseRailCore {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly fetchImpl;
    private readonly timeoutMs;
    constructor(options: ParseRailCoreOptions);
    /** Low-level request to the API. Prefer the typed methods below. */
    private request;
    /** Any invoice, receipt, EOB, ERA, or COI, PDF or image, into structured, validated JSON. */
    parse(input: ParseInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** Any invoice, receipt, EOB, ERA, or COI, PDF or image, into structured, validated JSON. */
    parse(input: ParseInput & {
        async?: false;
    }): Promise<ParseResult>;
    /** Pull a field set you define out of any block of text. You name the fields; you get typed values with confidence. */
    extract(input: ExtractInput): Promise<ExtractResult>;
    /** Route or tag text against your own taxonomy, a label, a confidence, and a one-line rationale. */
    classify(input: ClassifyInput): Promise<ClassifyResult>;
    /** A meeting transcript, thread, or report → a tight summary, key points, and extracted action items. */
    summarize(input: SummarizeInput): Promise<SummarizeResult>;
    /** Detect and strip names, emails, phones, SSNs, cards, and PHI from text before you store or log it. */
    redact(input: RedactInput): Promise<RedactResult>;
    /** Turn a review or support message into a sentiment score, per-aspect breakdown, and the themes driving it. */
    sentiment(input: SentimentInput): Promise<SentimentResult>;
    /** A contract → parties, effective date, term, renewal, governing law, obligations, and flagged risk clauses. */
    contract(input: ContractInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** A contract → parties, effective date, term, renewal, governing law, obligations, and flagged risk clauses. */
    contract(input: ContractInput & {
        async?: false;
    }): Promise<ContractResult>;
    /** Dispute details → a representment narrative, an evidence checklist, the right reason code, and a win-likelihood. */
    chargeback(input: ChargebackInput): Promise<ChargebackResult>;
    /** A domain or work email → a structured company profile: name, description, industry, HQ, size, and links. */
    enrich(input: EnrichInput): Promise<EnrichResult>;
    /** An invoice, PDF, photo, or text, into vendor, dates, PO refs, tax, totals, and clean line items. */
    invoice(input: InvoiceInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** An invoice, PDF, photo, or text, into vendor, dates, PO refs, tax, totals, and clean line items. */
    invoice(input: InvoiceInput & {
        async?: false;
    }): Promise<InvoiceResult>;
    /** A receipt into merchant, items, totals, payment method, and an expense category, built for expense flows. */
    receipt(input: ReceiptInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** A receipt into merchant, items, totals, payment method, and an expense category, built for expense flows. */
    receipt(input: ReceiptInput & {
        async?: false;
    }): Promise<ReceiptResult>;
    /** A bank or card statement into the account, the period, balances, and every transaction as a normalized row. */
    statement(input: StatementInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** A bank or card statement into the account, the period, balances, and every transaction as a normalized row. */
    statement(input: StatementInput & {
        async?: false;
    }): Promise<StatementResult>;
    /** A resume or CV into a structured candidate profile: contact, skills, experience, education, and links. */
    resume(input: ResumeInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** A resume or CV into a structured candidate profile: contact, skills, experience, education, and links. */
    resume(input: ResumeInput & {
        async?: false;
    }): Promise<ResumeResult>;
    /** Every table in a document, even scanned, as clean headers and rows, ready for your spreadsheet or DB. */
    tables(input: TablesInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** Every table in a document, even scanned, as clean headers and rows, ready for your spreadsheet or DB. */
    tables(input: TablesInput & {
        async?: false;
    }): Promise<TablesResult>;
    /** A multi-document scan bundle classified and split: what each document is, where it starts and ends, and a summary. */
    split(input: SplitInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** A multi-document scan bundle classified and split: what each document is, where it starts and ends, and a summary. */
    split(input: SplitInput & {
        async?: false;
    }): Promise<SplitResult>;
    /** Two versions of a contract or document → every material change, what it means, and the risk it carries. */
    compare(input: CompareInput & {
        async: true;
        callbackUrl?: string;
    }): Promise<JobHandle>;
    /** Two versions of a contract or document → every material change, what it means, and the risk it carries. */
    compare(input: CompareInput & {
        async?: false;
    }): Promise<CompareResult>;
    /** Any messy input, text, HTML, an email, plus YOUR JSON schema → output shaped to it, validated against your required fields and property types, with an automatic corrective retry and a `valid` flag. */
    structure(input: StructureInput): Promise<StructureResult>;
    /** A batch of messy records → clean canonical rows, with a change log of every fix (casing, formats, dedup-ready values). */
    normalize(input: NormalizeInput): Promise<NormalizeResult>;
    /** Two record sets → which rows are the same real-world thing, with confidence and reasoning. Fuzzy names, typos, aliases handled. */
    match(input: MatchInput): Promise<MatchResult>;
    /** Up to a hundred items against your taxonomy in one call, products, transactions, tickets, each with a confidence. */
    categorize(input: CategorizeInput): Promise<CategorizeResult>;
    /** An overdue invoice → a ready-to-send collection sequence, escalating at the right pace and tone for how late it is. */
    dunning(input: DunningInput): Promise<DunningResult>;
    /** Invoice vs purchase order vs receipt → matched, partial, or mismatched, with every discrepancy flagged and sized. */
    poMatch(input: PoMatchInput): Promise<PoMatchResult>;
    /** A job description plus your rates → an itemized, professional quote with assumptions and scope notes spelled out. */
    quote(input: QuoteInput): Promise<QuoteResult>;
    /** An order or transaction in context → a risk score, the signals driving it, and the checks worth running before you ship. */
    fraudFlag(input: FraudFlagInput): Promise<FraudFlagResult>;
    /** A customer thread plus your context → a ready-to-send reply in the right tone, with an internal note for the agent. */
    reply(input: ReplyInput): Promise<ReplyResult>;
    /** A support ticket → priority, category, the team it belongs to, sentiment, SLA risk, and a suggested first response. */
    triage(input: TriageInput): Promise<TriageResult>;
    /** A meeting transcript → clean minutes: summary, decisions made, action items with owners, and open questions. */
    minutes(input: MinutesInput): Promise<MinutesResult>;
    /** An enriched lead plus what you sell → a personalized outreach sequence that references what actually makes them a fit. */
    outreach(input: OutreachInput): Promise<OutreachResult>;
    /** A customer review → a brand-safe public response, the issues to log, and whether it needs human escalation. */
    reviewReply(input: ReviewReplyInput): Promise<ReviewReplyResult>;
    /** Text or an image against YOUR policy → allow, review, or block, with the categories and excerpts that drove the call. */
    moderate(input: ModerateInput): Promise<ModerateResult>;
    /** Any copy → your brand voice. Describe the voice or paste a sample; get the rewrite and what changed. */
    rewrite(input: RewriteInput): Promise<RewriteResult>;
    /** Specs and an audience → listing-ready titles, bullets, a description, and SEO keywords, per channel. */
    productCopy(input: ProductCopyInput): Promise<ProductCopyResult>;
    /** An image → accessible alt text, a caption, tags, and any text found inside it. Accessibility and catalogs in one call. */
    describe(input: DescribeInput): Promise<DescribeResult>;
    /** A company or topic → a multi-source, citation-backed brief: what it is, what changed lately, and what matters. Real web work. */
    research(input: ResearchInput): Promise<ResearchResult>;
    /** A lead plus your ICP criteria → a web-grounded qualification verdict with the evidence for and against. */
    screen(input: ScreenInput): Promise<ScreenResult>;
    /** An audio recording → accurate text with speakers and paragraph timestamps. Meetings, calls, voice notes. */
    transcribe(input: TranscribeInput): Promise<TranscribeResult>;
    /** Store, search, and forget memories for your agents, semantic recall on your own namespace, no vector DB to run. */
    memory(input: MemoryInput): Promise<MemoryResult>;
    /** A prompt → a production-ready image. Marketing visuals, product scenes, and consistent brand imagery. */
    image(input: ImageInput): Promise<ImageResult>;
    /** Text → natural speech audio, ready to embed. Voice notes, IVR lines, narration. */
    speak(input: SpeakInput): Promise<SpeakResult>;
    /** Fetch the authenticated account's id and credit balance. */
    account(): Promise<AccountResult>;
    /** Read a job created with `async: true`. Never charges credits. */
    getJob<T = unknown>(jobId: string): Promise<Job<T>>;
    /**
     * Poll a job until it reaches a terminal state, and return it.
     *
     * Resolves on `failed` as well as `succeeded`, inspect `job.status`. A failed
     * job was never charged. Throws only if the wait itself times out or is aborted;
     * the job keeps running server-side and can be polled again.
     */
    waitForJob<T = unknown>(jobId: string, options?: {
        intervalMs?: number;
        timeoutMs?: number;
        signal?: AbortSignal;
    }): Promise<Job<T>>;
}
export default ParseRailCore;
//# sourceMappingURL=index.d.ts.map
