# ✍️ Medium Blog - Full-Stack Backend

This repository contains the complete backend source code for a modern, serverless blogging platform built on the Cloudflare Workers ecosystem. It features a robust API for user authentication, blog post management, and utilizes a shared validation library for type safety.

---

## ✨ Features

* **Serverless Architecture**: Built entirely on **Cloudflare Workers** for global scale and performance.
* **Fast & Lightweight**: Uses **Hono**, a blazing-fast, lightweight web framework for edge environments.
* **Database ORM**: Integrates with **Prisma** and **Prisma Accelerate** for type-safe database access to a PostgreSQL database.
* **Authentication**: Secure user signup and signin using **JWT** (JSON Web Tokens) and hashed passwords with **bcryptjs**.
* **Type-Safe Validation**: Shared request validation schemas using **Zod**, published as a private npm package for consistency between frontend and backend.
* **Monorepo Structure**: A clean pnpm workspace setup separating the `backend` worker from the `common` shared library.
* **Ready to Deploy**: Streamlined deployment process using the **Wrangler CLI**.

---

## 📂 Project Structure

The project is organized as a monorepo with two main packages:

```
medium-blog/
├── backend/                # Cloudflare Worker API
│   ├── prisma/
│   │   └── schema.prisma   # Database models (User, Post)
│   ├── src/
│   │   └── index.ts        # Hono application routes and logic
│   ├── package.json
│   └── wrangler.toml       # Cloudflare Worker configuration
│
├── common/                 # Shared validation library
│   ├── src/
│   │   └── index.ts        # Zod schemas and TypeScript types
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

* **Runtime**: Cloudflare Workers
* **Framework**: Hono
* **Database**: PostgreSQL
* **ORM**: Prisma (with Prisma Accelerate)
* **Authentication**: JWT (`hono/jwt`) & bcryptjs
* **Validation**: Zod
* **Deployment**: Wrangler CLI

---

## 🚀 Getting Started

Follow these instructions to set up, run, and deploy the project on your own Cloudflare account.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or later)
* [pnpm](https://pnpm.io/installation) (or npm/yarn)
* A [Cloudflare account](https://dash.cloudflare.com/sign-up)
* A PostgreSQL database (e.g., from [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Aiven](https://aiven.io/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medium-blog.git
cd medium-blog
```

### 2. Install Dependencies

This project uses pnpm workspaces. Install all dependencies from the root directory.

```bash
pnpm install
```

### 3. Set Up Environment Variables

The backend worker requires two crucial environment variables. Create a `.dev.vars` file inside the `backend` directory. This file is used by `wrangler dev` for local development.

**File: backend/.dev.vars**

```ini
# Direct connection string for your PostgreSQL database (used for Prisma migrations)
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"

# A strong, secret key for signing JWTs
JWT_SECRET="your-super-secret-key"
```

### 4. Database Setup with Prisma

**a. Configure Prisma Schema:**
The schema is already defined in `backend/prisma/schema.prisma`. It uses the `DATABASE_URL` environment variable.

**b. Run Database Migrations:**

```bash
cd backend
pnpm prisma migrate dev
```

**c. Generate Prisma Client:**

```bash
pnpm prisma generate
```

---

## 💻 Local Development

To run the server locally, use the `wrangler dev` command from the backend directory. This will start a local server that emulates the Cloudflare Workers environment and automatically loads your `.dev.vars` file.

```bash
cd backend
pnpm dev
```

Your API will be available at `http://localhost:8787`.

---

## ☁️ Deployment to Cloudflare

### 1. Login to Wrangler

```bash
pnpm wrangler login
```

### 2. Configure Prisma Accelerate

For a serverless environment like Cloudflare Workers, a direct database connection is not ideal. Prisma Accelerate provides a connection pool and global cache over a serverless-friendly HTTP connection.

**a. Enable Accelerate:** Go to your project on the Prisma Data Platform and enable Accelerate.

**b. Get the Accelerate URL:** Generate an API key and copy the connection string. It will look like this:

```
prisma://accelerate.prisma-data.net/?api_key=...
```

### 3. Set Cloudflare Secrets

Never store production database URLs or secrets in your `wrangler.toml` file. Use Wrangler secrets, which are securely encrypted.

```bash
# From the /backend directory
# Use the Prisma Accelerate connection string here
pnpm wrangler secret put DATABASE_URL

# Use your production JWT secret
pnpm wrangler secret put JWT_SECRET
```

### 4. Deploy!

```bash
cd backend
pnpm deploy
```

Wrangler will build your project, upload it to Cloudflare, and provide you with your public worker URL.

---

## 🔗 API Endpoints

