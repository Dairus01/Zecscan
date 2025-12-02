# Quick Start: Testing Decrypt Page Locally

## 1. Create Environment File

Create `web/.env.local` with:
```bash
ZINGO_SERVICE_URL=https://zecscan.onrender.com
```

## 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## 3. Test Decrypt Page

Go to: http://localhost:3000/decrypt

**Test Transaction:**
- TX ID: `9978d7c4b33dcbdac6d2dd2673e24b5ee01d6425cb0ac9c7ff67f9660eb546e0`
- UFVK: `uview19av5rvg3syp6x6vkklu5r7lag67plc388pjr34wwcnrlgkhae9p0v9nczgev90akzavs2k3tmn9mvj24vvu9kl3lafjdqjj9w0dpjl8a39p2kv2hd53z0q9cy0vc29zlhk5k27rxx8057gla7jzp9nplxpta62lnc94wneqtwdjl2kmm4ly0kgh9gw323d49hxtv9a8ylyke8tr22jygxnjzmgps08uyay52slx2fyhplkhl2mpae98gacsse0jfffc4s6k4zu05qqsxkxr4mwcnaquspdqw4vj5m0ae53ctu2ka0qw3ksspwe3ahhu2x26rjchvcv76erc6gmxwyge3qn3y3js6xdtaxtgjcspf8sy6qtvh757p0r63qh5yjxegpgcjgpanf`

## What You'll See

The page will:
1. Call `/api/decrypt-memo` (locally)
2. Which calls `https://zecscan.onrender.com/api/decrypt-memo`
3. Display the Zingo service response

Currently the Zingo service returns an informative message about zingolib being temporarily disabled. When zingolib is re-enabled, it will show the actual decrypted memo!

## Ready to Deploy?

Once testing looks good, commit and push to GitHub!
