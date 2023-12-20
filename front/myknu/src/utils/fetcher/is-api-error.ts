import {ApiError} from './api-error.interface';

export function isApiError(value: unknown): value is ApiError {
    if (typeof value !== 'object' || !value) {
        return false;
    }

    const error = value as Record<string, unknown>;

    if (
        typeof error.statusCode !== 'number' ||
        typeof error.message !== 'string'
    ) {
        return false;
    }

    return true;
}
