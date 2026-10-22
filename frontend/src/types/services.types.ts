export type ServiceProps = {
    params?: {
        page?: number
        page_size?: number
        search?: string | undefined
        is_active?: boolean
    }
    signal?: AbortSignal
};

export type QueryProps = {
    page: number;
    pageSize: number;
    search?: string;
    isActive?: boolean;
}

export type ApiResponse<T> =
  | {
      success: true;
      message: string;
      data: T;
      errors: null;
    }
  | {
      success: false;
      message: string;
      data: null;
      errors: object[];
    };

export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};