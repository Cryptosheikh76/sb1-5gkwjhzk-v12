export class FeeCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeeCalculationError';
  }
}

export function handleFeeError(error: unknown): string {
  if (error instanceof FeeCalculationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to process fee calculation';
}