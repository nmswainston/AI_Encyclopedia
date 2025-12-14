export interface ScriptMetadata {
  title: string;
  tags: string[];
  level: string;
  minutes: number;
  date: string;
  summary: string;
}

export interface Script extends ScriptMetadata {
  slug: string;
  content: string;
}

