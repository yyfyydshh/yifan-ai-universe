"use client";

import type { ProjectCaseStudy } from "@/lib/site-data";
import { DocsRouteCaseStudy } from "./docs-route-case-study";
import { ProjectEvidenceFlow } from "./project-evidence-flow";
import { RegulatoryCaseStudyView } from "./regulatory-case-study";
import { SalesConversionCaseStudy } from "./sales-conversion-case-study";
import { TenderSchemaCaseStudy } from "./tender-schema-case-study";
import { HotNewsEvidenceRadar } from "./hot-news-case-study";
import { HumanizerVoiceChamber } from "./humanizer-case-study";

export function ProjectCaseStudyView({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  switch (caseStudy.visualKind) {
    case "global-evidence":
      return <ProjectEvidenceFlow evidence={caseStudy} />;
    case "sales-conversion":
      return <SalesConversionCaseStudy study={caseStudy} />;
    case "docs-routes":
      return <DocsRouteCaseStudy study={caseStudy} />;
    case "regulatory-applicability":
      return <RegulatoryCaseStudyView study={caseStudy} />;
    case "tender-schema-refinery":
      return <TenderSchemaCaseStudy study={caseStudy} />;
    case "hot-news-evidence-radar":
      return <HotNewsEvidenceRadar study={caseStudy} />;
    case "humanizer-voice-chamber":
      return <HumanizerVoiceChamber study={caseStudy} />;
  }
}
