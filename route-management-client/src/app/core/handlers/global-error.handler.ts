import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));

    console.error('[GlobalErrorHandler] Unhandled error:', err);

    if (err.stack) {
      console.error(err.stack);
    }
  }
}