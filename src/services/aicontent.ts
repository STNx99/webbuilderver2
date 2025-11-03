import ApiClient from './apiclient';

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
        return await ApiClient.post<GenerateContentResponse>(
            'http://localhost:3001/api/ai/generate-content',
            {
                prompt: params.prompt,
                context: params.context,
                includeImages: params.includeImages,
            }
        );
    },
};
