import { GetAIUrl } from "@/lib/utils/geturl";
import { API_ENDPOINTS } from "@/constants/endpoints";
import apiClient from "./apiclient";

interface GenerateContentParams {
    prompt: string;
    context?: string;
    includeImages?: boolean;
}

interface GenerateContentResponse {
    content?: string;
    html?: string;
}

export const aiContentService = {
    async generateContent(params: GenerateContentParams): Promise<GenerateContentResponse> {
        try {
            const url = GetAIUrl(API_ENDPOINTS.AI.GENERATE_CONTENT);
            console.log("AI Content URL:", url);

            return await apiClient.post<GenerateContentResponse>(url, params);
        } catch (error) {
            console.error("Failed to generate AI content:", error);
            throw error;
        }
    },
};
