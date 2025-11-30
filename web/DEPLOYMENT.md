# Deploying ZecScan to Vercel

This guide will help you deploy your Zcash Block Explorer to Vercel.

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
    - **Note**: The repository can be **Public** or **Private**. Vercel supports both for free on the Hobby plan.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.

## Steps

1.  **Push to GitHub**:
    - If you haven't already, commit your changes and push them to your GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

2.  **Import Project in Vercel**:
    - Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Find your `Zcash` repository (or whatever you named it) and click **"Import"**.

3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Next.js**.
    - **Root Directory**: Ensure this is set to `web` (since your Next.js app is inside the `web` folder).
        - Click "Edit" next to Root Directory and select `web`.
    - **Environment Variables**:
        - If you have any API keys or secrets (e.g., for Blockchair), add them here.
        - Currently, the app uses `https://api.blockchair.com/zcash` which is public, so you might not need any keys unless you want to avoid rate limits.

4.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your project. This might take a minute or two.

5.  **Verify**:
    - Once deployed, Vercel will give you a URL (e.g., `zecscan.vercel.app`).
    - Visit the link and check if everything works.

## Troubleshooting

- **Build Failures**: If the build fails on Vercel, check the "Logs" tab in the deployment view. It will show you exactly what went wrong (usually lint errors or type errors).
- **Lint Errors**: You can disable strict linting during build if needed (not recommended but quick fix) by adding this to `next.config.ts`:
    ```typescript
    const nextConfig = {
      eslint: {
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
    };
    export default nextConfig;
    ```
