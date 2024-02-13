export const SHOW_WALLET_ADDRESS = "[WALLET] SHOW";

export function showWalletAddress(options) {
  return {
    type: SHOW_WALLET_ADDRESS,
    options,
  };
}
