import { ArtStyle, ColorTheme } from './types';

export const ART_STYLES: ArtStyle[] = [
  { id: 'none', name: '默认 (Default)', promptModifier: 'highly detailed, masterpiece' },
  { id: 'cartoon', name: '卡通 (Cartoon)', promptModifier: 'cartoon style, vibrant, cel shaded, 2d animation' },
  { id: 'realistic', name: '写实 (Realistic)', promptModifier: 'photorealistic, 8k, cinematic lighting, extremely detailed' },
  { id: 'abstract', name: '抽象 (Abstract)', promptModifier: 'abstract art, geometric shapes, surrealism, imaginative' },
  { id: 'cyberpunk', name: '赛博朋克 (Cyberpunk)', promptModifier: 'cyberpunk, neon lights, futuristic, high tech, dark atmosphere' },
  { id: 'watercolor', name: '水彩 (Watercolor)', promptModifier: 'watercolor painting, soft edges, artistic, wet on wet' },
  { id: 'oil', name: '油画 (Oil Painting)', promptModifier: 'oil painting, textured brushstrokes, classical art style' },
  { id: 'pixel', name: '像素 (Pixel Art)', promptModifier: 'pixel art, 16-bit, retro game style' },
  { id: '3d', name: '3D 渲染 (3D Render)', promptModifier: '3d render, unreal engine 5, cgi, ray tracing' },
  { id: 'sketch', name: '素描 (Sketch)', promptModifier: 'pencil sketch, charcoal drawing, black and white, rough lines' },
];

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'none', name: '自动', hex: '#94a3b8', promptModifier: '' },
  { id: 'warm', name: '暖色调', hex: '#f59e0b', promptModifier: 'warm color palette, orange and gold tones, sunny' },
  { id: 'cool', name: '冷色调', hex: '#3b82f6', promptModifier: 'cool color palette, blue and teal tones, calm' },
  { id: 'pastel', name: '粉嫩', hex: '#f472b6', promptModifier: 'pastel colors, soft pinks and purples, dreamy' },
  { id: 'neon', name: '霓虹', hex: '#a855f7', promptModifier: 'neon colors, glowing, vibrant, high contrast' },
  { id: 'bw', name: '黑白', hex: '#1e293b', promptModifier: 'black and white, monochrome, noir' },
  { id: 'vintage', name: '复古', hex: '#d97706', promptModifier: 'vintage colors, sepia tone, retro aesthetic' },
  { id: 'nature', name: '自然', hex: '#22c55e', promptModifier: 'earthy tones, green and brown, natural colors' },
];
