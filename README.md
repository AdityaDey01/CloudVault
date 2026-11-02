# CloudVault ☁️
> **Cloud-Based File Storage and Management System**  
> *Academic Cloud Computing Project*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![AWS S3](https://img.shields.io/badge/Amazon%20S3-AWS%20SDK%20v3-orange?style=flat&logo=amazons3)](https://aws.amazon.com/s3/)

---

## 📌 Executive Summary

**CloudVault** is a cloud file storage and management system built with Next.js (App Router), TypeScript, Tailwind CSS, and Amazon S3 using the AWS SDK for JavaScript v3. 

The application demonstrates key cloud computing principles:
- **Decoupled Architecture**: Stateless compute layer interacting with a durable, managed cloud object store.
- **Real Amazon S3 Persistence**: Files are not stored on local disks; they are persisted directly in private Amazon S3 buckets.
- **Remote Access & Elasticity**: Objects stored in S3 are accessible across machines (e.g., host workstation and Ubuntu VirtualBox VM) with zero manual synchronization.
- **Security & Least Privilege**: IAM-based authentication, private S3 bucket enforcement, and short-lived presigned URLs for preview and download.

---

## 🏛️ System Architecture

CloudVault enforces a strict 3-tier cloud architecture:

```
┌─────────────────┐       HTTPS       ┌────────────────────────┐       AWS SDK v3       ┌──────────────────────┐
│  Client Browser │ ────────────────> │ Next.js Backend Engine │ ─────────────────────> │  Amazon Web Services │
│ (React / UI)    │ <──────────────── │ (App Route Handlers)   │ <───────────────────── │  (Amazon S3 Bucket)  │
└─────────────────┘      REST API     └────────────────────────┘      SigV4 / REST      └──────────────────────┘
                                                  │
                                                  ▼
                                      ┌────────────────────────┐
                                      │  Environment (.env)    │
                                      │  (Strictly Server-Side)│
                                      └────────────────────────┘
```

### Architectural Principles
1. **Stateless Backend**: The Next.js server never stores files permanently on the local filesystem. Uploads are streamed or buffered in memory and immediately transferred to Amazon S3.
2. **Private S3 Objects**: The S3 bucket (`tushardevx01`) blocks all public access. File reads and downloads are gated through authenticated server endpoints or time-bounded presigned URLs (15-minute expiration).
3. **Automatic Region Discovery**: CloudVault includes an automated fallback mechanism: if an S3 bucket is physically located in a different AWS region than specified in `.env`, the system automatically resolves the bucket location via AWS S3 APIs and transparently routes all requests without downtime.

---

## ⚙️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, Lucide Icons
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS
- **Backend**: Next.js Route Handlers (`/api/files`, `/api/files/upload`, `/api/files/download`, `/api/files/preview`, `/api/stats`, `/api/health`)
- **Cloud Storage**: Amazon Web Services (AWS) S3
- **AWS Integration**: AWS SDK for JavaScript v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Package Manager**: npm

---

## 🔑 Environment Configuration

In accordance with strict project security specifications:
- **Only one configuration file is permitted: `.env`.**
- Never create `.env.example`, `.env.local`, `.env.production`, or other alternatives.
- `.env` is strictly excluded in `.gitignore` and **must never be committed to Git**.
- AWS credentials are kept isolated strictly on the server and are never sent to the browser bundle.

### Required Variables in `.env`:

```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=tushardevx01
```

*(Note: While the project documentation specifies `ap-south-1`, bucket `tushardevx01` is hosted in `ap-southeast-2`. CloudVault contains built-in region auto-discovery so either region setting will automatically resolve and connect).*

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (version 18, 20, or 22+)
- npm (version 9+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/tushardevx01/CloudVault.git
cd CloudVault
```

### 2. Configure Environment
Create the `.env` file in the root directory:
```bash
nano .env
```
Paste your AWS credentials:
```env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=tushardevx01
```
Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### 3. Install Dependencies
```bash
npm install
```

### 4. Build and Start the Application
For production:
```bash
npm run build
npm run start
```
For local development:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖥️ Academic VirtualBox (Ubuntu) Demonstration Guide

To satisfy the **Multi-Environment Remote Access** requirement (accessing cloud files from another machine or VM without copying local disk files):

### Step 1: Open Ubuntu VirtualBox
Ensure network adapter is configured for **Bridged Adapter** or **NAT with Port Forwarding (3000 -> 3000)**.

### Step 2: Open Terminal inside Ubuntu VM
```bash
# Update package indices and ensure Node.js is present
sudo apt update
sudo apt install -y nodejs npm git

# Verify versions
node -v
npm -v
```

### Step 3: Clone Repository in Ubuntu
```bash
git clone https://github.com/tushardevx01/CloudVault.git
cd CloudVault
```

### Step 4: Create the identical `.env` file
```bash
cat << 'EOF' > .env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET_NAME=tushardevx01
EOF
```

### Step 5: Run Application
```bash
npm install
npm run dev
```

### Step 6: Verify Cloud Synchronization
1. Open `http://localhost:3000` inside the Ubuntu VM browser.
2. Observe that **all files uploaded from your host machine appear immediately**.
3. Upload a file from the Ubuntu VM; observe it in the host browser.
4. **Conclusion**: Proves that storage is decoupled from the compute instance and resides in Amazon S3.

---

## 📊 Cloud Storage vs. Local Storage: Academic Defense

| Technical Dimension | Local Block Storage (Ext4 / NTFS / APFS) | Amazon S3 Cloud Object Storage |
| :--- | :--- | :--- |
| **Data Hierarchy** | Hierarchical directory tree governed by filesystem inodes. | Flat key-value namespace grouped under logical prefixes within buckets. |
| **Access Protocol** | Kernel POSIX system calls (`open()`, `read()`, `write()`, `close()`) over SATA/NVMe. | Stateless REST APIs over HTTPS (`GET`, `PUT`, `DELETE`) with signature authorization. |
| **Durability & Redundancy** | Single Point of Failure (SPOF). Physical drive crash or sector rot yields data loss unless manual RAID is provisioned. | Designed for **99.999999999% (11 9's)** durability. Data is automatically replicated across $\ge 3$ distinct AWS Availability Zones. |
| **Elasticity & Scalability** | Rigid ceiling bounded by drive partition size; expansion demands repartitioning or disk swaps. | Virtually infinite on-demand scalability with zero capacity planning or volume partitioning. |
| **Compute Coupling** | Storage is tightly bound to the physical host motherboard. Machine shutdown denies all file access. | **Decoupled Architecture**: Any authorized compute client (VirtualBox, Fedora, AWS EC2, mobile) accesses identical data globally. |
| **Access Control** | Local UNIX file permissions (`chmod`, `chown`, POSIX ACLs) tied to local system UID/GID. | Granular AWS IAM policies, Bucket Policies, AWS KMS encryption at rest, and short-lived presigned URLs. |

---

## 🧪 7-Step Academic Demonstration Script ()

1. **Upload from Local Computer**:
   - Click **Upload New Files** or drag-and-drop any image, PDF, or document.
   - Observe upload progress and success notification.
2. **Store in Amazon S3**:
   - The file is converted into an S3 object with a sanitized, collision-safe key (`uploads/<timestamp>-<rand>-<filename>`) and custom S3 metadata (`x-amz-meta-original-name`).
3. **View in Application**:
   - The dashboard dynamically displays file count, total bytes consumed, and category distribution.
   - Click **Preview** on images or PDFs to inspect inline previews generated via S3 presigned URLs.
4. **Download from Cloud Storage**:
   - Click **Download**. CloudVault issues a secure HTTP 307 redirect to a presigned URL with `ResponseContentDisposition: attachment; filename="<original_name>"`, preserving the original filename.
5. **Delete from Cloud Storage**:
   - Click the **Trash** icon. Confirm deletion in the modal.
   - S3 `DeleteObjectCommand` is dispatched; dashboard metrics update instantly.
6. **Cross-Environment Access**:
   - Launch CloudVault in Ubuntu VirtualBox; verify identical S3 bucket contents without local file transfer.
7. **Cloud vs Local Analysis**:
   - Navigate to the **Cloud vs Local** tab to demonstrate the technical comparison matrix and live verification checklist.

---

## 🔒 Security & Hardening Measures

- **No Credential Leakage**: Environment variables are strictly inspected on the server. Next.js does not bundle `AWS_*` variables into client-side JS bundles.
- **Path Traversal Protection**: All object keys are sanitized to strip `../`, directory breakouts, and illegal characters. All requests must start with `uploads/`.
- **Private Bucket Integrity**: No public ACLs or public bucket policies are enabled. All objects remain private.
- **Input Validation**: Enforces a 50MB single-file size ceiling and rejects 0-byte empty files.
- **Strict Git Hygiene**: `.gitignore` comprehensively excludes all variants of `.env*`.

---

## 📄 License
Academic Project developed for Cloud Computing Evaluation. All rights reserved.
