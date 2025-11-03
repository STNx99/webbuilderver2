"use client";

import { useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { userService } from "@/services/user";
import type { User } from "@/services/user";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  search: (query: string, limit?: number, offset?: number) =>
    [...userKeys.all, "search", query, limit, offset] as const,
  byEmail: (email: string) => [...userKeys.all, "email", email] as const,
  byUsername: (username: string) =>
    [...userKeys.all, "username", username] as const,
};

export function useSearchUsers(
  query: string,
  enabled = true,
  limit = 20,
  offset = 0,
) {
  // Debounce the query to prevent excessive API calls
  const debouncedQuery = useDeferredValue(query);

  return useQuery({
    queryKey: userKeys.search(debouncedQuery, limit, offset),
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const result = await userService.searchUsers(
        debouncedQuery,
        limit,
        offset,
      );
      return result;
    },
    enabled: !!debouncedQuery.trim() && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserByEmail(email: string, enabled = true) {
  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: async () => {
      if (!email) throw new Error("Email is required");
      return await userService.getUserByEmail(email);
    },
    enabled: !!email && enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserByUsername(username: string, enabled = true) {
  return useQuery({
    queryKey: userKeys.byUsername(username),
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      return await userService.getUserByUsername(username);
    },
    enabled: !!username && enabled,
    staleTime: 1000 * 60 * 5,
  });
}
