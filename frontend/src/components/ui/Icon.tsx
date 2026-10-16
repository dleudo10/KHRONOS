import type { ReactNode } from "react";

export type IconName =
    | "grid" 
    | "bed" 
    | "check" 
    | "bell" 
    | "flow" 
    | "users" 
    | "building"
    | "chart" 
    | "history" 
    | "settings" 
    | "search" 
    | "calendar" 
    | "arrow"
    | "clock" 
    | "alert" 
    | "spark" 
    | "more" 
    | "filter" 
    | "plus" 
    | "play"
    | "pause" 
    | "chevron" 
    | "menu" 
    | "close" 
    | "logout" 
    | "layers" 
    | "eye"
;


const Icon = ({ name, size = 18 }: { name: IconName; size?: number }) => {
    const paths: Record<IconName, ReactNode> = {
        grid: <>
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
        </>,
        bed: <>
            <path d="M3 19v-8m18 8v-5a3 3 0 0 0-3-3H9v8m-6-3h18"/>
            <path d="M9 11V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/>
        </>,
        check: <path d="m5 12 4 4L19 6"/>,
        bell: <>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
            <path d="M10 21h4"/>
        </>,
        flow: <>
            <rect x="4" y="3" width="6" height="5" rx="1"/>
            <rect x="14" y="16" width="6" height="5" rx="1"/>
            <path d="M7 8v4h10v4m-10-4v4"/>
        </>,
        users: <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </>,
        building: <>
            <path d="M3 21h18M6 21V3h12v18M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2"/>
        </>,
        chart: <>
            <path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>
        </>,
        history: <>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
            <path d="M3 3v5h5m4-2v6l4 2"/>
        </>,
        settings: <>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9v-.1A1.7 1.7 0 0 0 7.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.2 15a1.7 1.7 0 0 0-1.2-1H2V10h.1a1.7 1.7 0 0 0 1.1-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 7.6 4a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 9 2.1V2h4v.1A1.7 1.7 0 0 0 14.4 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 20.8 9a1.7 1.7 0 0 0 1.2 1h.1v4H22a1.7 1.7 0 0 0-2.6 1Z"/>
        </>,
        search: <>
            <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>
        </>,
        calendar: <>
            <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>
        </>,
        arrow: <>
            <path d="M5 12h14m-5-5 5 5-5 5"/>
        </>,
        clock: <>
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
        </>,
        alert: <>
            <path d="M10.3 3.5 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.5a2 2 0 0 0-3.4 0Z"/>
            <path d="M12 9v4m0 4h.01"/>
        </>,
        spark: <path d="m12 3 1.4 4.2L18 9l-4.6 1.8L12 15l-1.4-4.2L6 9l4.6-1.8L12 3Zm6 12 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z"/>,
        more: <>
            <circle cx="5" cy="12" r="1"/>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
        </>,
        filter: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>,
        plus: <path d="M12 5v14M5 12h14"/>,
        play: <path d="m8 5 11 7-11 7V5Z"/>,
        pause: <path d="M9 5v14m6-14v14"/>,
        chevron: <path d="m9 18 6-6-6-6"/>,
        menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
        close: <path d="m6 6 12 12M18 6 6 18"/>,
        logout: <>
            <path d="M10 17l5-5-5-5m5 5H3"/>
            <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/>
        </>,
        layers: <>
            <path d="m12 2 9 5-9 5-9-5 9-5Z"/>
            <path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>
        </>,
        eye: <>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/>
            <circle cx="12" cy="12" r="3"/>
        </>,
    };
    
    return  (
        <>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
            >
                {paths[name]}
            </svg>
        </>
    )
}

export default Icon