import {
  Calculator,
  Image as GalleryIcon,
  Camera,
  Settings,
  MessageSquare,
  Globe,
  Folder,
  Mic,
  Gamepad2,
  Component,
  Wallpaper,
  type LucideProps
} from 'lucide-react';

import HomeScreen from '@/components/apps/home';
import CalculatorApp from '@/components/apps/calculator';
import GalleryApp from '@/components/apps/gallery';
import CameraApp from '@/components/apps/camera';
import MessagesApp from '@/components/apps/messages';
import SettingsApp from '@/components/apps/settings';
import BrowserApp from '@/components/apps/browser';

export const appIds = ['home', 'calculator', 'gallery', 'camera', 'messages', 'settings', 'browser', 'files', 'voice-memos', 'games'] as const;
export type AppId = (typeof appIds)[number];

type AppComponent = React.ComponentType;

export interface AppConfig {
  id: AppId;
  name: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | React.ComponentType<any>;
  component: AppComponent | null;
  inDock?: boolean;
}

export const apps: AppConfig[] = [
  { id: 'calculator', name: 'Calculator', icon: Calculator, component: CalculatorApp },
  { id: 'gallery', name: 'Gallery', icon: GalleryIcon, component: GalleryApp, inDock: true },
  { id: 'camera', name: 'Camera', icon: Camera, component: CameraApp },
  { id: 'messages', name: 'Messages', icon: MessageSquare, component: MessagesApp, inDock: true },
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsApp },
  { id: 'browser', name: 'Browser', icon: Globe, component: BrowserApp, inDock: true },
  { id: 'files', name: 'Files', icon: Folder, component: null },
  { id: 'voice-memos', name: 'Voice Memos', icon: Mic, component: null },
  { id: 'games', name: 'Games', icon: Gamepad2, component: null },
];

export const appMap: Record<AppId, AppConfig | { component: AppComponent }> = {
  home: { component: HomeScreen },
  ...apps.reduce((acc, app) => ({ ...acc, [app.id]: app }), {} as Record<AppId, AppConfig>)
};

export const wallpapers = [
    { id: '1', name: 'Purple Abstract', url: 'https://placehold.co/390x844/7350C1/FFFFFF', dataAiHint: 'abstract purple' },
    { id: '2', name: 'Orange Geometric', url: 'https://placehold.co/390x844/E5A209/FFFFFF', dataAiHint: 'geometric orange' },
    { id: '3', name: 'Cool Blue', url: 'https://placehold.co/390x844/508ac1/FFFFFF', dataAiHint: 'cool blue' },
    { id: '4', name: 'Dark Space', url: 'https://placehold.co/390x844/1a1a2e/FFFFFF', dataAiHint: 'dark space' },
];

export const galleryImages = [
    { id: '1', url: 'https://placehold.co/600x400/a7c5eb/FFFFFF', dataAiHint: 'mountain landscape' },
    { id: '2', url: 'https://placehold.co/600x400/3c4e6a/FFFFFF', dataAiHint: 'city night' },
    { id: '3', url: 'https://placehold.co/600x400/ffb347/FFFFFF', dataAiHint: 'beach sunset' },
    { id: '4', url: 'https://placehold.co/600x400/4a6e4d/FFFFFF', dataAiHint: 'forest path' },
    { id: '5', url: 'https://placehold.co/600x400/d3a5a5/FFFFFF', dataAiHint: 'desert dunes' },
    { id: '6', url: 'https://placehold.co/600x400/8e9aaf/FFFFFF', dataAiHint: 'aurora sky' },
    { id: '7', url: 'https://placehold.co/600x400/c1946a/FFFFFF', dataAiHint: 'canyon rock' },
    { id: '8', url: 'https://placehold.co/600x400/6b5b95/FFFFFF', dataAiHint: 'lavender field' },
    { id: '9', url: 'https://placehold.co/600x400/f7cac9/FFFFFF', dataAiHint: 'cherry blossom' },
];
