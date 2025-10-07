import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { SetAdmin } from "../target/types/set_admin";
import SetAdminIDL from "../target/idl/set_admin.json";

export const PROGRAM_ID = new PublicKey("4qDPCxVnHZHGM8oSeKGDzhrfcsxivWGX1FNyt5CZV67W")
export const CONNECTION: Connection = new Connection("http://127.0.0.1:8899", "confirmed");

export const PROGRAM = new Program(SetAdminIDL, new AnchorProvider(
    CONNECTION,
    new Wallet(Keypair.generate()),
    {}
)) as Program<SetAdmin>;