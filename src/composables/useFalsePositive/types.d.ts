import type { Ref } from "vue";
import type { FalsePositiveStatus } from "./enums";

export interface FalsePositive {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  reporter_id: string;
  candidate_work_id: number;
  description: string;
  status: FalsePositiveStatus;
  reviewed_by: string;
  reviewed_at: string;
}

export interface FalsePositiveCreateModel {
  description: string;
}

export interface FalsePositiveState {
  falsePositives: Array<FalsePositive> | null;
  loading: boolean;
}

export type GetFalsePositives = (
  candidateWorkId: number
) => Promise<Array<FalsePositive>>;
export type CreateFalsePositive = (
  candidateWorkId: number,
  model: FalsePositiveCreateModel
) => Promise<{
  success: boolean;
  falsePositive?: FalsePositive;
  message?: string;
}>;

export type UpdateFalsePositiveStatus = (
  id: number,
  status: FalsePositiveStatus
) => Promise<{
  success: boolean;
  falsePositive?: FalsePositive;
  message?: string;
}>;

export type DeleteFalsePositive = (id: number) => Promise<{
  success: boolean;
  falsePositive?: FalsePositive;
  message?: string;
}>;

export type UseFalsePositiveReturn = {
  falsePositives: Readonly<Ref<FalsePositiveState["falsePositives"]>>;
  loading: Readonly<Ref<boolean>>;
  getFalsePositives: GetFalsePositives;
  createFalsePositive: CreateFalsePositive;
  deleteFalsePositive: DeleteFalsePositive;
  updateFalsePositiveStatus: UpdateFalsePositiveStatus;
};
