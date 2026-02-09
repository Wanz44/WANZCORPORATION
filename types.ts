
export enum ServiceCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  DESIGN = 'design',
  SYSTEM = 'system'
}

export interface Service {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Template {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  unavailableFeatures: string[];
  isPremium?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
