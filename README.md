---

# 🪙 Token Launchpad

A simple yet powerful web application built with **React** and **Solana** that allows users to create their own SPL tokens (using the Token 2022 Program) with custom metadata and initial supply, directly from their browser.

---

## 🚀 Features

* Upload a custom image and metadata for your token
* Create a new SPL Token (2022) on the Solana blockchain
* Automatically initializes the mint, metadata, and associated token account
* Uploads metadata to GitHub Gist for decentralized URI storage
* Uses ImgBB for image hosting
* Fully compatible with Solana Wallet Adapter

---

## 📦 Tech Stack

* **React** + **TypeScript**
* **Solana Web3.js**
* **@solana/spl-token** & **spl-token-metadata**
* **Wallet Adapter** (React)
* **ImgBB API** – for image uploads
* **GitHub Gists API** – to host token metadata

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/Mudit-Jxin7/Token-launchpad.git
cd token-launchpad
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create `.env` File

Add a `.env` file in the root with the following environment variables:

```env
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

* You can generate an ImgBB API key from [https://api.imgbb.com/](https://api.imgbb.com/)
* Create a GitHub personal access token from [GitHub Developer Settings](https://github.com/settings/tokens) with `gist` permission

---

## 💡 How It Works

1. **Form Submission**: User fills in the token name, symbol, image, and initial supply.
2. **Image Upload**: The image is uploaded to ImgBB and a public URL is retrieved.
3. **Metadata Upload**: Metadata (name, symbol, image URL) is pushed to GitHub Gist and the raw JSON URL is used as the token URI.
4. **Token Minting**:

   * Creates a new token mint using the Token 2022 Program
   * Initializes metadata using `spl-token-metadata`
   * Mints initial supply to the user's associated token account

---

## 🧪 Testing the App

1. Make sure you have a **Solana wallet** like Phantom installed.
2. Connect your wallet to the app.
3. Fill the form and hit **"Launch Token 🚀"**.
4. Wait for the confirmation. You’ll see logs in the console and an alert on success.
5. Check your wallet for your token.

---

## 🧰 Folder Structure

```
src/
├── Launchpad.tsx  # Main token launch UI + logic
├── App.tsx
└── main.tsx
```

---
