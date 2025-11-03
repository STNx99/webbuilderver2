import GetUrl from "@/lib/utils/geturl";
import { Image, ImageUploadResponse } from "@/interfaces/image.interface";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import getToken from "./token";

interface IImageService {
  uploadImage: (file: File, imageName?: string) => Promise<ImageUploadResponse>;
  uploadBase64Image: (
    base64: string,
    imageName?: string,
  ) => Promise<ImageUploadResponse>;
  getUserImages: () => Promise<Image[]>;
  getImageByID: (id: string) => Promise<Image>;
  deleteImage: (id: string) => Promise<boolean>;
}

export const imageService: IImageService = {
  uploadImage: async (
    file: File,
    imageName?: string,
  ): Promise<ImageUploadResponse> => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("image", file);
    if (imageName) formData.append("imageName", imageName);

    const response = await fetch(GetUrl(API_ENDPOINTS.IMAGES.UPLOAD), {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.status}`);
    }

    return response.json();
  },

  uploadBase64Image: async (
    base64: string,
    imageName?: string,
  ): Promise<ImageUploadResponse> => {
    const data = { base64, imageName };
    return apiClient.post<ImageUploadResponse>(
      GetUrl(API_ENDPOINTS.IMAGES.UPLOAD_BASE64),
      data,
    );
  },

  getUserImages: async (): Promise<Image[]> => {
    return apiClient.get<Image[]>(GetUrl(API_ENDPOINTS.IMAGES.GET_USER));
  },

  getImageByID: async (id: string): Promise<Image> => {
    return apiClient.get<Image>(GetUrl(API_ENDPOINTS.IMAGES.GET_BY_ID(id)));
  },

  deleteImage: async (id: string): Promise<boolean> => {
    return apiClient.delete(GetUrl(API_ENDPOINTS.IMAGES.DELETE(id)));
  },
};
