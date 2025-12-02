// Build script for compiling protobuf files
// This would compile lightwalletd proto files if we had them

fn main() {
    // For now, we'll use manual gRPC or REST approach
    // To add proto compilation:
    // tonic_build::compile_protos("proto/service.proto").unwrap();
    
    println!("cargo:rerun-if-changed=build.rs");
}
