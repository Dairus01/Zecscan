# Zingo Decryption Service

A standalone HTTP microservice for decrypting Zcash shielded transactions using zingolib.

## Architecture

This service provides HTTP REST APIs that can be called from your Next.js application (running on Vercel) to perform real Zcash transaction decryption.

```
Vercel (Next.js) ─HTTP─> Zingo Service (Rust) ─gRPC─> Lightwalletd (zec.rocks)
```

## API Endpoints

### `POST /api/decrypt-memo`

Decrypt a single transaction's memo.

**Request:**
```json
{
  "ufvk": "uview1...",
  "txid": "abc123...",
  "lightwalletd_url": "https://zec.rocks:443" // optional
}
```

**Response:**
```json
{
  "success": true,
  "memo": "Hello, private transaction!",
  "amount": 1000000,
  "txid": "abc123..."
}
```

### `POST /api/scan-transactions`

Scan blockchain for all transactions belonging to a viewing key.

**Request:**
```json
{
  "ufvk": "uview1...",
  "start_height": 2698000,
  "end_height": 2700000,
  "lightwalletd_url": "https://zec.rocks:443" // optional
}
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "txid": "abc123...",
      "height": 2699500,
      "amount": 1000000,
      "memo": "Payment for services",
      "timestamp": 1234567890
    }
  ],
  "balance": {
    "confirmed": 5000000,
    "unconfirmed": 0,
    "total": 5000000
  }
}
```

### `GET /health`

Health check endpoint.

## Development

### Prerequisites

- Rust 1.70 or later
- Cargo

### Running Locally

```bash
# Install dependencies
cargo build

# Run the service
cargo run

# Or with custom port
PORT=3001 cargo run
```

The service will start on `http://localhost:3001`

### Testing

```bash
# Health check
curl http://localhost:3001/health

# Test decrypt (will return placeholder error until zingolib is integrated)
curl -X POST http://localhost:3001/api/decrypt-memo \
  -H "Content-Type: application/json" \
  -d '{"ufvk":"uview1test...","txid":"abc123..."}'
```

## Deployment

### Option 1: Railway.app (Recommended)

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub" 
3. Select this repository
4. Railway will auto-detect the Rust project
5. Set root directory to `zingo-service`
6. Deploy!

Your service URL: `https://your-app.railway.app`

### Option 2: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch (from zingo-service directory)
flyctl launch

# Deploy
flyctl deploy
```

### Option 3: Docker

```bash
# Build image
docker build -t zingo-service .

# Run container
docker run -p 3001:3001 zingo-service
```

## Integration with Next.js

Add environment variable to your Vercel project:

```env
ZINGO_SERVICE_URL=https://your-zingo-service.railway.app
```

Update `/api/decrypt-memo/route.ts`:

```typescript
const response = await fetch(`${process.env.ZINGO_SERVICE_URL}/api/decrypt-memo`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ufvk: viewingKey, txid: txId }),
});

const data = await response.json();
```

## Current Status

⚠️ **Zingolib Integration Pending**

The HTTP service structure is complete, but actual zingolib integration requires:

1. **Wallet creation from UFVK** - Parse unified viewing key and initialize wallet
2. **Lightwalletd connection** - Establish gRPC connection to sync server
3. **Transaction decryption** - Implement trial decryption with viewing key
4. **Memo extraction** - Decrypt and parse memo fields
5. **Balance calculation** - Sum all decrypted notes

See `src/decrypt.rs` and `src/scan.rs` for implementation placeholders.

## Security Notes

- Never log viewing keys or decrypted memos
- Use HTTPS in production (Railway/Fly.io provide this automatically)
- Consider adding API key authentication
- Implement rate limiting for production use
- Restrict CORS to your Vercel domain only

## License

MIT
