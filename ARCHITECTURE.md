# CloudVault — System Architecture & Technical Specifications

> **Academic Cloud Computing Project (25 Marks)**  
> **Course Module**: Distributed & Cloud Systems  
> **Student / Author**: Tushar  
> **Target Cloud Provider**: Amazon Web Services (AWS) — Amazon Simple Storage Service (S3)

---

## 1. Project Overview & Objectives

**CloudVault** is an enterprise-grade, lightweight cloud storage and file management web application. Designed as a practical academic demonstration for Cloud Computing, it highlights the technical and operational differences between local host-bound storage and distributed cloud object storage.

### Primary Objectives:
1. **Decoupled Storage**: Eliminate permanent local storage dependencies by persisting files directly into a private Amazon S3 bucket (`tushardevx01`).
2. **End-to-End File Lifecycle**: Provide a reliable interface to upload (single and multiple), list, preview (images and PDFs), download (preserving original filenames), and permanently delete files from Amazon S3.
3. **Stateless Backend**: Next.js route handlers act as a secure intermediary layer, ensuring zero storage footprint on the server.
4. **No Database / S3 as Single Source of Truth**: Eliminate external database dependencies (e.g., PostgreSQL, MongoDB). S3 object metadata and key structures serve as the authoritative metadata store.
5. **Cross-Environment Portability**: Enable multi-environment demonstration (e.g., Fedora host and Ubuntu VirtualBox VM) accessing identical cloud files concurrently.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 16.4+ | Server Components, Client State Management, Responsive Layouts |
| **Language** | TypeScript | 5.0+ | Strict type safety, interface definitions, zero `any` usage |
| **Styling** | Tailwind CSS | 4.0+ | Minimal, accessible, dark-themed UI components |
| **Backend Runtime** | Next.js Route Handlers | 16.4+ | REST API endpoints for S3 operations and data aggregation |
| **Cloud Object Storage**| Amazon S3 | AWS v3 | High-durability (11 9's), private object persistence |
| **AWS Integration** | AWS SDK for JavaScript v3 | 3.700+ | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| **Icons & UI Helpers** | Lucide React | Latest | Clean, lightweight SVGs for categories and actions |
| **Package Manager** | npm | 11.0+ | Dependency resolution and scripts |

---

## 3. System Architecture

CloudVault follows a strictly mediated 3-tier architecture:

```
┌─────────────────────────────────┐
│         Client Browser          │
│   (React 19 / Tailwind CSS)     │
└─────────────────────────────────┘
                 │
                 │ 1. HTTPS / REST API Request
                 │    (Multipart form, JSON, or redirect)
                 ▼
┌─────────────────────────────────┐
│      Next.js Backend API        │
│   (Node.js Server Runtime)      │
│   - Reads .env server-side      │
│   - Sanitizes filenames & keys  │
│   - Enforces size/type limits   │
└─────────────────────────────────┘
                 │
                 │ 2. AWS SDK v3 Commands
                 │    (PutObject, ListObjectsV2, GetObject, DeleteObject)
                 ▼
┌─────────────────────────────────┐
│     Amazon Simple Storage       │
│        Service (S3)             │
│   - Bucket: tushardevx01        │
│   - Private Access Only         │
│   - 11 9's Data Durability      │
└─────────────────────────────────┘
```

### Architecture Flow:
1. **Upload Flow**: Browser `FormData` $\rightarrow$ Next.js `/api/files/upload` $\rightarrow$ AWS SDK `PutObjectCommand` $\rightarrow$ Amazon S3.
2. **List Flow**: Browser `fetch` $\rightarrow$ Next.js `/api/files` $\rightarrow$ AWS SDK `ListObjectsV2Command` $\rightarrow$ Amazon S3.
3. **Download Flow**: Browser click $\rightarrow$ Next.js `/api/files/download` $\rightarrow$ AWS SDK `GetObjectCommand` (Signed URL with `attachment` Content-Disposition) $\rightarrow$ 307 Redirect $\rightarrow$ Browser downloads original file.
4. **Preview Flow**: Browser modal $\rightarrow$ Next.js `/api/files/preview` $\rightarrow$ AWS SDK `GetObjectCommand` (Signed URL with `inline` Content-Disposition) $\rightarrow$ Rendered in iframe/image tag.
5. **Delete Flow**: Browser confirmation $\rightarrow$ Next.js `/api/files` (`DELETE`) $\rightarrow$ AWS SDK `DeleteObjectCommand` $\rightarrow$ Amazon S3.

---

## 4. Application Folder Structure

```
CloudVault/
├── .env                         # Single configuration file (STRICT: gitignored)
├── .gitignore                   # Excludes .env, node_modules, build artifacts
├── AGENTS.md                    # Environment documentation
├── ARCHITECTURE.md              # Detailed architecture and engineering design
├── README.md                    # Setup, VirtualBox guide, and academic defense
├── next.config.ts               # Next.js build configuration
├── package.json                 # Project dependencies and npm scripts
├── package-lock.json            # Exact dependency lockfile
├── tsconfig.json                # Strict TypeScript configuration
├── public/                      # Static assets (favicons, etc.)
└── src/
    ├── app/
    │   ├── api/                 # Next.js Route Handlers (Backend API)
    │   │   ├── files/
    │   │   │   ├── route.ts     # GET (list/filter/sort), DELETE (remove from S3)
    │   │   │   ├── download/
    │   │   │   │   └── route.ts # GET (presigned URL download redirect)
    │   │   │   ├── preview/
    │   │   │   │   └── route.ts # GET (presigned inline preview URL)
    │   │   │   └── upload/
    │   │   │       └── route.ts # POST (multipart/form-data upload to S3)
    │   │   ├── health/
    │   │   │   └── route.ts     # GET (S3 connectivity verification)
    │   │   └── stats/
    │   │       └── route.ts     # GET (aggregate storage metrics from S3)
    │   ├── globals.css          # Tailwind CSS configuration and dark theme
    │   ├── layout.tsx           # Root HTML layout with metadata
    │   └── page.tsx             # Main client dashboard application
    ├── components/              # Modular, reusable React UI components
    │   ├── CloudVsLocalSection.tsx  # Academic storage comparison and checklist
    │   ├── DeleteConfirmModal.tsx   # Deletion confirmation dialog
    │   ├── FileGrid.tsx             # Grid card view of files
    │   ├── FileIcon.tsx             # Category-specific Lucide icon mapper
    │   ├── FileList.tsx             # Table view of files with actions
    │   ├── FilePreviewModal.tsx     # Image/PDF lightbox viewer
    │   ├── Navbar.tsx               # Top search and status navigation bar
    │   ├── Sidebar.tsx              # Sidebar drawer with bucket stats
    │   ├── StatsCards.tsx           # High-level metric KPI cards
    │   ├── StorageBreakdown.tsx     # Visual category proportion bar
    │   ├── SystemHealthSection.tsx  # AWS S3 connectivity diagnostics
    │   ├── Toast.tsx                # Accessible floating notifications
    │   └── UploadModal.tsx          # Multi-file drag-and-drop uploader
    ├── lib/                     # Server-side utilities and AWS integration
    │   ├── s3.ts                # S3Client, commands, auto-region resolution
    │   └── utils.ts             # Bytes formatter, categories, key sanitization
    └── types/
        └── file.ts              # TypeScript interfaces and shared types
```

---

## 5. Frontend & Backend Responsibilities

### Frontend Responsibilities
- **Reactive State Management**: Tracks active files, categories, search queries, active modals, and S3 connectivity.
- **Client-Side Validation**: Checks file sizes before sending to prevent unnecessary network egress.
- **Responsive Layout**: Fluid experience across desktop, tablet, and mobile views.
- **Accessible Interactions**: Keyboard navigation, focus management, confirmation dialogs for destructive actions.
- **Zero Secrets Exposure**: Never references `process.env.AWS_*` directly. All cloud data is retrieved via Next.js API endpoints.

### Backend Responsibilities
- **Credential Isolation**: Reads AWS credentials exclusively via server-side `process.env`.
- **Key Generation & Sanitization**: Constructs collision-proof S3 keys (`uploads/${timestamp}-${randomHex}-${sanitizedName}`) and strips directory traversal patterns (`../`).
- **S3 Operations via AWS SDK v3**: Dispatches strongly typed commands (`PutObjectCommand`, `ListObjectsV2Command`, `GetObjectCommand`, `DeleteObjectCommand`).
- **Presigned URL Generation**: Computes SigV4 presigned URLs for secure temporary (15-minute) downloads and inline previews.
- **Error Handling & Sanitization**: Catches AWS errors (e.g., `PermanentRedirect`, `AccessDenied`, `NoSuchKey`) and translates them into safe, actionable HTTP responses.

---

## 6. S3 Integration & File Operations Flow

### S3 Key Structure & Metadata
When a user uploads a file (e.g., `My Document.pdf`), CloudVault constructs:
- **Object Key**: `uploads/1793627761924-8d72232b-My_Document.pdf`
- **User Metadata**:
  - `x-amz-meta-original-name`: `My Document.pdf` (URL-encoded)
  - `x-amz-meta-category`: `document`
  - `x-amz-meta-uploaded-at`: `2026-11-02T13:56:04.170Z`
  - `ContentType`: `application/pdf`

### Automated Region Discovery
If `.env` specifies a different region than the bucket's actual physical AWS data center:
1. S3 responds with HTTP `301 PermanentRedirect`.
2. CloudVault catches the redirect and executes `GetBucketLocationCommand` via the global `us-east-1` endpoint.
3. The true region (e.g., `ap-southeast-2`) is discovered and cached in memory.
4. Subsequent operations execute seamlessly against the correct regional endpoint.

---

## 7. API Endpoints Specification

### `GET /api/health`
Verifies S3 connectivity and configuration status.
- **Success (200)**: `{ success: true, connected: true, bucket: "tushardevx01", region: "ap-southeast-2", message: "..." }`
- **Failure (503)**: `{ success: false, connected: false, missingVariables: [...], error: "..." }`

### `GET /api/stats`
Computes aggregate storage statistics directly from S3 objects.
- **Response (200)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalFiles": 12,
      "totalSizeBytes": 5242880,
      "totalSizeFormatted": "5.00 MB",
      "categories": { "image": { "count": 4, "sizeBytes": ..., "percentage": 40 }, ... },
      "recentUploads": [...],
      "bucketName": "tushardevx01",
      "region": "ap-southeast-2",
      "storageHealth": "connected"
    }
  }
  ```

### `GET /api/files`
Lists S3 objects with optional query parameters.
- **Query Params**:
  - `search`: Case-insensitive substring match on name or key.
  - `category`: `image` | `document` | `media` | `archive` | `code` | `other`.
  - `sortBy`: `date` | `name` | `size`.
  - `sortOrder`: `asc` | `desc`.
- **Response (200)**: `{ success: true, count: 12, files: [...] }`

### `POST /api/files/upload`
Uploads one or multiple files via `multipart/form-data`.
- **Body**: `FormData` containing `files` (array of `File`).
- **Enforcement**: Max 50MB per file; non-empty file requirement.
- **Response (200)**: `{ success: true, message: "...", uploaded: [...], errors: [...] }`

### `GET /api/files/download`
Issues a secure 307 temporary redirect to a presigned S3 URL.
- **Query Params**: `key` (required), `name` (optional).
- **Behavior**: Sets `ResponseContentDisposition: attachment; filename="<originalName>"`.

### `GET /api/files/preview`
Returns a short-lived (15 min) inline presigned URL for image/PDF rendering.
- **Query Params**: `key` (required), `name` (optional).
- **Response (200)**: `{ success: true, key: "...", filename: "...", previewUrl: "https://...", category: "image" }`

### `DELETE /api/files`
Deletes an object permanently from Amazon S3.
- **Query Params**: `key` (required).
- **Enforcement**: Must start with `uploads/` and contain no `..` path traversal characters.
- **Response (200)**: `{ success: true, message: "File successfully deleted from Amazon S3.", key: "..." }`

---

## 8. Database & Authentication Architecture Note

### Why No Database?
- **Academic Purity**: The goal of this evaluation is to prove understanding of cloud object storage primitives (buckets, keys, prefixes, metadata, REST API). Introducing a relational or NoSQL database creates an abstraction layer that masks real S3 operations.
- **S3 as Primary Store**: S3 stores both object payloads and metadata. CloudVault computes listings and statistics dynamically from S3 APIs.

### Authentication & Authorization Disclaimer
- In this controlled academic evaluation, authentication is intentionally omitted to allow direct, uninhibited demonstration across local host and virtual machine environments.
- **Production Note**: Deploying CloudVault in a public production environment would require:
  1. An authentication layer (e.g., NextAuth.js / Auth0 / AWS Cognito).
  2. Multi-tenant key prefixing (`uploads/${userId}/${fileId}`).
  3. Granular IAM role session policies or Cognito Identity Pool credentials per user.

---

## 9. Security Considerations

1. **Server-Side Credential Boundary**: AWS access keys are never provided to Next.js Client Components. The browser only ever receives temporary, signed URLs.
2. **Private Bucket Policy**: The S3 bucket `tushardevx01` has "Block all public access" enabled. No objects are publicly accessible over standard HTTP.
3. **Short-Lived Presigned URLs**: Preview and download tokens expire automatically after 900 seconds (15 minutes).
4. **Input Sanitization**: Object keys are validated against path traversal (`..`), control characters, and reserved URI characters.
5. **Single `.env` File Enforcement**: No multiple environment files exist; `.env` is permanently excluded from Git.

---

## 10. Local Development & Ubuntu VirtualBox Deployment

### Development Workflow
```bash
# Clone
git clone https://github.com/tushardevx01/CloudVault.git
cd CloudVault

# Configure .env (single file)
nano .env

# Install and Run
npm install
npm run dev
```

### Ubuntu VirtualBox Setup
1. Launch Ubuntu in VirtualBox with network set to **Bridged Adapter** or **NAT with Port Forwarding (3000 $\rightarrow$ 3000)**.
2. Install Node.js: `sudo apt update && sudo apt install -y nodejs npm git`.
3. Clone CloudVault and create the identical `.env` file.
4. Run `npm install && npm run dev`.
5. Open `http://localhost:3000` to verify that all S3 files uploaded from the host workstation appear instantly on the VM.
