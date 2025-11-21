
export interface ArtStyle {
  id: string;
  name: string;
  promptModifier: string;
  icon?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  hex: string;
  promptModifier: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GenerateOptions {
  prompt: string;
  styleId: string;
  colorId: string;
  referenceImage?: string; // Base64 string
}
