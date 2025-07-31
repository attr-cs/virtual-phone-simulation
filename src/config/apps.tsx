
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
    { id: '1', name: 'Purple Abstract', url: 'https://picsum.photos/seed/1/390/844', dataAiHint: 'abstract purple' },
    { id: '2', name: 'Orange Geometric', url: 'https://picsum.photos/seed/2/390/844', dataAiHint: 'geometric orange' },
    { id: '3', name: 'Cool Blue', url: 'https://picsum.photos/seed/3/390/844', dataAiHint: 'cool blue' },
    { id: '4', name: 'Dark Space', url: 'https://picsum.photos/seed/4/390/844', dataAiHint: 'dark space' },
];

export const galleryImages = [
    { id: '1', url: 'https://picsum.photos/seed/101/600/400', dataAiHint: 'mountain landscape' },
    { id: '2', url: 'https://picsum.photos/seed/102/600/400', dataAiHint: 'city night' },
    { id: '3', url: 'https://picsum.photos/seed/103/600/400', dataAiHint: 'beach sunset' },
    { id: '4', url: 'https://picsum.photos/seed/104/600/400', dataAiHint: 'forest path' },
    { id: '5', url: 'https://picsum.photos/seed/105/600/400', dataAiHint: 'desert dunes' },
    { id: '6', url: 'https://picsum.photos/seed/106/600/400', dataAiHint: 'aurora sky' },
    { id: '7', url: 'https://picsum.photos/seed/107/600/400', dataAiHint: 'canyon rock' },
    { id: '8', url: 'https://picsum.photos/seed/108/600/400', dataAiHint: 'lavender field' },
    { id: '9', url: 'https://picsum.photos/seed/109/600/400', dataAiHint: 'cherry blossom' },
];
