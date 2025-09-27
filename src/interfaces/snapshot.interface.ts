import { EditorElement } from "@/types/global.type";

 export interface Snapshot  {
  id: string;
  elements: EditorElement[];
  timestamp: number;
};
