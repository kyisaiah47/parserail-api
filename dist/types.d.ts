/** Every successful response carries this metering envelope. */
export interface Usage {
    /** Credits burned by this call. */
    credits: number;
    /** Wallet balance after the charge. */
    balanceRemaining: number;
}
type WithUsage<T> = T & {
    usage: Usage;
};
/** A document input for the multimodal endpoints. Provide exactly one. */
export type DocumentInput = {
    file: {
        data: string;
        mimeType: string;
    };
} | {
    fileUrl: string;
} | {
    text: string;
};
/** Terminal states are `succeeded` and `failed`. */
export type JobStatus = "queued" | "running" | "succeeded" | "failed";
/** Extra body fields the document endpoints accept. */
export interface AsyncOptions {
    /** Queue the work and return a job instead of the result. */
    async?: boolean;
    /**
     * Public https URL to POST the finished job to, signed with your account's
     * webhook secret. Delivery is best-effort, polling is the source of truth.
     */
    callbackUrl?: string;
}
/** What a document endpoint returns when called with `async: true`. */
export interface JobHandle {
    jobId: string;
    status: "queued";
    requestId: string;
}
/** A job's state, and its result once it succeeds. */
export interface Job<T = unknown> {
    jobId: string;
    endpoint: string;
    status: JobStatus;
    /** Present only when `status` is `"succeeded"`. */
    result?: T;
    /** Present only when `status` is `"failed"`. No credits were charged. */
    error?: string;
    createdAt: string;
    updatedAt: string;
    requestId: string;
}
/** Input for POST /v1/parse, Document parse. */
export type ParseInput = DocumentInput & {
    /** Optional hint, e.g. "invoice". */ docType?: string;
};
/** Result of POST /v1/parse. */
export type ParseResult = WithUsage<{
    /** Classified document type, e.g. "invoice". */ docType: string;
    /** Primary party, vendor / payer / carrier. */ party?: string;
    documentNumber?: string;
    /** Primary date, YYYY-MM-DD. */ date?: string;
    totalAmount?: number;
    lineItems?: Array<{
        description: string;
        amount: number;
    }>;
    fields: Array<{
        label: string;
        value: string | number | null;
        /** 0, 1. */ confidence: number;
    }>;
}>;
/** Input for POST /v1/extract, Field extraction. */
export type ExtractInput = {
    text: string;
    /** The field names to pull out. */ fields: Array<string>;
    /** Optional extra guidance. */ instructions?: string;
};
/** Result of POST /v1/extract. */
export type ExtractResult = WithUsage<{
    results: Array<{
        field: string;
        value: string | null;
        /** 0, 1. */ confidence: number;
    }>;
}>;
/** Input for POST /v1/classify, Classification. */
export type ClassifyInput = {
    text: string;
    labels: Array<string>;
    /** Allow multiple labels. */ multi?: boolean;
    instructions?: string;
};
/** Result of POST /v1/classify. */
export type ClassifyResult = WithUsage<{
    label: string;
    /** All labels when multi is set. */ labels?: Array<string>;
    /** 0, 1. */ confidence: number;
    rationale: string;
}>;
/** Input for POST /v1/summarize, Summarize. */
export type SummarizeInput = {
    text: string;
    length?: "brief" | "standard" | "detailed";
    actionItems?: boolean;
};
/** Result of POST /v1/summarize. */
export type SummarizeResult = WithUsage<{
    summary: string;
    keyPoints: Array<string>;
    actionItems: Array<{
        task: string;
        owner?: string;
    }>;
}>;
/** Input for POST /v1/redact, PII redaction. */
export type RedactInput = {
    text: string;
    /** Entity types to redact; omit for all. */ types?: Array<string>;
    placeholder?: string;
};
/** Result of POST /v1/redact. */
export type RedactResult = WithUsage<{
    redacted: string;
    entities: Array<{
        type: string;
        text: string;
    }>;
    entityCount: number;
}>;
/** Input for POST /v1/sentiment, Sentiment. */
export type SentimentInput = {
    text: string;
    /** Optional aspects to break out. */ aspects?: Array<string>;
};
/** Result of POST /v1/sentiment. */
export type SentimentResult = WithUsage<{
    sentiment: string;
    /** -1..1. */ score: number;
    /** 0, 1. */ confidence: number;
    aspects: Array<{
        aspect: string;
        sentiment: string;
        score: number;
    }>;
    themes: Array<string>;
}>;
/** Input for POST /v1/contract, Contract analysis. */
export type ContractInput = DocumentInput;
/** Result of POST /v1/contract. */
export type ContractResult = WithUsage<{
    contractType: string;
    parties: Array<{
        name: string;
        role: string;
    }>;
    effectiveDate?: string;
    term?: string;
    renewal?: {
        autoRenews: boolean;
        noticePeriod?: string;
    };
    governingLaw?: string;
    obligations: Array<string>;
    riskFlags: Array<{
        clause: string;
        /** low | medium | high. */ severity: string;
        reason: string;
    }>;
}>;
/** Input for POST /v1/chargeback, Chargeback representment. */
export type ChargebackInput = {
    /** The cardholder's dispute reason. */ reason: string;
    transaction: {
        amount?: number;
        currency?: string;
        date?: string;
        descriptor?: string;
    };
    evidence?: Array<string>;
    context?: string;
    network?: "visa" | "mastercard" | "amex" | "discover";
};
/** Result of POST /v1/chargeback. */
export type ChargebackResult = WithUsage<{
    reasonCategory: string;
    /** fight | accept. */ recommendedAction: string;
    narrative: string;
    evidenceChecklist: Array<{
        item: string;
        have: boolean;
    }>;
    /** 0, 1. */ winLikelihood: number;
    rationale: string;
}>;
/** Input for POST /v1/enrich, Company enrichment. */
export type EnrichInput = {
    domain: string;
} | {
    email: string;
};
/** Result of POST /v1/enrich. */
export type EnrichResult = WithUsage<{
    name: string;
    domain: string;
    description?: string;
    industry?: string;
    headquarters?: string;
    employeeRange?: string;
    founded?: number;
    links?: Record<string, string>;
    /** True when web-grounded sources backed the profile. */ grounded: boolean;
}>;
/** Input for POST /v1/invoice, Invoice extraction. */
export type InvoiceInput = DocumentInput;
/** Result of POST /v1/invoice. */
export type InvoiceResult = WithUsage<{
    vendor: {
        name: string;
        address?: string | null;
        taxId?: string | null;
    };
    customer?: string | null;
    invoiceNumber?: string | null;
    poNumber?: string | null;
    /** YYYY-MM-DD. */ issueDate?: string | null;
    /** YYYY-MM-DD. */ dueDate?: string | null;
    /** ISO code, e.g. USD. */ currency?: string | null;
    subtotal?: number | null;
    tax?: number | null;
    total?: number | null;
    paymentTerms?: string | null;
    lineItems: Array<{
        description: string;
        quantity?: number | null;
        unitPrice?: number | null;
        amount: number;
    }>;
}>;
/** Input for POST /v1/receipt, Receipt extraction. */
export type ReceiptInput = DocumentInput;
/** Result of POST /v1/receipt. */
export type ReceiptResult = WithUsage<{
    merchant: string;
    location?: string | null;
    /** YYYY-MM-DD. */ date?: string | null;
    /** HH:MM, 24h. */ time?: string | null;
    currency?: string | null;
    subtotal?: number | null;
    tax?: number | null;
    tip?: number | null;
    total?: number | null;
    paymentMethod?: string | null;
    /** Expense category, ready to post. */ category: "meals" | "travel" | "lodging" | "transport" | "office" | "software" | "utilities" | "entertainment" | "groceries" | "health" | "other";
    items: Array<{
        description: string;
        quantity?: number | null;
        amount: number;
    }>;
}>;
/** Input for POST /v1/statement, Statement parsing. */
export type StatementInput = DocumentInput;
/** Result of POST /v1/statement. */
export type StatementResult = WithUsage<{
    institution?: string | null;
    accountHolder?: string | null;
    /** As printed, e.g. ****1234. */ accountNumberMasked?: string | null;
    /** YYYY-MM-DD. */ periodStart?: string | null;
    /** YYYY-MM-DD. */ periodEnd?: string | null;
    currency?: string | null;
    openingBalance?: number | null;
    closingBalance?: number | null;
    transactions: Array<{
        /** YYYY-MM-DD. */ date?: string | null;
        description: string;
        /** Positive; see direction. */ amount: number;
        direction: "debit" | "credit";
        category?: string | null;
        /** Running balance when printed. */ balance?: number | null;
    }>;
    transactionCount: number;
}>;
/** Input for POST /v1/resume, Resume parsing. */
export type ResumeInput = DocumentInput;
/** Result of POST /v1/resume. */
export type ResumeResult = WithUsage<{
    name: string;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    headline?: string | null;
    summary?: string | null;
    yearsExperience?: number | null;
    skills: Array<string>;
    experience: Array<{
        title: string;
        company: string;
        /** YYYY-MM or 'present'. */ startDate?: string | null;
        endDate?: string | null;
        highlights: Array<string>;
    }>;
    education: Array<{
        degree?: string | null;
        school: string;
        year?: string | null;
    }>;
    links?: {
        linkedin?: string | null;
        github?: string | null;
        website?: string | null;
    };
}>;
/** Input for POST /v1/tables, Table extraction. */
export type TablesInput = DocumentInput;
/** Result of POST /v1/tables. */
export type TablesResult = WithUsage<{
    tables: Array<{
        title?: string | null;
        page?: number | null;
        headers: Array<string>;
        rows: Array<Array<string>>;
    }>;
    tableCount: number;
}>;
/** Input for POST /v1/split, Document splitting. */
export type SplitInput = DocumentInput;
/** Result of POST /v1/split. */
export type SplitResult = WithUsage<{
    documents: Array<{
        docType: string;
        title: string;
        pageStart: number;
        pageEnd: number;
        party?: string | null;
        /** YYYY-MM-DD. */ date?: string | null;
        summary: string;
    }>;
    documentCount: number;
}>;
/** Input for POST /v1/compare, Document comparison. */
export type CompareInput = {
    a: DocumentInput;
    b: DocumentInput;
};
/** Result of POST /v1/compare. */
export type CompareResult = WithUsage<{
    changes: Array<{
        section: string;
        change: "added" | "removed" | "modified";
        before?: string | null;
        after?: string | null;
        materiality: "low" | "medium" | "high";
        note: string;
    }>;
    changeCount: number;
    summary: string;
    riskNotes: Array<string>;
}>;
/** Input for POST /v1/structure, Structure to your schema. */
export type StructureInput = {
    /** Any messy input, text, HTML, an email, a JSON blob. */ input: string;
    /** The JSON Schema the output must conform to. */ schema: Record<string, unknown>;
    /** Optional extra guidance. */ instructions?: string;
};
/** Result of POST /v1/structure. */
export type StructureResult = WithUsage<{
    /** The output, conforming to your schema. */ data: Record<string, unknown>;
    /** True when every required field of your schema was satisfiable. */ valid: boolean;
    /** Anything the input couldn't support (missing required fields, ambiguities). */ notes?: Array<string>;
}>;
/** Input for POST /v1/normalize, Record normalization. */
export type NormalizeInput = {
    /** The messy records. */ records: Array<Record<string, unknown>>;
    /** Canonical field names to normalize into; omit to keep the input's fields. */ fields?: Array<string>;
    /** House rules, e.g. "US phone format, uppercase state codes". */ instructions?: string;
};
/** Result of POST /v1/normalize. */
export type NormalizeResult = WithUsage<{
    /** The cleaned records, same order as input. */ records: Array<Record<string, unknown>>;
    changes: Array<{
        /** Input record index. */ index: number;
        field: string;
        from?: string | null;
        to: string;
        reason?: string;
    }>;
}>;
/** Input for POST /v1/match, Entity matching. */
export type MatchInput = {
    /** First record set. */ a: Array<Record<string, unknown>>;
    /** Second record set. */ b: Array<Record<string, unknown>>;
    /** Fields that most identify an entity, e.g. ["name","email"]. */ keys?: Array<string>;
};
/** Result of POST /v1/match. */
export type MatchResult = WithUsage<{
    matches: Array<{
        aIndex: number;
        bIndex: number;
        /** 0, 1. */ confidence: number;
        reason?: string;
    }>;
    unmatchedA: Array<number>;
    unmatchedB: Array<number>;
}>;
/** Input for POST /v1/categorize, Batch categorization. */
export type CategorizeInput = {
    /** The things to categorize. */ items: Array<string>;
    /** Your categories. */ taxonomy: Array<string>;
    /** Allow multiple categories per item. */ multi?: boolean;
    instructions?: string;
};
/** Result of POST /v1/categorize. */
export type CategorizeResult = WithUsage<{
    results: Array<{
        /** Input item index. */ index: number;
        category: string;
        /** All categories when multi is set. */ categories?: Array<string>;
        confidence: number;
    }>;
}>;
/** Input for POST /v1/dunning, Collections sequence. */
export type DunningInput = {
    invoice: {
        number?: string;
        amount: number;
        currency?: string;
        /** YYYY-MM-DD. */ dueDate?: string;
        daysOverdue?: number;
    };
    customer: {
        name: string;
        /** Payment history / relationship context. */ history?: string;
    };
    /** Where to start the escalation. */ tone?: "friendly" | "firm" | "final";
    channel?: "email" | "sms";
    steps?: number;
};
/** Result of POST /v1/dunning. */
export type DunningResult = WithUsage<{
    sequence: Array<{
        /** Days from now to send. */ day: number;
        channel: "email" | "sms";
        subject?: string | null;
        message: string;
    }>;
    /** What to do if the sequence completes unpaid. */ escalationAdvice: string;
}>;
/** Input for POST /v1/po-match, 3-way match. */
export type PoMatchInput = {
    /** The invoice, structured JSON (e.g. /v1/invoice output) or raw text. */ invoice: string;
    /** The PO, structured JSON or raw text. */ purchaseOrder: string;
    /** Optional goods receipt / delivery note for a 3-way match. */ receipt?: string;
    /** Price variance tolerance in percent (default 2). */ tolerancePct?: number;
};
/** Result of POST /v1/po-match. */
export type PoMatchResult = WithUsage<{
    status: "matched" | "partial" | "mismatched";
    discrepancies: Array<{
        field: string;
        invoice?: string | null;
        purchaseOrder?: string | null;
        receipt?: string | null;
        severity: "low" | "medium" | "high";
        note: string;
    }>;
    /** approve | hold | reject, with the reason. */ recommendation: string;
}>;
/** Input for POST /v1/quote, Quote builder. */
export type QuoteInput = {
    /** What the customer needs, in plain words. */ job: string;
    /** Your rate card / pricing rules, any format. */ rates?: string;
    /** Optional examples of quotes you've sent. */ pastQuotes?: string;
    currency?: string;
};
/** Result of POST /v1/quote. */
export type QuoteResult = WithUsage<{
    lineItems: Array<{
        description: string;
        quantity?: number | null;
        unitPrice?: number | null;
        amount: number;
    }>;
    subtotal?: number | null;
    tax?: number | null;
    total: number;
    currency?: string;
    assumptions: Array<string>;
    /** What's explicitly out of scope. */ scopeNotes?: string | null;
}>;
/** Input for POST /v1/fraud-flag, Fraud triage. */
export type FraudFlagInput = {
    /** The order/transaction: amount, email, addresses, IP, device, history, whatever you have. */ order: Record<string, unknown>;
    /** Store context: typical order size, known patterns. */ context?: string;
};
/** Result of POST /v1/fraud-flag. */
export type FraudFlagResult = WithUsage<{
    /** 0, 1. */ riskScore: number;
    riskLevel: "low" | "medium" | "high";
    signals: Array<{
        signal: string;
        weight: "low" | "medium" | "high";
        note: string;
    }>;
    recommendedChecks?: Array<string>;
    recommendation: "allow" | "review" | "block";
}>;
/** Input for POST /v1/reply, Reply drafting. */
export type ReplyInput = {
    /** The email/ticket thread, newest last. */ thread: string;
    /** Policies, KB extracts, account facts the reply may use. */ context?: string;
    tone?: "professional" | "friendly" | "apologetic" | "firm";
    /** What the reply should achieve, e.g. "offer refund, keep them". */ goal?: string;
    /** Sign-off name. */ senderName?: string;
};
/** Result of POST /v1/reply. */
export type ReplyResult = WithUsage<{
    /** Ready to send. */ reply: string;
    subject?: string | null;
    /** For the human agent: caveats, things to verify. */ internalNote?: string | null;
}>;
/** Input for POST /v1/triage, Ticket triage. */
export type TriageInput = {
    /** The ticket text (subject + body). */ ticket: string;
    /** Your category set; omit for sensible defaults. */ categories?: Array<string>;
    /** Routable teams. */ teams?: Array<string>;
};
/** Result of POST /v1/triage. */
export type TriageResult = WithUsage<{
    priority: "urgent" | "high" | "normal" | "low";
    category: string;
    team?: string | null;
    sentiment: string;
    /** True when this smells like churn/escalation. */ slaRisk: boolean;
    /** One line for the queue view. */ summary: string;
    suggestedFirstResponse?: string | null;
}>;
/** Input for POST /v1/minutes, Meeting minutes. */
export type MinutesInput = {
    /** The meeting transcript. */ transcript: string;
    attendees?: Array<string>;
};
/** Result of POST /v1/minutes. */
export type MinutesResult = WithUsage<{
    title: string;
    summary: string;
    decisions: Array<string>;
    actionItems: Array<{
        task: string;
        owner?: string | null;
        due?: string | null;
    }>;
    openQuestions: Array<string>;
}>;
/** Input for POST /v1/outreach, Outreach sequence. */
export type OutreachInput = {
    /** Who you're writing to, an enriched profile (e.g. /v1/enrich output) or notes. */ lead: string;
    /** What you sell and the value proposition. */ product: string;
    sender?: {
        name?: string;
        role?: string;
        company?: string;
    };
    channel?: "email" | "linkedin";
    steps?: number;
};
/** Result of POST /v1/outreach. */
export type OutreachResult = WithUsage<{
    sequence: Array<{
        day: number;
        subject?: string | null;
        message: string;
    }>;
    /** The lead-specific facts the copy leans on. */ personalizationPoints: Array<string>;
}>;
/** Input for POST /v1/review-reply, Review response. */
export type ReviewReplyInput = {
    /** The customer review text. */ review: string;
    /** Star rating if known. */ rating?: number;
    business?: {
        name?: string;
        /** Brand voice notes. */ voice?: string;
    };
    /** What you can offer, e.g. "replacement or refund". */ resolution?: string;
};
/** Result of POST /v1/review-reply. */
export type ReviewReplyResult = WithUsage<{
    /** Public response, brand-safe. */ reply: string;
    sentiment: string;
    /** Product/ops issues worth logging. */ issues: Array<string>;
    /** True when a human should take over. */ escalate: boolean;
}>;
/** Input for POST /v1/moderate, Content moderation. */
export type ModerateInput = {
    text?: string;
    image?: {
        /** Base64. */ data: string;
        mimeType: string;
    };
    imageUrl?: string;
    /** YOUR rules, plain words, e.g. "no medical claims, no competitor names". Adds to the safety baseline. */ policy?: string;
};
/** Result of POST /v1/moderate. */
export type ModerateResult = WithUsage<{
    flagged: boolean;
    decision: "allow" | "review" | "block";
    categories: Array<{
        category: string;
        severity: "low" | "medium" | "high";
        /** The offending span, when text. */ excerpt?: string | null;
    }>;
    rationale: string;
}>;
/** Input for POST /v1/rewrite, Brand-voice rewrite. */
export type RewriteInput = {
    text: string;
    /** Describe the voice or paste a sample of it. */ voice?: string;
    /** e.g. "tighter, more confident". */ goal?: string;
    audience?: string;
    length?: "shorter" | "same" | "longer";
};
/** Result of POST /v1/rewrite. */
export type RewriteResult = WithUsage<{
    rewritten: string;
    /** What was changed and why. */ changes: Array<string>;
}>;
/** Input for POST /v1/product-copy, Product copy. */
export type ProductCopyInput = {
    product: {
        name: string;
        /** Specs / features, any format. */ features?: string;
        audience?: string;
        keywords?: Array<string>;
    };
    channel?: "amazon" | "shopify" | "generic";
};
/** Result of POST /v1/product-copy. */
export type ProductCopyResult = WithUsage<{
    /** Ranked title options. */ titles: Array<string>;
    bullets: Array<string>;
    description: string;
    seoKeywords: Array<string>;
}>;
/** Input for POST /v1/describe, Image description. */
export type DescribeInput = {
    image?: {
        /** Base64. */ data: string;
        mimeType: string;
    };
    imageUrl?: string;
    purpose?: "alt" | "caption" | "product" | "detailed";
};
/** Result of POST /v1/describe. */
export type DescribeResult = WithUsage<{
    /** Concise, accessibility-grade. */ altText: string;
    caption: string;
    /** Long-form description when purpose=detailed. */ detailed?: string | null;
    tags: Array<string>;
    /** Any text found inside the image. */ embeddedText?: string | null;
}>;
/** Input for POST /v1/research, Research brief. */
export type ResearchInput = {
    /** The company, topic, or question to research. */ query: string;
    /** What matters to you, e.g. "pricing changes and funding". */ focus?: string;
    /** deep reads more sources. */ depth?: "standard" | "deep";
};
/** Result of POST /v1/research. */
export type ResearchResult = WithUsage<{
    /** The synthesized answer, a few paragraphs. */ brief: string;
    findings: Array<{
        finding: string;
        /** Indexes into sources[]. */ sourceIndexes: Array<number>;
    }>;
    sources: Array<{
        url: string;
        title: string;
    }>;
}>;
/** Input for POST /v1/screen, Lead screening. */
export type ScreenInput = {
    /** Company domain, name, or a pasted profile. */ lead: string;
    /** Your ICP, plain words, e.g. "B2B SaaS, 20-200 employees, US, sells to finance teams". */ criteria: string;
};
/** Result of POST /v1/screen. */
export type ScreenResult = WithUsage<{
    verdict: "qualified" | "maybe" | "disqualified";
    /** 0, 1 fit. */ score: number;
    evidenceFor: Array<string>;
    evidenceAgainst: Array<string>;
    /** What we learned about the lead. */ profile?: Record<string, unknown>;
}>;
/** Input for POST /v1/transcribe, Transcription. */
export type TranscribeInput = {
    audio?: {
        /** Base64 audio. */ data: string;
        mimeType: string;
    };
    audioUrl?: string;
    /** Label speakers. */ diarize?: boolean;
    /** BCP-47 hint, e.g. "en". */ language?: string;
};
/** Result of POST /v1/transcribe. */
export type TranscribeResult = WithUsage<{
    /** The full transcript. */ text: string;
    segments: Array<{
        /** e.g. "Speaker 1". */ speaker?: string | null;
        /** MM:SS. */ start?: string | null;
        text: string;
    }>;
    language?: string | null;
}>;
/** Input for POST /v1/memory, Agent memory. */
export type MemoryInput = {
    /** The operation. */ op: "store" | "search" | "forget";
    /** Your partition key, an agent id, a user id. Defaults to "default". */ namespace?: string;
    /** store: the memory text. */ content?: string;
    /** store: attached metadata, returned on recall. */ metadata?: Record<string, unknown>;
    /** search: what to recall. */ query?: string;
    /** search: max results. */ limit?: number;
    /** forget: the memory id (or omit with namespace to wipe it). */ id?: string;
};
/** Result of POST /v1/memory. */
export type MemoryResult = WithUsage<{
    op: "store" | "search" | "forget";
    /** store: the new memory's id. */ id?: string | null;
    /** search: the recalled memories. */ results?: Array<{
        id: string;
        content: string;
        /** Semantic similarity 0, 1. */ score: number;
        metadata?: Record<string, unknown>;
        createdAt?: string;
    }>;
    /** forget: how many were removed. */ deleted?: number | null;
}>;
/** Input for POST /v1/image, Image generation. */
export type ImageInput = {
    /** What to generate. */ prompt: string;
    /** Style notes, e.g. "editorial photography, warm light". */ style?: string;
    aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
};
/** Result of POST /v1/image. */
export type ImageResult = WithUsage<{
    /** Base64 image bytes. */ image: string;
    mimeType: string;
    revisedPrompt?: string | null;
}>;
/** Input for POST /v1/speak, Text to speech. */
export type SpeakInput = {
    text: string;
    /** Voice name; omit for the default narrator. */ voice?: string;
    pace?: "slow" | "normal" | "fast";
};
/** Result of POST /v1/speak. */
export type SpeakResult = WithUsage<{
    /** Base64 audio bytes. */ audio: string;
    mimeType: string;
    durationSec?: number | null;
}>;
export interface AccountResult {
    /** Current wallet balance, in credits. */
    balanceCredits: number;
    /** USD value of one credit. */
    creditUsd: number;
    /** USD value of the current balance. */
    balanceUsd: number;
}
/** The stable error code set returned by the API. */
export type ParseRailErrorCode = "invalid_request" | "unauthorized" | "rate_limited" | "insufficient_credits" | "unprocessable" | "inference_unavailable" | "unknown";
export {};
//# sourceMappingURL=types.d.ts.map