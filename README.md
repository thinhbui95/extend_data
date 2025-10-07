# set_admin

A Solana program built with Anchor that manages admin data with the ability to extend accounts with additional u128 values.

## Features

- Initialize admin data account
- Set admin manually with a list of Pubkeys
- Extend account data with additional u128 values
- Automatic account reallocation for dynamic data storage

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/)
- [Rust](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd set_admin
```

2. Install dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

## Usage

### Program Structure

The program consists of three main instructions:

1. **Initialize**: Creates the admin data account
2. **Set Admin**: Manually sets the list of admin Pubkeys
3. **Extend Account**: Adds additional u128 values to the account data

### Account Structure

```rust
#[account]
pub struct AdminData {
    pub admin: Vec<Pubkey>,  // List of admin public keys
    // Additional u128 data is stored after the structured data
}
```

### Client Usage

```typescript
import { Program } from "@coral-xyz/anchor";
import { SetAdmin } from "./target/types/set_admin";

// Initialize program
const program = new Program(idl, provider);

// Initialize admin data
await program.methods
    .initialize()
    .accounts({
        adminData: adminDataPda,
        user: wallet.publicKey,
        programData: programDataAddress,
        systemProgram: SystemProgram.programId,
    })
    .rpc();

// Set admin manually
await program.methods
    .setAdminManual([pubkey1, pubkey2, pubkey3])
    .accounts({
        adminData: adminDataPda,
        user: wallet.publicKey,
        programData: programDataAddress,
        systemProgram: SystemProgram.programId,
    })
    .rpc();

// Extend account with additional data
await program.methods
    .extendAccount([123n, 456n, 789n]) // u128 values as BigInt
    .accounts({
        adminData: adminDataPda,
        user: wallet.publicKey,
        programData: programDataAddress,
        systemProgram: SystemProgram.programId,
    })
    .rpc();
```

## Testing

Run the test suite:

```bash
anchor test
```

The tests cover:
- Program initialization
- Setting admin data
- Extending account data with additional u128 values
- Multiple extend operations

## Building and Deployment

### Build the program:
```bash
anchor build
```

### Deploy to localnet:
```bash
anchor deploy
```

### Deploy to devnet/mainnet:
```bash
anchor deploy --provider.cluster devnet
```

## Project Structure

```
set_admin/
├── programs/
│   └── set_admin/
│       └── src/
│           └── lib.rs          # Main program logic
├── tests/
│   └── set_admin.spec.ts       # Test suite
├── services/
│   └── utils.ts                # Client utilities
├── app/
│   └── src/                    # Frontend (if applicable)
├── Anchor.toml                 # Anchor configuration
├── package.json                # Node.js dependencies
└── README.md                   # This file
```

## API Reference

### Instructions

#### `initialize()`
Creates the initial admin data account.

#### `set_admin_manual(new_admins: Vec<Pubkey>)`
Sets the admin list to the provided Pubkeys.

#### `extend_account(additional_datas: Vec<u128>)`
Appends additional u128 values to the account data.

### Accounts

#### `AdminData`
- `admin: Vec<Pubkey>` - List of admin public keys
- Additional u128 data stored after the structured data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on the GitHub repository.
