import { AxiosError } from "axios";

export function handleAxiosError(error: unknown): string {
  console.error(error);
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ data: string }>;
    if (axiosError.response) return axiosError.response.data.data;
  }
  return "Something went wrong!";
}
