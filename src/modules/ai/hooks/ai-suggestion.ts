import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  generateJsonBody,
  suggestRequestName,
} from "../services";

import {
  JsonBodyGenerationParams,
  RequestSuggestionParams,
} from "../types";

export function useSuggestRequestName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RequestSuggestionParams) =>
      suggestRequestName(params),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["request-suggestions", variables],
        data
      );

      toast.success(
        `Generated ${data.suggestions.length} name suggestions`
      );
    },

    onError: (error) => {
      console.error("Request name generation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate request name suggestions"
      );
    },
  });
}

export function useGenerateJsonBody() {
  return useMutation({
    mutationFn: (params: JsonBodyGenerationParams) =>
      generateJsonBody(params),

    onSuccess: () => {
      toast.success("JSON body generated successfully");
    },

    onError: (error) => {
      console.error("JSON body generation error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate JSON body"
      );
    },
  });
}
