# CloudVault — Team Contribution Guide 🤝

This document provides step-by-step instructions for all project contributors and core team members: **Aditya**, **Purabi**, **Sankalpa**, **Dabjit**, **Shankar**, and **Tushar**.

---

## 👥 Core Project Team & Branch Namespaces

Every team member must work on dedicated branches prefixed with their personal name to ensure clean version control and traceable collaboration:

| Member Name | Role / Area of Focus | Branch Namespace Prefix | Example Branch |
| :--- | :--- | :--- | :--- |
| **Aditya** | Search, Filtering & Core Features | `aditya/` | `aditya/feat-advanced-search` |
| **Purabi** | UI/UX Design & Component Hierarchy | `purabi/` | `purabi/ui-preview-enhancements` |
| **Sankalpa** | S3 Integration & Backend API Routes | `sankalpa/` | `sankalpa/feat-multipart-upload` |
| **Dabjit** | Storage Metrics & System Telemetry | `dabjit/` | `dabjit/fix-storage-stats` |
| **Shankar** | Deployment, Security Audit & Docs | `shankar/` | `shankar/docs-ubuntu-setup` |
| **Tushar** | Project Lead & Cloud Architecture | `tushar/` | `tushar/refactor-architecture` |

---

## 🚀 7-Step Team Contribution Workflow

### Step 1: Fork the Repository
1. Navigate to the primary repository:  
   `https://github.com/tushardevx01/CloudVault`
2. In the top-right corner, click **Fork**.
3. Choose your GitHub account as the destination.
4. Ensure **"Copy the main branch only"** is checked.
5. Click **Create fork**.

---

### Step 2: Clone Your Fork Locally
Clone your fork to your development computer (or Ubuntu VirtualBox VM):

```bash
# Replace <your-github-username> with your GitHub handle:
git clone https://github.com/<your-github-username>/CloudVault.git
cd CloudVault

# Install project dependencies:
npm install
```

---

### Step 3: Configure the Upstream Remote
Link your local copy to the central repository so you can always pull the latest updates:

```bash
git remote add upstream https://github.com/tushardevx01/CloudVault.git

# Verify that both 'origin' and 'upstream' are configured:
git remote -v
```

---

### Step 4: Environment Configuration (STRICT RULE)
> [!CAUTION]
> **Use ONLY ONE file named `.env` in the root directory.**  
> Never create `.env.local`, `.env.example`, or `.env.production`.  
> Never commit `.env` to Git.

Create `.env` in the project root:
```bash
nano .env
```

Add your AWS credentials:
```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=tushardevx01
```

Save (`Ctrl+O`, `Enter`, `Ctrl+X`) and verify it is untracked:
```bash
git status
```
*(If `.env` is listed in git status, STOP immediately and check `.gitignore`).*

---

### Step 5: Create a Branch Named According to Your Team Member Name
Always branch off the latest `upstream/main`:

```bash
# 1. Sync with central main
git checkout main
git fetch upstream
git merge upstream/main

# 2. Create your isolated feature branch
```

#### Team Member Branch Commands:
```bash
# Aditya:
git checkout -b aditya/feat-advanced-search
git checkout -b aditya/fix-search-debounce

# Purabi:
git checkout -b purabi/ui-preview-modal-redesign
git checkout -b purabi/ui-file-grid-cards

# Sankalpa:
git checkout -b sankalpa/feat-pdf-preview-streaming
git checkout -b sankalpa/refactor-s3-client-config

# Dabjit:
git checkout -b dabjit/feat-storage-metrics-chart
git checkout -b dabjit/fix-file-size-formatter

# Shankar:
git checkout -b shankar/docs-ubuntu-vm-guide
git checkout -b shankar/test-virtualbox-s3-sync

# Tushar:
git checkout -b tushar/refactor-domain-components
git checkout -b tushar/feat-bulk-download
```

Branch category prefixes:
- `feat`: New feature or user capability
- `fix`: Bug fix or layout issue
- `ui`: UI/UX styling or responsive refinement
- `docs`: Documentation updates
- `refactor`: Clean code restructure without functional change
- `test`: Automated or manual test additions

---

### Step 6: Modify Code & Verify Locally

1. Follow the professional folder structure:
   - `src/components/` for React components (`layout/`, `dashboard/`, `files/`, `modals/`, `ui/`)
   - `src/app/api/` for Next.js Route Handlers
   - `src/lib/` for shared utilities and AWS S3 client
   - `src/types/` for TypeScript interfaces
2. Test your changes locally:
   ```bash
   # Run development server:
   npm run dev

   # Verify production build with 0 TypeScript/lint errors:
   npm run build
   ```

---

### Step 7: Commit, Push, and Open a Pull Request

#### 1. Commit with Conventional Commit Messages:
```bash
git add .
git commit -m "feat(search): add category tag filtering"
```

#### 2. Push to Your Fork:
```bash
git push -u origin <your-branch-name>
# Example: git push -u origin aditya/feat-advanced-search
```

#### 3. Open a Pull Request:
1. Navigate to your fork on GitHub.
2. Click **"Compare & pull request"**.
3. Ensure the base repository is `tushardevx01/CloudVault` (`main` branch) and the head branch is your feature branch.
4. Fill in the Pull Request template detailing:
   - Summary of changes
   - Which team member authored the PR
   - Testing steps performed
5. Request review from another team member. Once approved, the PR will be merged into `main`!

---

For additional technical architecture specifications, see [ARCHITECTURE.md](file:///home/tushardevx01/Documents/CloudVault/ARCHITECTURE.md). For detailed project overview and deployment instructions, see [README.md](file:///home/tushardevx01/Documents/CloudVault/README.md).
