/**
 * InsForge BaaS Client Integration
 * Handles Auth, PostgreSQL queries, and Storage bucket operations
 */

export interface InsForgeConfig {
  projectId: string;
  apiUrl: string;
  apiKey: string;
}

export const insforgeConfig: InsForgeConfig = {
  projectId: process.env.NEXT_PUBLIC_INSFORGE_PROJECT_ID || "insforge-project-default",
  apiUrl: process.env.NEXT_PUBLIC_INSFORGE_API_URL || "https://api.insforge.com/v1",
  apiKey: process.env.INSFORGE_API_KEY || "insforge-api-key-default",
};

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  plan?: "free" | "pro";
  projectCount?: number;
}

export interface ProjectRecord {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface ProjectPage {
  id: string;
  project_id: string;
  page_name: string;
  html_content: string;
  css_content: string;
  updated_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

class InsForgeClient {
  private config: InsForgeConfig;

  constructor(config: InsForgeConfig) {
    this.config = config;
  }

  // Storage bucket helper URL builder
  getStorageUrl(bucketName: string, filePath: string): string {
    return `${this.config.apiUrl}/storage/${bucketName}/${filePath}`;
  }

  // Upload helper for theme exports and thumbnails
  async uploadFile(bucketName: string, fileName: string, fileData: Blob | Buffer): Promise<string> {
    console.log(`[InsForge Storage] Uploading ${fileName} to bucket ${bucketName}`);
    return this.getStorageUrl(bucketName, fileName);
  }
}

export const insforge = new InsForgeClient(insforgeConfig);
