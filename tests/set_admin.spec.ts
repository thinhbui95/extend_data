import { PublicKey, Keypair, Connection } from "@solana/web3.js";

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as services from "../services";

describe("set_admin", () => {
  let connection = services.CONNECTION;
  const adminAddress = services.getAdminAddress(services.PROGRAM_ID);
  let defaultAccount: Keypair;
  before(async () => {
    const walletPath = path.join(os.homedir(), '.config', 'solana', 'id.json');
    const savedKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    defaultAccount = Keypair.fromSecretKey(new Uint8Array(savedKey));
    console.log("Default account public key:", defaultAccount.publicKey.toBase58());
  })

  it("Initialize program", async () => {
    const adminAddress = services.getAdminAddress(services.PROGRAM_ID);
    const programDataAddress = services.getProgramDataAddress(services.PROGRAM_ID);
    console.log("Admin Address: ", adminAddress.toBase58());
    console.log("Program Data Address: ", programDataAddress.toBase58());
    const tx = await services.initialize(
      connection,
      adminAddress,
      defaultAccount,
      programDataAddress
    );
    console.log("Your transaction signature", tx);
    const account = await services.PROGRAM.account.adminData.fetch(adminAddress);

  });
  it("Set new admin", async () => {
    const adminAddress = services.getAdminAddress(services.PROGRAM_ID);
    const programDataAddress = services.getProgramDataAddress(services.PROGRAM_ID);
    const newAdmin1 = Keypair.generate();
    const newAdmin2 = Keypair.generate();
    console.log("New Admin 1: ", newAdmin1.publicKey.toBase58());
    console.log("New Admin 2: ", newAdmin2.publicKey.toBase58());
    const tx = await services.setAdmin(
      connection,
      adminAddress,
      [newAdmin1.publicKey, newAdmin2.publicKey],
      defaultAccount,
      programDataAddress
    );
    console.log("Your transaction signature", tx);
    const account = await services.PROGRAM.account.adminData.fetch(adminAddress);
    console.log("Admins: ", account.admin);
  });

  it("Set new admin again", async () => {
    const adminAddress = services.getAdminAddress(services.PROGRAM_ID);
    const programDataAddress = services.getProgramDataAddress(services.PROGRAM_ID);
    const newAdmin3 = Keypair.generate();
    console.log("New Admin 3: ", newAdmin3.publicKey.toBase58());
    const tx = await services.setAdmin(
      connection,
      adminAddress,
      [newAdmin3.publicKey],
      defaultAccount,
      programDataAddress
    );
    console.log("Your transaction signature", tx);
    const account = await services.PROGRAM.account.adminData.fetch(adminAddress);
    console.log("Admins: ", account.admin);
  });
});
