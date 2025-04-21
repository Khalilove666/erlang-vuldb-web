import { defineStore } from "pinia";
import type {
  CreateFalsePositive,
  DeleteFalsePositive,
  FalsePositive,
  FalsePositiveState,
  GetFalsePositives,
  UpdateFalsePositiveStatus,
  UseFalsePositiveReturn,
} from "./types";
import { reactive, toRefs } from "vue";
import { vulDbClient, type VulDbResponse } from "../../clients/vul_db_client";
import { handleAxiosError } from "../useAxiosError";

export const useFalsePositive = defineStore(
  "falsePositive",
  (): UseFalsePositiveReturn => {
    const state = reactive<FalsePositiveState>({
      falsePositives: null,
      loading: false,
    });

    const getFalsePositives: GetFalsePositives = async (candidateWorkId) => {
      try {
        const response = await vulDbClient.get<
          VulDbResponse<Array<FalsePositive>>
        >(`/candidate-works/${candidateWorkId}/false-positives`);
        state.falsePositives = response.data.data;
        return response.data.data;
      } catch (error) {
        handleAxiosError(error);
        return [];
      }
    };

    const createFalsePositive: CreateFalsePositive = async (
      candidateWorkId,
      model
    ) => {
      try {
        const response = await vulDbClient.post<VulDbResponse<FalsePositive>>(
          `/candidate-works/${candidateWorkId}/false-positives`,
          model
        );
        return { success: true, falsePositive: response.data.data };
      } catch (error) {
        return {
          success: false,
          message: handleAxiosError(error),
        };
      }
    };

    const deleteFalsePositive: DeleteFalsePositive = async (id) => {
      try {
        const response = await vulDbClient.delete<VulDbResponse<FalsePositive>>(
          `/false-positives/${id}`
        );
        return { success: true, falsePositive: response.data.data };
      } catch (error) {
        return {
          success: false,
          message: handleAxiosError(error),
        };
      }
    };

    const updateFalsePositiveStatus: UpdateFalsePositiveStatus = async (
      id,
      status
    ) => {
      try {
        const response = await vulDbClient.put<VulDbResponse<FalsePositive>>(
          `/false-positives/${id}/status/${status}`
        );
        return { success: true, falsePositive: response.data.data };
      } catch (error) {
        return {
          success: false,
          message: handleAxiosError(error),
        };
      }
    };

    return {
      deleteFalsePositive,
      updateFalsePositiveStatus,
      getFalsePositives,
      createFalsePositive,
      ...toRefs(state),
    };
  }
);