**Base URL:** `https://your-worker-name.your-subdomain.workers.dev/api/v1`

### 👤 User Endpoints

#### Sign Up

Creates a new user account.

* **Method:** POST
* **Endpoint:** `/user/signup`

**Request Body:**

```json
{
  "email": "test@example.com",
  "password": "strongpassword123",
  "name": "Test User"
}
```

**Success Response (201):**

```json
{
  "id": "c5f8e9b0-5b2a-4b1e-8c3b-2f3a1d9c8e7f",
  "email": "test@example.com"
}
```

**Error Response (409):**

```json
{
  "message": "Email already exists"
}
```

#### Sign In

Authenticates a user and returns a JWT.

* **Method:** POST
* **Endpoint:** `/user/signin`

**Request Body:**

```json
{
  "email": "test@example.com",
  "password": "strongpassword123"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📝 Blog Endpoints

Note: All blog endpoints (except GET) require an `Authorization: Bearer <TOKEN>` header.

#### Create Blog Post

* **Method:** POST
* **Endpoint:** `/blog`

**Request Body:**

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of the post."
}
```

**Success Response (201):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

#### Update Blog Post

* **Method:** PUT
* **Endpoint:** `/blog`

**Request Body:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "title": "Updated Title",
  "content": "Updated content."
}
```

**Success Response (200):**

```json
{
  "message": "Blog post updated successfully"
}
```

#### Get Blog Post by ID

* **Method:** GET
* **Endpoint:** `/blog/:id`

**Example:** `/blog/a1b2c3d4-e5f6-7890-1234-567890abcdef`

**Success Response (200):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "title": "Updated Title",
  "content": "Updated content.",
  "author": {
    "name": "Test User"
  }
}
```

#### Get All Blog Posts (Bulk)

* **Method:** GET
* **Endpoint:** `/blog/bulk`

**Success Response (200):**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "title": "Updated Title",
    "content": "Updated content.",
    "author": {
      "name": "Test User"
    }
  }
]
```
# 📦 abhi-medium-blog (Common Module)

A reusable **validation and type-safety library** for the [Medium Blog API](https://backend.abhi-medium-blog.workers.dev/api/v1), built and maintained by **Abhisek Sahoo**.
This package provides **Zod schemas** and **TypeScript types** that are shared across the backend and frontend, ensuring consistent validation and reducing duplication.

---

## ✨ Features

* **Zod Schemas**: Centralized validation rules for user authentication and blog post operations.
* **TypeScript Types**: Automatically inferred types for safer frontend–backend integration.
* **Shared Module**: Designed for monorepos or external consumers via npm.
* **Lightweight**: Pure TypeScript + Zod, no extra dependencies beyond dev tooling.

---

## 📂 Project Structure

```
common/
├── src/
│   └── index.ts        # Main exports (schemas + types)
├── package.json
├── tsconfig.json
└── .npmignore
```

---

## 🚀 Installation

Install from npm:

```bash
npm install abhi-medium-blog
```

---

## 🛠️ Usage

Import schemas and types directly into your project:

```ts
import {
  signupInput,
  signinInput,
  createBlogInput,
  editBlogInput,
  type SignupInput,
  type SigninInput,
  type CreateBlogInput,
  type EditBlogInput
} from "abhi-medium-blog";

// Example: validating signup
const parsed = signupInput.parse({
  email: "alice@example.com",
  password: "Password123",
  name: "Alice"
});

console.log(parsed); // ✅ safe, validated object
```

---

## 📑 Exports

### Schemas

* `signupInput` → `{ email: string; password: string; name?: string }`
* `signinInput` → `{ email: string; password: string }`
* `createBlogInput` → `{ title: string; content: string }`
* `editBlogInput` → `{ id: string; title: string; content: string }`

### Types

* `SignupInput`
* `SigninInput`
* `CreateBlogInput`
* `EditBlogInput`

---

## 📝 Example with Backend

In the backend, you can use the schemas to validate incoming requests:

```ts
import { signupInput } from "abhi-medium-blog";

app.post("/api/v1/user/signup", async (c) => {
  const body = await c.req.json();

  const parsed = signupInput.safeParse(body);
  if (!parsed.success) {
    return c.json({ message: "Invalid input", errors: parsed.error.errors }, 400);
  }

  // parsed.data is type-safe and validated
  const { email, password, name } = parsed.data;
  // ... continue with Prisma + JWT logic
});
```

---

## 👨‍💻 Author

Developed and maintained by **Abhisek Sahoo**

* 🌐 GitHub
* 📧 [abhiseksahoo7154@example.com](mailto:abhiperl1000@gmail.com)
  (replace with your actual email if you want)
