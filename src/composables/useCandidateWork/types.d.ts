import type { Ref } from "vue";
import type { LibraryVersion } from "../useLibrary/types";
import type { UserRole } from "./enums";

export interface CandidateWork {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type: string;
  file: string;
  position_range: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
  code_snippet: string;
  start_line: number;
  end_line: number;
  vulnerable_mfa: string;
  vulnerable_fun: string;
  severity: string;
  complexity: string;
  cwe_ids: Array<number> | null;
  reporter_id: string;
  reporter_role: string;
  library_version_id: number;
  library_version: LibraryVersion;
  library_versions: Array<LibraryVersion>;
  false_positive_id: number | null;
}

export interface CandidateWorkState {
  candidateWorks: Array<CandidateWork> | null;
  loading: boolean;
}

export interface CandidateWorkFilters {
  library_id?: number;
  type?: string;
  severity?: CandidateWorkSeverity;
  page_size?: number;
  current_page?: number;
  reporter?: UserRole;
}

export interface CandidateWorksResponse {
  works: Array<CandidateWork>;
  total: number;
  current_page: number;
  page_size: number;
}

export interface CreateCandidateWorkModel {
  type: string;
  file: string;
  position_range: {
    start: {
      line: number;
      column: number;
    };
    end: {
      line: number;
      column: number;
    };
  };
  code_snippet: string;
  start_line: number;
  end_line: number;
  vulnerable_mfa: string;
  vulnerable_fun: string;
  severity: string;
  complexity: string;
  cwe_ids: Array<number>;
  library_version_id: number;
}

export type GetCandidateWorks = (
  params?: CandidateWorkFilters
) => Promise<CandidateWorksResponse | null>;

export type GetCandidateWorkDetails = (
  id: number
) => Promise<CandidateWork | null>;

export type CreateCandidateWork = (
  model: CreateCandidateWorkModel
) => Promise<{ success: boolean; work?: CandidateWork; message?: string }>;

export type UseCandidateWorkReturn = {
  candidateWorks: Readonly<Ref<CandidateWorkState["candidateWorks"]>>;
  loading: Readonly<Ref<boolean>>;
  getCandidateWorks: GetCandidateWorks;
  getCandidateWorkDetails: GetCandidateWorkDetails;
  createCandidateWork: CreateCandidateWork;
};
