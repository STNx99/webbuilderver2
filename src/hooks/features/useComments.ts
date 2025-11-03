"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/comment";
import {
  Comment,
  CommentFilter,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateReactionRequest,
} from "@/interfaces/comment.interface";
import { toast } from "sonner";

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (filters?: CommentFilter) => [...commentKeys.lists(), { filters }] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  byItem: (itemId: string) => [...commentKeys.all, "byItem", itemId] as const,
  count: (itemId: string) => [...commentKeys.all, "count", itemId] as const,
  reactions: (commentId: string) => [...commentKeys.all, "reactions", commentId] as const,
  reactionSummary: (commentId: string) => [...commentKeys.all, "reactionSummary", commentId] as const,
};

// Get comments with filters
export function useComments(filter?: CommentFilter) {
  return useQuery({
    queryKey: commentKeys.list(filter),
    queryFn: () => commentService.getComments(filter),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get single comment by ID
export function useComment(commentId: string) {
  return useQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => commentService.getCommentById(commentId),
    enabled: !!commentId,
  });
}

// Get comments by marketplace item ID
export function useCommentsByItem(itemId: string, filter?: Omit<CommentFilter, 'itemId'>) {
  return useQuery({
    queryKey: commentKeys.byItem(itemId),
    queryFn: () => commentService.getCommentsByItemId(itemId, filter),
    enabled: !!itemId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get comment count for an item
export function useCommentCount(itemId: string) {
  return useQuery({
    queryKey: commentKeys.count(itemId),
    queryFn: () => commentService.getCommentCount(itemId),
    enabled: !!itemId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create comment
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.createComment(data),
    onSuccess: (newComment) => {
      // Invalidate comments list for the item
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.byItem(newComment.itemId) 
      });
      // Invalidate comment count
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.count(newComment.itemId) 
      });
      toast.success("Comment posted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to post comment: ${error.message}`);
    },
  });
}

// Update comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentRequest }) =>
      commentService.updateComment(commentId, data),
    onSuccess: (updatedComment) => {
      // Update the specific comment
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      // Invalidate the item's comments list
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.byItem(updatedComment.itemId) 
      });
      toast.success("Comment updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update comment: ${error.message}`);
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Remove the comment from cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
      // Invalidate all comment lists
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      // Invalidate all counts
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      toast.success("Comment deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete comment: ${error.message}`);
    },
  });
}

// Create reaction
export function useCreateReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: CreateReactionRequest }) =>
      commentService.createReaction(commentId, data),
    onSuccess: (_, { commentId }) => {
      // Invalidate reactions and reaction summary
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.reactions(commentId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.reactionSummary(commentId) 
      });
      // Invalidate comment to refresh reaction count
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.detail(commentId) 
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add reaction: ${error.message}`);
    },
  });
}

// Delete reaction
export function useDeleteReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, reactionType }: { commentId: string; reactionType: string }) =>
      commentService.deleteReaction(commentId, reactionType),
    onSuccess: (_, { commentId }) => {
      // Invalidate reactions and reaction summary
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.reactions(commentId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.reactionSummary(commentId) 
      });
      // Invalidate comment to refresh reaction count
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.detail(commentId) 
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove reaction: ${error.message}`);
    },
  });
}

// Get reactions for a comment
export function useReactions(commentId: string) {
  return useQuery({
    queryKey: commentKeys.reactions(commentId),
    queryFn: () => commentService.getReactions(commentId),
    enabled: !!commentId,
  });
}

// Get reaction summary for a comment
export function useReactionSummary(commentId: string) {
  return useQuery({
    queryKey: commentKeys.reactionSummary(commentId),
    queryFn: () => commentService.getReactionSummary(commentId),
    enabled: !!commentId,
  });
}
