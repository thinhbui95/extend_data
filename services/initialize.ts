import * as anchor from "@coral-xyz/anchor";
import { PROGRAM } from "./constants";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";

export async function initialize(
    connection: Connection,
    admin: PublicKey,
    payer: Keypair,
    program_data: PublicKey
) {
    const tx = await PROGRAM.methods
        .initialize()
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
