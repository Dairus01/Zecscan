# Build stage
FROM rust:1.75-bookworm as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./
COPY build.rs ./

# Copy source code  
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Download and install zecwallet-cli binary
# Try direct binary download first, then try tar.gz
RUN wget -q https://github.com/adityapk00/zecwallet-light-cli/releases/download/v1.8.9/linux-zecwallet-cli-v1.8.9.tar.gz -O /tmp/zecwallet.tar.gz && \
    cd /tmp && \
    tar -xzf zecwallet.tar.gz && \
    find /tmp -name "zecwallet-cli" -type f -exec cp {} /usr/local/bin/zecwallet-cli \; && \
    chmod +x /usr/local/bin/zecwallet-cli && \
    rm -rf /tmp/zecwallet.tar.gz /tmp/linux-* && \
    zecwallet-cli --help || echo "Zecwallet-cli installed"

# Copy the built binary from builder
COPY --from=builder /app/target/release/zingo-service .

# Expose port
EXPOSE 3001

# Set environment variable for port
ENV PORT=3001

# Run the binary
CMD ["./zingo-service"]
