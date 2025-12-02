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
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Try downloading zecwallet-cli - use latest stable version
# If v1.8.9 doesn't exist, try v1.8.0 or other versions
RUN echo "Downloading zecwallet-cli..." && \
    (wget -q https://github.com/adityapk00/zecwallet-light-cli/releases/download/v1.8.9/linux-zecwallet-cli-v1.8.9.tar.gz -O /tmp/zecwallet.tar.gz || \
    wget -q https://github.com/adityapk00/zecwallet-light-cli/releases/download/v1.8.0/linux-zecwallet-cli-v1.8.0.tar.gz -O /tmp/zecwallet.tar.gz) && \
    echo "Extracting..." && \
    cd /tmp && \
    tar -xzf zecwallet.tar.gz && \
    echo "Finding binary..." && \
    find /tmp -name "zecwallet-cli" -type f && \
    find /tmp -name "zecwallet-cli" -type f -exec cp {} /usr/local/bin/zecwallet-cli \; && \
    chmod +x /usr/local/bin/zecwallet-cli && \
    rm -rf /tmp/zecwallet.tar.gz /tmp/linux-* && \
    echo "Verifying installation..." && \
    ls -la /usr/local/bin/zecwallet-cli && \
    (zecwallet-cli --help || echo "Binary installed at /usr/local/bin/zecwallet-cli")

# Copy the built binary from builder
COPY --from=builder /app/target/release/zingo-service .

# Expose port
EXPOSE 3001

# Set environment variable for port
ENV PORT=3001

# Run the binary
CMD ["./zingo-service"]
