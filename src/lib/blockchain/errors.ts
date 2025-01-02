export class BlockchainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockchainError';
  }
}

export class TransactionError extends BlockchainError {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class ContractError extends BlockchainError {
  constructor(message: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export function handleBlockchainError(error: unknown): Error {
  if (error instanceof BlockchainError) {
    return error;
  }
  if (error instanceof Error) {
    return new BlockchainError(error.message);
  }
  return new BlockchainError('An unexpected blockchain error occurred');
}