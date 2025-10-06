use anchor_lang::prelude::*;
use anchor_lang::solana_program::bpf_loader_upgradeable::UpgradeableLoaderState;

use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
#[cfg(not(feature = "mainnet"))]
declare_id!("7amnwad53YNkd1simiDYvhQZ6T6ewYQX21AnMztFEd9Y");

#[program]
pub mod set_admin {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set_admin(ctx: Context<SetAdmin>, new_admins: Vec<Pubkey>) -> Result<()> {
        let admin_data = &mut ctx.accounts.admin_data;
        let current_lamports = admin_data.to_account_info().lamports();

        admin_data.admin.clear();

        let rent = Rent::get()?;
        let required_lamports = rent.minimum_balance(AdminData::size(new_admins.len()));

        if current_lamports < required_lamports {
            let additional_lamports = required_lamports
                - current_lamports;

            // ✅ Use system transfer instead of manual lamport subtraction
            invoke(
                &system_instruction::transfer(
                    &ctx.accounts.user.key(),
                    &admin_data.key(),
                    additional_lamports,
                ),
                &[
                    ctx.accounts.user.to_account_info(),
                    admin_data.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;

            admin_data.admin.reserve(new_admins.len());
        } else {
            let excess_lamports =current_lamports - required_lamports ;

            // ✅ Reverse transfer
            **admin_data.to_account_info().try_borrow_mut_lamports()? -= excess_lamports;
            **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += excess_lamports;

            admin_data.admin.shrink_to(new_admins.len());
        }

        admin_data.admin = new_admins;
        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = AdminData::size(0),
        seeds = [b"admin_data_7"],
        bump,
    )]
    pub admin_data: Account<'info, AdminData>,
    /// CHECK: This is a derived account and its validity is ensured by the program logic.
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(new_admins: Vec<Pubkey>)]
pub struct SetAdmin<'info> {
    #[account(mut,
        seeds = [b"admin_data_7"],
        bump,
        realloc = AdminData::size(new_admins.len()),
        realloc::payer = user,
        realloc::zero = false,
        
    )]
    pub admin_data: Account<'info, AdminData>,
    /// CHECK: This is a derived account and its validity is ensured by the program logic.
    #[account(
        mut,
        constraint = user.key() == get_authority_account(&program_data).unwrap() @ ErrorCode::Unauthorized
    )]
    pub user: Signer<'info>,
    /// CHECK: This is a derived account and its validity is ensured by the program logic.
    pub program_data: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
pub struct AdminData {
    pub admin: Vec<Pubkey>,
}

impl AdminData {
    pub fn size(number_of_admins: usize) -> usize {
        8 + 4 + (32 * number_of_admins)
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Admin data not found")]
    AdminDataNotFound,
    #[msg("Unauthorized: Only admin can perform this actions")]
    Unauthorized,
    #[msg("Invalid Program Data Account")]
    InvalidProgramDataAccount,
}

fn get_authority_account<'info>(program_id: &AccountInfo<'info>) -> Option<Pubkey> {
    let state = UpgradeableLoaderState::try_deserialize(&mut program_id.data.borrow().as_ref()).ok()?;
    match state {
        UpgradeableLoaderState::ProgramData {
            slot: _,
            upgrade_authority_address: Some(authority),
        } => Some(authority),
        UpgradeableLoaderState::ProgramData { slot: _, upgrade_authority_address: None } => None,
        _ => None,
    }

    
}
