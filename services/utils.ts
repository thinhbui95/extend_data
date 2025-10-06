import { PublicKey } from "@solana/web3.js";
export function getAdminAddress(
    programID: PublicKey,
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("admin_data_7")],
        programID,
    )[0];
}

export function getProgramDataAddress(programId: PublicKey): PublicKey {
    const BPF_LOADER_PROGRAM_ID = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
    console.log("Program ID: ", BPF_LOADER_PROGRAM_ID.toBase58());

    const programKey = new PublicKey(programId);
    const [programDataAddress] = PublicKey.findProgramAddressSync(
        [programKey.toBuffer()],
        BPF_LOADER_PROGRAM_ID
    );
    return programDataAddress;
}