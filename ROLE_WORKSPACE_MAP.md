# ANVORA role workspace map

## Design objective

ANVORA should present task-oriented workspaces rather than exposing every technical page to every user. The same dataset, calculation engine, evidence lineage, and audit history remain shared; the navigation and actions differ by role.

## Role-to-workspace map

| Existing page / capability | Data Operations | Audit & Assurance | Leadership MIS | Team Reports | Notes |
|---|---:|---:|---:|---:|---|
| Overview / role landing | Yes | Yes | Yes | Yes | Role-focused task shortcuts |
| Data Workspace / Excel import / CSV export | Yes | No by default | No | No by default | Editing/import capability should be permission-controlled |
| Synthetic test dataset | Specialist only | No | No | Specialist only | Test data must be clearly marked and kept separate from real project records |
| Methodology & Disclosure Profile | No by default | Yes | Summary only | Specialist only | Changes to methodology require explicit permission and version history |
| Validation / mass balance | Status only | Yes | Summary only | Yes | Operational corrections should not erase the original validation record |
| Methodology & Factor Registry | No by default | Review | No by default | Specialist only | Versioned controls and change history required |
| Calculation | Yes | Review result/history | Summary only | No by default | Preserve calculation engine and run history |
| Remote Evidence / field register | Yes | Review | Summary only | Yes | EO metadata must not be represented as processed observations or proof of practice |
| Evidence Ledger / data confidence | Limited | Yes | Summary only | Yes | Evidence provenance and confidence should remain traceable |
| Uncertainty / factor confidence | No by default | Yes | Summary only | Specialist only | Keep assumptions and uncertainty visible to reviewers |
| MRV Readiness & Assurance | Status only | Yes | Yes | Yes | Different level of detail by role |
| Leadership Intelligence / MIS | No by default | Report access where relevant | Yes | Team-scoped only | Team scope requires an agreed mapping to business functions |
| Climate Passport / report export | Export permitted | Audit/report export | Executive output | Assigned report only | Export scope must be permission-controlled |
| Validation feedback log | No by default | Yes | Exceptions summary | Assigned follow-up | Preserve append-only audit trail where required |
| Architecture readiness | No by default | Specialist review | No | Specialist only | Technical diagnostics, not a standard user page |
| Remote Connectors / EO catalogue tools | No by default | Evidence review | No | Specialist only | Keep credentials and protected API calls server-side |
| Legacy Farmer Quick Start | Separate public/demo flow only | No | No | No | Must not be confused with an authenticated production workspace |
| Legacy Auditor / Leadership panels | Merge into role workspaces | Merge into role workspaces | Merge into role workspaces | N/A | Avoid duplicate dashboards with conflicting metrics |

## Navigation model in the current implementation branch

- Data Operations: Data Workspace, Remote Evidence, Calculation, Climate Passport.
- Audit & Assurance: Validation, Evidence, Uncertainty, MRV Readiness, Methodology, Factor Registry, Validation Log.
- Leadership MIS: Leadership Intelligence, Climate Passport, MRV Readiness.
- Team Reports: Evidence, Validation, Remote Evidence, MRV Readiness, Leadership Intelligence, Climate Passport, and specialist connector/architecture tools.

The current team workspace is a shared baseline. Before production, teams should be mapped to specific reporting scopes (for example, sustainability/MRV, agronomy/field operations, supply chain, or data/technology) and assigned only their approved report and record scopes.

## Security status and required production work

The role selector currently filters the browser interface and primary navigation only. It is **not authentication or authorization**. Anyone who can load the page can select another workspace, and client-side hiding is not a security boundary.

The existing Supabase project `ANVORA-Beta-Access` and beta approval-table direction should be used for the next security phase. Implement and test:
1. Sign-in and approved beta-user checks.
2. Server-side role and project-scope enforcement for reads, writes, calculations, and exports.
3. A private administrator-controlled role assignment and revocation workflow.
4. Least-privilege access, audit logging, and safe failure when permissions cannot be confirmed.
5. Direct-URL/API and export tests for every role.

Until these controls are implemented, the role selector must be treated as a UX prototype, not as protection for confidential data.

## Non-regression requirements

- Preserve existing calculation logic, factor controls, imports, exports, validation, evidence, and connector workflows.
- Do not change scientific claim semantics: catalogue metadata is not a processed EO observation; Sentinel-1 backscatter alone does not prove farmer practice; label data as measured only when returned by an authenticated measurement source.
- Preserve the root `validator.html` file.
- Test calculations and export files before merging the branch into `main`.
