// services/UploadService.ts
import http from "@/services/factory"; // your singleton http instance
import type { ApiResponse } from "@/types/common";

export interface ResourceResponse {
  success: boolean;
  url: string;
  fileName: string;
  size: number;
  type: string;
}

class ResourceService {
  private readonly ENDPOINT = "/api/upload";

  /**
   * Upload an image/file (Admin only)
   * @param file The file from <input type="file" />
   * @param accessToken Optional - will be injected automatically on server, required on client
   */
  async uploadFile(file: File, accessToken?: string | null): Promise<ResourceResponse> {
    // Validate client-side (optional but recommended)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await http.call<ResourceResponse>({
      method: "POST",
      url: this.ENDPOINT,
      body: formData,
      accessToken,
    });


    if (!response.body.success) {
      throw new Error("Upload failed");
    }

    return response.body;
  }
}

// Export both ways — consistent with all your services
export const resourceService = new ResourceService();
export default resourceService;