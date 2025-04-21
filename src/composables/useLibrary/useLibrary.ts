import { defineStore } from "pinia";
import type {
  CreateLibrary,
  CreateLibraryVersion,
  DeleteLibrary,
  GetLibraries,
  Library,
  LibraryState,
  LibraryVersion,
  UseLibraryReturn,
} from "./types";
import { reactive, toRefs } from "vue";
import {
  vulDbClient,
  type VulDbResponse,
} from "../../clients/vul_db_client.ts";
import { handleAxiosError } from "../useAxiosError.ts";

export const useLibrary = defineStore("library", (): UseLibraryReturn => {
  const state = reactive<LibraryState>({
    libraries: null,
    loading: false,
  });

  const getLibraries: GetLibraries = async () => {
    try {
      const response = await vulDbClient.get<VulDbResponse<Array<Library>>>(
        "/libraries"
      );
      state.libraries = response.data.data;
      return response.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const createLibrary: CreateLibrary = async (model) => {
    try {
      const response = await vulDbClient.post<VulDbResponse<Library>>(
        "/libraries",
        model
      );
      return { success: true, library: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: handleAxiosError(error),
      };
    }
  };

  const createLibraryVersion: CreateLibraryVersion = async (
    libraryId: number,
    model
  ) => {
    try {
      const response = await vulDbClient.post<VulDbResponse<LibraryVersion>>(
        `/libraries/${libraryId}/versions`,
        model
      );
      return { success: true, library: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: handleAxiosError(error),
      };
    }
  };

  const deleteLibrary: DeleteLibrary = async (libraryId: number) => {
    try {
      const response = await vulDbClient.delete<VulDbResponse<Library>>(
        `/libraries/${libraryId}`
      );
      return { success: true, library: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: handleAxiosError(error),
      };
    }
  };

  getLibraries();

  return {
    getLibraries,
    createLibrary,
    createLibraryVersion,
    deleteLibrary,
    ...toRefs(state),
  };
});
