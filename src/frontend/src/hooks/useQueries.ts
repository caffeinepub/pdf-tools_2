import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HistoryEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useToolUsage() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["toolUsage"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getToolUsage();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<HistoryEntry[]>({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementToolUsage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (toolName: string) => {
      if (!actor) return;
      await actor.incrementToolUsage(toolName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["toolUsage"] });
    },
  });
}

export function useAddHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      toolName,
      originalFile,
      resultFile,
    }: {
      toolName: string;
      originalFile: string;
      resultFile: string;
    }) => {
      if (!actor) return;
      await actor.addHistoryEntry(toolName, originalFile, resultFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
