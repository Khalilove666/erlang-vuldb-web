import type { Ref } from "vue";

export interface LibraryVersion {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  version_name: string;
  library_id: number;
  library?: Library;
}

export interface Library {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  source: string;
  description: string;
  library_versions: Array<LibraryVersion>;
}

export interface LibraryCreateModel {
  name: string;
  source: string;
  description: string;
}
export interface LibraryVersionCreateModel {
  version_name: string;
}

export interface LibraryState {
  libraries: Array<Library> | null;
  loading: boolean;
}

export type GetLibraries = () => Promise<Array<Library>>;
export type CreateLibrary = (
  model: LibraryCreateModel
) => Promise<{ success: boolean; library?: Library; message?: string }>;

export type CreateLibraryVersion = (
  libraryId: number,
  model: LibraryVersionCreateModel
) => Promise<{
  success: boolean;
  libraryVersion?: LibraryVersion;
  message?: string;
}>;

export type DeleteLibrary = (
  libraryId: number
) => Promise<{ success: boolean; library?: Library; message?: string }>;

export type UseLibraryReturn = {
  libraries: Readonly<Ref<LibraryState["libraries"]>>;
  loading: Readonly<Ref<boolean>>;
  getLibraries: GetLibraries;
  createLibrary: CreateLibrary;
  createLibraryVersion: CreateLibraryVersion;
  deleteLibrary: DeleteLibrary;
};
