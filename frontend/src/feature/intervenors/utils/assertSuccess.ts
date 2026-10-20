import type { ApiResponse } from "../../../types/services.types";

/** Lanza si el backend respondió `success: false`, para que la mutación falle. */
export function assertSuccess<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response?.success) {
        throw new Error(response?.message);
    }

    return response;
}
