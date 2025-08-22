export interface Page {
  id: string;
  name: string;
  type: "sp" | "dp";
  styles: React.CSSProperties;
  projectId: string;
  createdAt: Date; // Use Date if you always parse it
  updatedAt: Date;
  deletedAt?: Date | null;
}
