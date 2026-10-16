export type ServiceProps = {
    params: {
        page: number
        page_size: number
        search?: string
    }
    signal?: AbortSignal
};

export type QueryProps = {
    page: number;
    pageSize: number;
    search?: string;
}