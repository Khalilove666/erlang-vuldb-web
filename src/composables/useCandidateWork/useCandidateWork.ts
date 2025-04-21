import { defineStore } from "pinia";
import type {
  CandidateWork,
  CandidateWorksResponse,
  CandidateWorkState,
  CreateCandidateWork,
  GetCandidateWorkDetails,
  GetCandidateWorks,
  UseCandidateWorkReturn,
} from "./types";
import { reactive, toRefs } from "vue";
import {
  vulDbClient,
  type VulDbResponse,
} from "../../clients/vul_db_client.ts";
import { handleAxiosError } from "../useAxiosError.ts";

export const useCandidateWork = defineStore(
  "candidateWork",
  (): UseCandidateWorkReturn => {
    const state = reactive<CandidateWorkState>({
      candidateWorks: null,
      loading: false,
    });

    const getCandidateWorks: GetCandidateWorks = async (params = {}) => {
      try {
        const response = await vulDbClient.get<
          VulDbResponse<CandidateWorksResponse>
        >("/candidate-works", {
          params,
        });
        state.candidateWorks = response.data.data.works;
        return response.data.data;
      } catch (error) {
        handleAxiosError(error);
        return null;
      }
    };

    const getCandidateWorkDetails: GetCandidateWorkDetails = async (id) => {
      try {
        const response = await vulDbClient.get<VulDbResponse<CandidateWork>>(
          "/candidate-works/" + id
        );
        return response.data.data;
      } catch (error) {
        handleAxiosError(error);
        return null;
      }
    };

    const createCandidateWork: CreateCandidateWork = async (model) => {
      try {
        const response = await vulDbClient.post<VulDbResponse<CandidateWork>>(
          "/candidate-works",
          model
        );
        return { success: true, work: response.data.data };
      } catch (error) {
        handleAxiosError(error);
        return { success: false, message: handleAxiosError(error) };
      }
    };

    return {
      getCandidateWorks,
      getCandidateWorkDetails,
      createCandidateWork,
      ...toRefs(state),
    };
  }
);
