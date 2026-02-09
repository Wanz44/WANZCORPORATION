
import { Service, ServiceCategory, Template, PricingPlan } from './types';

export const SERVICES: Service[] = [
  {
    id: 'web-1',
    category: ServiceCategory.WEB,
    title: 'Sites Web Professionnels',
    description: 'Sites vitrine, e-commerce et applications web sur mesure.',
    icon: 'fa-laptop-code',
    features: ['Responsive Design', 'Intégration CMS', 'SEO Optimisé', 'Paiement Sécurisé']
  },
  {
    id: 'mobile-1',
    category: ServiceCategory.MOBILE,
    title: 'Applications Mobiles',
    description: 'iOS et Android natives ou cross-platform.',
    icon: 'fa-mobile-alt',
    features: ['Swift & Kotlin', 'React Native / Flutter', 'UX Intuitive', 'Support Stores']
  },
  {
    id: 'desktop-1',
    category: ServiceCategory.DESKTOP,
    title: 'Logiciels Desktop',
    description: 'Solutions d\'entreprise robustes pour Windows, macOS et Linux.',
    icon: 'fa-desktop',
    features: ['Applications Electron', '.NET & Java', 'Multiplateforme', 'Performance Native']
  },
  {
    id: 'design-1',
    category: ServiceCategory.DESIGN,
    title: 'UI/UX Design',
    description: 'Interfaces modernes centrées sur l\'utilisateur.',
    icon: 'fa-paint-brush',
    features: ['Design Figma/Adobe XD', 'Prototypage', 'Branding', 'Audit UX']
  },
  {
    id: 'system-1',
    category: ServiceCategory.SYSTEM,
    title: 'Systèmes de Gestion',
    description: 'CRM, ERP et gestion de stock en temps réel.',
    icon: 'fa-chart-line',
    features: ['Tableaux de bord', 'Analytiques', 'Cloud Hosting', 'Support 24/7']
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'temp-1',
    title: 'ShopPro',
    category: 'E-commerce',
    price: 149,
    description: 'Solution e-commerce complète avec panier et admin.',
    icon: 'fa-shopping-cart'
  },
  {
    id: 'temp-2',
    title: 'CreativePortfolio',
    category: 'Portfolio',
    price: 79,
    description: 'Pour artistes et freelances avec galerie interactive.',
    icon: 'fa-briefcase'
  },
  {
    id: 'temp-3',
    title: 'BlogMaster',
    category: 'Blog',
    price: 99,
    description: 'Blog avancé avec système de commentaires.',
    icon: 'fa-newspaper'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan-starter',
    name: 'STARTER',
    price: '$299',
    description: 'Présence en ligne basique pour petites structures.',
    features: ['Site web 5 pages', 'Design responsive', 'Hébergement 1 an', 'Contact Form'],
    unavailableFeatures: ['App Mobile', 'Système de gestion']
  },
  {
    id: 'plan-pro',
    name: 'PRO',
    price: '$899',
    description: 'Solution business complète pour entreprises en croissance.',
    features: ['Site 15 pages', 'Nom de domaine', 'App Mobile basique', 'Support 6 mois'],
    unavailableFeatures: ['Logiciel Desktop custom']
  },
  {
    id: 'plan-enterprise',
    name: 'ENTREPRISE',
    price: 'Sur devis',
    description: 'Infrastructure digitale avancée et sur mesure.',
    isPremium: true,
    features: ['App Mobile Native', 'Système temps réel', 'Logiciel Desktop', 'Maintenance 12 mois', 'Support 24/7'],
    unavailableFeatures: []
  }
];
