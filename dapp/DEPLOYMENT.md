# Deployment Guide

Since this is a **static web application** (HTML, CSS, JavaScript), you can deploy it for free using several popular hosting services.

## Option 1: GitHub Pages (Easiest)
Since your code is already on GitHub, this is the quickest method.

1.  Go to your GitHub repository: [https://github.com/ArshadullaShaik/Escrow](https://github.com/ArshadullaShaik/Escrow)
2.  Click on **Settings** (top right tab).
3.  In the left sidebar, scroll down and click on **Pages**.
4.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5.  Under **Branch**, select `master` (or `main`) and `/ (root)`.
6.  Click **Save**.
7.  Wait a few minutes (you'll see a yellow/green dot in the Actions tab).
8.  Refresh the Pages settings to see your live URL (e.g., `https://ArshadullaShaik.github.io/Escrow/`).

## Option 2: Vercel (Recommended for Performance)
Vercel is excellent for static sites.

1.  Go to [Vercel.com](https://vercel.com) and sign up/login.
2.  Click **Add New...** > **Project**.
3.  Import your GitHub repository (`Escrow`).
4.  Framework Preset: Select **Other** (since it's plain HTML/JS).
5.  Root Directory: `./` (default).
6.  Click **Deploy**.

## Option 3: Netlify
Similar to Vercel, very easy to use.

1.  Go to [Netlify.com](https://netlify.com).
2.  Click **Add new site** > **Import from an existing project**.
3.  Connect to GitHub and select your `Escrow` repository.
4.  Build settings: Leave empty (no build command needed).
5.  Click **Deploy site**.

---

## ⚡ Important Note on Smart Contracts
This application contains the compiled smart contract bytecode inside `app.js`.
- Users **do not** need to manually deploy a contract to start.
- The app allows users to click **"Deploy Contract"** on the frontend, which will deploy a fresh instance of the Escrow contract to whichever network their wallet (MetaMask) is connected to (e.g., Sepolia, Goerli, or Mainnet).
