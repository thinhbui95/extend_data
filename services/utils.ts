import { PublicKey } from "@solana/web3.js";
export function getAdminAddress(
    programID: PublicKey,
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("admin_data_test")],
        programID,
    )[0];
}

export function getProgramDataAddress(programId: PublicKey): PublicKey {
    const BPF_LOADER_PROGRAM_ID = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");
    const programKey = new PublicKey(programId);
    const [programDataAddress] = PublicKey.findProgramAddressSync(
        [programKey.toBuffer()],
        BPF_LOADER_PROGRAM_ID
    );
    return programDataAddress;
}

export async function getAdditionalDatas(address: PublicKey, program: any): Promise<bigint[]> {
    const accountInfo = await program.account.adminData.getAccountInfo(address);

    if (!accountInfo) {
        throw new Error("Account not found");
    }

    const data = accountInfo.data;
    let offset = 8; // Discriminator (8 bytes) 

    // Read Vec<Pubkey> length (4 bytes)
    const adminCount = data.readUInt32LE(offset);
    offset += 4;

    // Skip over the Pubkeys (32 bytes each)
    offset += adminCount * 32;

    const additionalDatas: bigint[] = [];

    // Read remaining data as u128 values (16 bytes each)
    while (offset + 16 <= data.length) {
        // Read 16 bytes and convert to BigInt (u128)
        const bytes = data.subarray(offset, offset + 16);
        // Convert little-endian bytes to BigInt
        let value = BigInt(0);
        for (let i = 15; i >= 0; i--) {
            value = (value << BigInt(8)) + BigInt(bytes[i]);
        }

        additionalDatas.push(value);
        offset += 16;
    }
    return additionalDatas;
}