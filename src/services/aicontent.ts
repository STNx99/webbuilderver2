import { GetAIUrl } from "@/lib/utils/geturl";
import { API_ENDPOINTS } from "@/constants/endpoints";
import apiClient from "./apiclient";
import getToken from "./token";

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
            const token = await getToken();
            const url = GetAIUrl(API_ENDPOINTS.AI.GENERATE_CONTENT);
            console.log("AI Content URL:", url);

            return await apiClient.post<GenerateContentResponse>(
                url,
                {
                    prompt: params.prompt,
                    context: params.context,
                    includeImages: params.includeImages,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error("Failed to generate AI content:", error);
            throw error;
        }
    },
};
