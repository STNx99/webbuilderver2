import GetUrl from "@/lib/utils/geturl";
import {
  Comment,
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateReactionRequest,
  CommentReaction,
  ReactionSummary,
  CommentFilter,
} from "@/interfaces/comment.interface";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";

interface ICommentService {
  // Comment operations
  createComment: (data: CreateCommentRequest) => Promise<Comment>;
  getComments: (filter?: CommentFilter) => Promise<CommentResponse>;
  getCommentById: (commentId: string) => Promise<Comment>;
  getCommentsByItemId: (itemId: string, filter?: Omit<CommentFilter, 'itemId'>) => Promise<CommentResponse>;
  updateComment: (commentId: string, data: UpdateCommentRequest) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<boolean>;
  moderateComment: (commentId: string, status: string) => Promise<{ message: string; status: string }>;
  getCommentCount: (itemId: string) => Promise<{ itemId: string; count: number }>;

  // Reaction operations
  createReaction: (commentId: string, data: CreateReactionRequest) => Promise<CommentReaction>;
  deleteReaction: (commentId: string, reactionType: string) => Promise<boolean>;
  getReactions: (commentId: string) => Promise<CommentReaction[]>;
  getReactionSummary: (commentId: string) => Promise<ReactionSummary[]>;
}

export const commentService: ICommentService = {
  // Comment operations
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    return apiClient.post<Comment>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.CREATE),
      data,
    );
  },

  getComments: async (filter?: CommentFilter): Promise<CommentResponse> => {
    const queryParams = new URLSearchParams();
    if (filter) {
      if (filter.itemId) queryParams.append("itemId", filter.itemId);
      if (filter.authorId) queryParams.append("authorId", filter.authorId);
      if (filter.status) queryParams.append("status", filter.status);
      if (filter.parentId !== undefined) {
        queryParams.append("parentId", filter.parentId || "");
      }
      if (filter.topLevel) queryParams.append("topLevel", "true");
      if (filter.limit) queryParams.append("limit", String(filter.limit));
      if (filter.offset) queryParams.append("offset", String(filter.offset));
      if (filter.sortBy) queryParams.append("sortBy", filter.sortBy);
      if (filter.sortOrder) queryParams.append("sortOrder", filter.sortOrder);
    }

    const url = queryParams.toString()
      ? `${GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_ALL)}?${queryParams.toString()}`
      : GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_ALL);

    return apiClient.get<CommentResponse>(url);
  },

  getCommentById: async (commentId: string): Promise<Comment> => {
    return apiClient.get<Comment>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_BY_ID(commentId)),
    );
  },

  getCommentsByItemId: async (
    itemId: string,
    filter?: Omit<CommentFilter, 'itemId'>
  ): Promise<CommentResponse> => {
    const queryParams = new URLSearchParams();
    if (filter) {
      if (filter.status) queryParams.append("status", filter.status);
      if (filter.limit) queryParams.append("limit", String(filter.limit));
      if (filter.offset) queryParams.append("offset", String(filter.offset));
      if (filter.sortBy) queryParams.append("sortBy", filter.sortBy);
      if (filter.sortOrder) queryParams.append("sortOrder", filter.sortOrder);
    }

    const url = queryParams.toString()
      ? `${GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_BY_ITEM(itemId))}?${queryParams.toString()}`
      : GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_BY_ITEM(itemId));

    return apiClient.get<CommentResponse>(url);
  },

  updateComment: async (
    commentId: string,
    data: UpdateCommentRequest,
  ): Promise<Comment> => {
    return apiClient.patch<Comment>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.UPDATE(commentId)),
      data,
    );
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    return apiClient.delete(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.DELETE(commentId)),
    );
  },

  moderateComment: async (
    commentId: string,
    status: string,
  ): Promise<{ message: string; status: string }> => {
    return apiClient.post<{ message: string; status: string }>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.MODERATE(commentId)),
      { status },
    );
  },

  getCommentCount: async (
    itemId: string,
  ): Promise<{ itemId: string; count: number }> => {
    return apiClient.get<{ itemId: string; count: number }>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_COUNT(itemId)),
    );
  },

  // Reaction operations
  createReaction: async (
    commentId: string,
    data: CreateReactionRequest,
  ): Promise<CommentReaction> => {
    return apiClient.post<CommentReaction>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.CREATE_REACTION(commentId)),
      data,
    );
  },

  deleteReaction: async (
    commentId: string,
    reactionType: string,
  ): Promise<boolean> => {
    return apiClient.delete(
      `${GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.DELETE_REACTION(commentId))}?type=${reactionType}`,
    );
  },

  getReactions: async (commentId: string): Promise<CommentReaction[]> => {
    return apiClient.get<CommentReaction[]>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_REACTIONS(commentId)),
    );
  },

  getReactionSummary: async (commentId: string): Promise<ReactionSummary[]> => {
    return apiClient.get<ReactionSummary[]>(
      GetUrl(API_ENDPOINTS.MARKETPLACE.COMMENTS.GET_REACTION_SUMMARY(commentId)),
    );
  },
};
