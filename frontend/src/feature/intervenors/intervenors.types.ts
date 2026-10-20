import type { Dispatch, SetStateAction, RefObject } from "react";
import type { MouseEvent } from "react";
import type { PaginatedResponse } from "../../types/services.types";

export type Intervener = { 
    id: number; 
    name: string; 
    code: string; 
    description: string; 
    is_active: boolean; 
    created_at: string; 
    updated_at: string;
    leader: string | null;
    total_users: number;
    pending: number;
    average: string;
    sla: number | null;
    compliance: number | null;
};

export type IntervenerMemberships = {
    id: number;
    user: string;
    intervenor: number;
    is_leader: boolean;
}

export type IntervenerMembershipsResponse = PaginatedResponse<IntervenerMemberships>
export type IntervenerResponse = PaginatedResponse<Intervener>

export type TeamMetrics = { 
    pending: number; 
    average: string; 
    sla: number | null 
};

export type TeamCardsProps = {
    teams: Intervener[];
    selectedId: number | null;
    pickTeam: (id: number) => void;
    metricsFor: (id: number) => TeamMetrics;
    leaderOf: (id: number) => string | null;
    activeCount: (id: number) => number;
};

export type DirectoryUser = { 
    id: number; 
    name: string; 
    email: string; 
    role: string; 
    shift: string 
};

export type Membership = { 
    id: number; 
    userId: number; 
    intervenorId: number; 
    isActive: boolean; 
    isLeader: boolean; 
    createdAt: string 
};

export type DrawerState =
  | null
  | { kind: "team"; editing: boolean }
  | { kind: "member" };

export type MemberStatus = "all" | "active" | "inactive" | "leader";

export type MembershipRow = {
    m: Membership;
    u: DirectoryUser;
};

export type TeamDetailProps = {
    team: Intervener;
    detailRef: RefObject<HTMLElement | null>;

    metricsFor: (id: number) => TeamMetrics;
    leaderOf: (id: number) => string | null;
    activeCount: (id: number) => number;
    teamMembers: (id: number) => Membership[];

    mq: string;
    setMq: Dispatch<SetStateAction<string>>;
    mStatus: MemberStatus;
    setMStatus: Dispatch<SetStateAction<MemberStatus>>;
    setMPage: Dispatch<SetStateAction<number>>;
    setDrawer: Dispatch<SetStateAction<DrawerState>>;

    rows: MembershipRow[];
    pagedRows: MembershipRow[];
    safeMPage: number;
    mSize: number;
    setMSize: Dispatch<SetStateAction<number>>;

    toggleActive: (id: number) => void;
    openMenu: (e: MouseEvent<HTMLButtonElement>, id: number) => void;
};

export type TeamForm = { 
    name: string; 
    code: string; 
    description: string; 
    isActive: boolean 
};

export type IntervenorsSummary = {
    total_intervenors: number;
    active_intervenors: number;
    total_users: number;
    intervenors_without_leader: number;
}

export type IntervenorPayload = {
    name: string;
    code: string;
    description: string;
    is_active?: boolean;
}