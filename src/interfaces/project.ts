export interface Project {
  id?: string;
  name: string;
  description?: string;
  subdomain?: string;
  published?: boolean;
  styles: React.CSSProperties;
}
