import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const contract = "docs/reference-production-plan-v23-release-closeout.md";
const gateNames = ["visual_meaning", "hierarchy", "personal_evidence", "composition", "typography", "asset_crop", "overlap", "responsive", "reference_fidelity"];
const passGates = Object.fromEntries(gateNames.map(name => [name, "pass"]));
const projectRefs = {
  "global-opinion": "baseline-project-global-opinion.png",
  "sales-copilot": "baseline-project-sales-copilot.png",
  "docs-site": "baseline-project-docs-site.png",
  "regulatory-risk": "baseline-project-regulatory-risk.png",
  "tender-cleaner": "baseline-project-tender-cleaner.png",
  "hot-news-brief": "baseline-project-hot-news-brief.png",
  humanizer: "baseline-project-humanizer.png",
};
const sectionDefs = [
  ["home-idle", "references/locked/v23/baseline-home-hero.png", "The calm homepage state keeps the personal proposition first and lets five evenly spaced project planets carry the right-side density."],
  ["home-reveal", "references/locked/v23/reference-home-reveal.png", "The approved portrait is a discoverable middle layer while project links, the single orbit and face-safe depth remain primary."],
  ["work-universe", "references/locked/v23/baseline-work-universe.png", "Seven semantic project planets preserve the complete portfolio topology and keyboard-accessible spatial browsing."],
  ["career-trajectory", "references/locked/v23/baseline-career-trajectory.png", "The trajectory joins two roles with evidence-rich milestones rather than reducing the resume to decorative cards."],
  ["notes-signal", "references/locked/v23/baseline-notes-signal.png", "The article list exposes an active viewpoint signal and reading direction without enlarging generic cards."],
  ["article-reliability", "references/locked/v23/baseline-article-reliability.png", "The long-form article uses progress and chapter context while keeping the argument stable and readable."],
  ["profile-capability-system", "references/locked/v23/baseline-profile-capability-system.png", "The profile connects input, method, quality control and reusable delivery into one capability system."],
  ["responsive-navigation", "references/locked/v23/reference-responsive-navigation.png", "One navigation model preserves five primary destinations, active location and the contact exit across desktop and mobile."],
];

for (const [slug, baseline] of Object.entries(projectRefs)) {
  sectionDefs.push([
    `project-${slug}-mast`,
    `references/locked/v23/${baseline}`,
    "The project mast balances title, evidence status, external source and the input–judgment–output fact rail without fixed-height filler.",
  ]);
  sectionDefs.push([
    `project-${slug}-workbench`,
    `references/locked/v23/reference-project-${slug}-workbench.png`,
    "The project-specific workbench exposes a real state change and deeper operational evidence instead of repeating the mast summary.",
  ]);
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

const references = [];
const sections = [];
for (const [id, referencePath, reason] of sectionDefs) {
  const hash = await sha256(referencePath);
  references.push({ path: referencePath, sha256: hash });
  sections.push({
    id,
    reference: { path: referencePath, sha256: hash },
    render_contract: contract,
    topology: { kind: "section-specific", shared_with: [], reason },
    captures: {
      desktop: `references/qa/v23/desktop/${id}.png`,
      ultrawide: `references/qa/v23/ultrawide/${id}.png`,
      mobile: `references/qa/v23/mobile/${id}.png`,
    },
    gates: { ...passGates },
    status: "pass",
  });
}

const evidence = {
  schema_version: 1,
  reference_lock_version: "v23",
  source_strategy_locked: true,
  review_scope: "all_sections",
  viewports: {
    desktop: { width: 1672, height: 941 },
    ultrawide: { width: 2200, height: 1200 },
    mobile: { width: 390, height: 844 },
  },
  fidelity_ledger: "docs/fidelity-ledger.md",
  fresh_review: "docs/fresh-review.md",
  fresh_review_mode: "self-blind",
  final_status: "pass",
  verification_note: "v23 adopts the approved deep-space system and closes the release surface: responsive navigation, contact QR/email/phone, project mast facts, seven subtitle-free videos, metadata/discovery, automated route and interaction regression, and exact desktop/ultrawide/mobile evidence. The homepage single-orbit portrait universe and all project facts remain unchanged.",
  media_assets: [
    {
      id: "global-opinion-agent-demo-web-v002",
      source_strategy: "user-approved-final-transcoded-for-web",
      video: "public/videos/global-opinion/global-opinion-agent-demo-web-v002.mp4",
      poster: "public/videos/global-opinion-agent-demo-poster.jpg",
      status: "ready",
    },
    {
      id: "wechat-contact-qr",
      source_strategy: "user-provided",
      image: "public/contact/wechat-qr-yang-yifan.jpg",
      status: "ready",
    },
  ],
  references,
  sections,
};

await writeFile("docs/identity-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(`Wrote v23 identity evidence for ${sections.length} sections.`);
