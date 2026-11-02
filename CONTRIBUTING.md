# Contributing to CloudVault 🤝

Welcome to **CloudVault**! Whether you are a core team member working on academic evaluation milestones or an external contributor, this guide provides the official workflow for contributing to the project.

Please review these instructions carefully before making any changes.

---

## 📋 Table of Contents

1. [Code of Conduct & Team Collaboration Rules](#1-code-of-conduct--team-collaboration-rules)
2. [Prerequisites & Development Environment](#2-prerequisites--development-environment)
3. [Step 1: Forking the Repository](#step-1-forking-the-repository)
4. [Step 2: Cloning the Fork Locally](#step-2-cloning-the-fork-locally)
5. [Step 3: Configuring Upstream Remote](#step-3-configuring-upstream-remote)
6. [Step 4: Environment Configuration (STRICT RULE)](#step-4-environment-configuration-strict-rule)
7. [Step 5: Branching Strategy — Team Member Naming Convention](#step-5-branching-strategy--team-member-naming-convention)
8. [Step 6: Project Directory Structure](#step-6-project-directory-structure)
9. [Step 7: Coding Standards & Guidelines](#step-7-coding-standards--guidelines)
10. [Step 8: Testing & Verification](#step-8-testing--verification)
11. [Step 9: Git Commit Best Practices](#step-9-git-commit-best-practices)
12. [Step 10: Pushing Changes & Opening a Pull Request](#step-10-pushing-changes--opening-a-pull-request)
13. [Step 11: Code Review & Syncing Upstream](#step-11-code-review--syncing-upstream)

---

## 1. Code of Conduct & Team Collaboration Rules

- **Shared Ownership**: Every team member is responsible for code quality, strict security, and preventing AWS credential leakage.
- **No Direct Commits to `main`**: All features, bug fixes, and documentation updates must go through dedicated feature branches and Pull Requests.
- **Zero Mock APIs**: CloudVault interacts with live Amazon S3 storage. Do not introduce fake in-memory state or mocked endpoints.
- **Strict Environment Isolation**: Never commit `.env` or credentials to Git.

---

## 2. Prerequisites & Development Environment

Ensure your development machine has the following installed:
- **Node.js**: `v20.x` or `v22.x+` (LTS recommended)
- **npm**: `v10.x` or `v11.x+`
- **Git**: `v2.40+`
- **AWS S3 Bucket**: Access to bucket `tushardevx01` in region `ap-south-1` (with valid IAM credentials).

Verify your environment:
```bash
node -v
npm -v
git --version
```

---

## Step 1: Forking the Repository

1. Navigate to the main repository on GitHub:  
   `https://github.com/tushardevx01/CloudVault`
2. In the top-right corner, click **Fork**.
3. Select your personal GitHub account as the destination.
4. Ensure **"Copy the main branch only"** is checked.
5. Click **Create fork**.

---

## Step 2: Cloning the Fork Locally

Clone your newly created fork to your local computer:

```bash
# Replace <your-username> with your actual GitHub username
git clone https://github.com/<your-username>/CloudVault.git
cd CloudVault
```

Install project dependencies:
```bash
npm install
```

---

## Step 3: Configuring Upstream Remote

Keep your local repository synchronized with the official upstream project:

```bash
# Add upstream remote
git remote add upstream https://github.com/tushardevx01/CloudVault.git

# Verify remotes
git remote -v
```
You should see:
- `origin`: pointing to your personal fork (`https://github.com/<your-username>/CloudVault.git`)
- `upstream`: pointing to the primary repository (`https://github.com/tushardevx01/CloudVault.git`)

---

## Step 4: Environment Configuration (STRICT RULE)

> [!CAUTION]
> **STRICT REQUIREMENT: USE EXACTLY ONE FILE NAMED `.env`**  
> Never create `.env.local`, `.env.example`, `.env.development`, or `.env.production`.  
> Never commit `.env` to Git.

Create the `.env` file in the project root:

```bash
nano .env
```

Populate it with your AWS credentials:
```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=tushardevx01
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

Verify that `.env` is ignored by Git:
```bash
git status
```
*(If `.env` appears in `git status`, STOP immediately and ensure `.gitignore` contains `.env*`)*.

---

## Step 5: Branching Strategy — Team Member Naming Convention

Every team member must work in an isolated branch named after their **first name or handle**, followed by the task type and a short slug.

### Syntax:
```text
<member-name>/<category>-<feature-description>
```

### Allowed Categories:
- `feat`: New feature or user interaction
- `fix`: Bug fix or layout repair
- `ui`: UI/UX design refinement or component update
- `docs`: Documentation updates (`README.md`, `ARCHITECTURE.md`)
- `refactor`: Code reorganization without functional changes
- `test`: Automated or manual test additions

### Examples for Team Members:
```bash
# If your name is Tushar:
git checkout -b tushar/feat-bulk-file-download
git checkout -b tushar/fix-s3-upload-timeout

# If your name is Rahul:
git checkout -b rahul/ui-storage-breakdown-card
git checkout -b rahul/fix-mobile-navbar-drawer

# If your name is Priya:
git checkout -b priya/feat-pdf-preview-zoom
git checkout -b priya/docs-viva-demonstration-guide

# If your name is Aman:
git checkout -b aman/test-virtualbox-ubuntu-sync
```

Always ensure your branch is created from the latest `upstream/main`:
```bash
git checkout main
git fetch upstream
git merge upstream/main
git checkout -b <your-name>/<category>-<feature-description>
```

---

## Step 6: Project Directory Structure

Maintain the professional folder structure established in the codebase:

```text
src/
├── app/                         # Next.js App Router
│   ├── api/                     # Backend API Route Handlers
│   │   ├── files/               # /api/files (GET list, DELETE file)
│   │   │   ├── download/        # /api/files/download (Presigned 307 redirect)
│   │   │   ├── preview/         # /api/files/preview (Presigned inline URL)
│   │   │   └── upload/          # /api/files/upload (S3 multipart upload)
│   │   ├── health/              # /api/health (S3 connectivity check)
│   │   └── stats/               # /api/stats (Storage metrics calculation)
│   ├── globals.css              # Tailwind CSS imports and tokens
│   ├── layout.tsx               # Root HTML layout and metadata
│   └── page.tsx                 # Master Dashboard page
├── components/                  # Domain-separated UI components
│   ├── dashboard/               # Dashboard widgets & telemetry
│   │   ├── CloudVsLocalSection.tsx
│   │   ├── StatsCards.tsx
│   │   ├── StorageBreakdown.tsx
│   │   └── SystemHealthSection.tsx
│   ├── files/                   # File manager table, grid, and icons
│   │   ├── FileGrid.tsx
│   │   ├── FileIcon.tsx
│   │   └── FileList.tsx
│   ├── layout/                  # Page layout shells
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── modals/                  # Interactive user dialogs
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── FilePreviewModal.tsx
│   │   └── UploadModal.tsx
│   ├── ui/                      # Primitive UI alerts & notifications
│   │   └── Toast.tsx
│   └── index.ts                 # Clean barrel export for all components
├── lib/                         # Server-side utilities and cloud services
│   ├── constants.ts             # Global constants, size limits, categories
│   ├── s3.ts                    # AWS S3 client & command helpers
│   └── utils.ts                 # Byte formatting, mime detection, key sanitization
└── types/                       # Shared TypeScript type definitions
    └── file.ts                  # S3FileItem, StorageStats, FileCategory
```

---

## Step 7: Coding Standards & Guidelines

1. **Strict TypeScript**:
   - Do not use `any`. Define clean interfaces in `src/types/` or component prop types.
   - All asynchronous functions must have proper `Promise<T>` return types and `try/catch` error handling.
2. **Component Conventions**:
   - Client components using React hooks (`useState`, `useEffect`) must begin with `"use client";`.
   - Use reusable components imported from `@/components`.
   - Prefer Lucide React for all iconography.
3. **Tailwind CSS Styling**:
   - Use design tokens defined in the project:
     - Backgrounds: `bg-[#0b0f17]`, `bg-slate-900`, `bg-slate-800`
     - Borders: `border-slate-800`, `border-slate-700/60`
     - Text: `text-white`, `text-slate-300`, `text-slate-400`
     - Accents: `text-sky-400`, `bg-sky-500`, `hover:bg-sky-400`
   - Avoid inline CSS styles unless dynamically computing widths (e.g. progress bar percentages).
4. **S3 Security**:
   - Never construct S3 keys directly from raw user input. Always pass through `sanitizeFileName()`.
   - All object keys must be prefixed with `uploads/`.

---

## Step 8: Testing & Verification

Before committing any code, you **must** verify that your changes compile and pass all checks:

```bash
# 1. Run local dev server to manually test UI
npm run dev

# 2. Execute full Next.js production build and type-checking
npm run build
```

Verify the following:
- [ ] `npm run build` exits with code 0 (zero errors, zero warnings).
- [ ] Uploading a file places the object into S3 (`uploads/` prefix).
- [ ] File preview works for supported images and PDFs.
- [ ] File download preserves the original filename.
- [ ] Deleting a file removes it from S3 and updates dashboard metrics.
- [ ] Responsive layout is verified on desktop, tablet, and mobile.

---

## Step 9: Git Commit Best Practices

We follow the **Conventional Commits** specification:

### Commit Format:
```text
<type>(<scope>): <subject>
```

### Commit Types:
- `feat`: A new feature (e.g., `feat(files): add sorting by upload date`)
- `fix`: A bug fix (e.g., `fix(ui): repair mobile drawer backdrop alignment`)
- `docs`: Documentation changes (e.g., `docs(readme): add Ubuntu VM setup steps`)
- `style`: Formatting or visual CSS adjustments without logic changes
- `refactor`: Code reorganization (e.g., `refactor(components): extract barrel exports`)
- `test`: Adding or updating test cases
- `chore`: Build configuration or dependency maintenance

### Example Workflow:
```bash
# Check modified files
git status

# Stage specific files (NEVER use 'git add -A' blindly)
git add src/components/files/FileList.tsx

# Verify .env is NOT staged
git status

# Commit with a meaningful message
git commit -m "feat(files): add copy-to-clipboard for S3 object keys"
```

---

## Step 10: Pushing Changes & Opening a Pull Request

1. Push your branch to your personal GitHub fork:
   ```bash
   git push -u origin <your-name>/<feature-name>
   ```

2. Open GitHub in your browser. You will see a banner:  
   **"Compare & pull request"**. Click it.

3. Configure your PR:
   - **Base repository**: `tushardevx01/CloudVault` (`main` branch)
   - **Head repository**: `<your-username>/CloudVault` (`<your-name>/<feature-name>`)
   - **Title**: Follow conventional commit style (e.g., `feat(dashboard): add storage quota gauge`)
   - **Description**: Fill out the automated PR template completely.

4. Submit the Pull Request.

---

## Step 11: Code Review & Syncing Upstream

### Keeping Your Branch Up to Date:
If the `upstream/main` branch has received new commits while you were working, rebase your branch:

```bash
# Fetch latest upstream commits
git fetch upstream

# Rebase your branch on top of upstream main
git checkout <your-name>/<feature-name>
git rebase upstream/main

# If conflicts occur, resolve them, then:
git add <resolved-files>
git rebase --continue

# Push rebased branch to your fork (force with lease)
git push --force-with-lease origin <your-name>/<feature-name>
```

### Review Process:
- At least one team member must review and approve the PR.
- The automated GitHub Actions CI workflow must pass with green checks.
- Once approved, the PR is merged into `main` using **Squash and Merge**.

---

Thank you for contributing to **CloudVault**! Let's build a clean, reliable, and academic-grade cloud platform.
