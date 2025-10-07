import * as anchor from "@coral-xyz/anchor";
import { PROGRAM } from "./constants";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import BN from 'bn.js';

export async function extendAccount(
    connection: Connection,
    admin: PublicKey,
    additionalData: BN[],
    payer: Keypair,
    program_data: PublicKey
) {
    const tx = await PROGRAM.methods
        .extendAccount(additionalData)
        .accounts({
            user: payer.publicKey,
            adminData: admin,
            programData: program_data,
        })
        .transaction();

    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const signers = [payer];
    tx.partialSign(...signers);

    const signedTx = await anchor.web3.sendAndConfirmTransaction(
        connection,
        tx,
        signers,
        {
            skipPreflight: true
        }
    );

    return signedTx;
}
