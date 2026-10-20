import Icon from "../../../components/ui/Icon";

type PaginationProps = {
    total: number;
    page: number;
    pageSize: number;
    next: string | null;
    previous: string | null;
    onPage: (page: number) => void;
    onSize?: (size: number) => void;
    sizes?: number[];
    label: string;
}

export function Pagination({ 
    total,
    page,
    pageSize,
    next,
    previous,
    onPage,
    onSize,
    sizes,
    label,
}: PaginationProps) {
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, pages);

    const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const to = Math.min(total, current * pageSize);

    const nums = Array.from(
        new Set([1, pages, current - 1, current, current + 1])
    )
        .filter(n => n >= 1 && n <= pages)
        .sort((a, b) => a - b);

    const items: (number | "gap")[] = [];

    nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) {
            items.push("gap");
        }
        items.push(n);
    });

    return (
        <div className="pager">
            <span className="pager-info">
                Mostrando <strong>{from}–{to}</strong> de{" "} 
                <strong>{total}</strong> {label}
            </span>

            <div className="pager-right">
                {sizes && onSize && (
                    <label className="pager-size">
                        Filas{" "}
                        <select 
                            value={pageSize} 
                            onChange={e => onSize(Number(e.target.value))}
                        >
                            {sizes.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

                <div className="pager-nav" role="navigation" aria-label="Paginación">
                    <button 
                        type="button" 
                        className="pager-btn" 
                        disabled={!previous} 
                        onClick={() => onPage(current - 1)}
                        aria-label="Página anterior"
                    >
                        <span className="flip">
                            <Icon name="chevron" size={14}/>
                        </span>
                    </button>

                    {items.map((n, i) => n === "gap" ? (
                        <span className="pager-gap" key={`g${i}`}>…</span>
                    ) : (
                        <button 
                            type="button" 
                            key={n} 
                            className={`pager-btn pager-num ${n === current ? "active" : ""}`} 
                            onClick={() => onPage(n)} 
                            aria-current={n === current ? "page" : undefined}
                        >
                            {n}
                        </button>
                    ))}

                    <span className="pager-mobile">{current} / {pages}</span>

                    <button 
                        type="button" 
                        className="pager-btn" 
                        disabled={!next}
                        onClick={() => onPage(current + 1)} 
                        aria-label="Página siguiente"
                    >
                        <Icon name="chevron" size={14}/>
                    </button>
                </div>
            </div>
        </div>
    )
}