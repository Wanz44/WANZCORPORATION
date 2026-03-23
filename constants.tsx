
import { Service, ServiceCategory, Template, PricingPlan } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Applications Web Ultra-Performantes',
    description: 'Des plateformes robustes bâties avec React, Next.js et Node.js pour une expérience utilisateur fluide et rapide.',
    icon: 'fa-globe',
    features: ['SEO Optimisé', 'Architecture Microservices', 'PWA Ready'],
    category: ServiceCategory.WEB
  },
  {
    id: '2',
    title: 'Intelligence Artificielle Sur Mesure',
    description: 'Intégrez des LLMs et des algorithmes de Machine Learning pour automatiser vos processus et prédire vos besoins.',
    icon: 'fa-brain',
    features: ['Chatbots Intelligents', 'Analyse Prédictive', 'Vision par Ordinateur'],
    category: ServiceCategory.AI
  },
  {
    id: '3',
    title: 'Design Système & UI/UX',
    description: 'Une identité visuelle forte et des interfaces intuitives qui convertissent vos visiteurs en clients fidèles.',
    icon: 'fa-palette',
    features: ['Prototypage Haute Fidélité', 'Design Atomique', 'Accessibilité'],
    category: ServiceCategory.DESIGN
  },
  {
    id: '4',
    title: 'Infrastructure Cloud & Sécurité',
    description: 'Déploiement scalable sur AWS/GCP avec une sécurité de niveau bancaire pour protéger vos données.',
    icon: 'fa-shield-alt',
    features: ['Auto-scaling', 'Audit de Sécurité', 'CI/CD Pipeline'],
    category: ServiceCategory.CLOUD
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 't1',
    title: 'SaaS Dashboard Pro',
    description: 'Une interface complète pour gérer vos utilisateurs, abonnements et analytics.',
    price: 149,
    category: 'Dashboard',
    icon: 'fa-chart-line'
  },
  {
    id: 't2',
    title: 'E-commerce Ultra-Fast',
    description: 'Boutique en ligne optimisée pour la conversion avec panier et paiement intégrés.',
    price: 199,
    category: 'E-commerce',
    icon: 'fa-shopping-bag'
  },
  {
    id: 't3',
    title: 'Portfolio Créatif',
    description: 'Mettez en valeur vos projets avec des animations fluides et un design minimaliste.',
    price: 79,
    category: 'Portfolio',
    icon: 'fa-image'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'p1',
    name: 'Pack Starter',
    price: '$990',
    description: 'Idéal pour les startups et les projets MVP.',
    features: ['Site Web Vitrine', 'Hébergement 1 an', 'Support Standard'],
    unavailableFeatures: ['IA Intégrée', 'Application Mobile', 'Maintenance 24/7']
  },
  {
    id: 'p2',
    name: 'Pack Business',
    price: '$2,490',
    description: 'La solution complète pour les PME en croissance.',
    features: ['Application Web Fullstack', 'IA Basique', 'Maintenance 6 mois', 'SEO Avancé'],
    unavailableFeatures: ['Application Mobile Native', 'Support Dédié'],
    isPremium: true
  },
  {
    id: 'p3',
    name: 'Pack Enterprise',
    price: 'Sur Mesure',
    description: 'Pour les grands comptes nécessitant une infrastructure robuste.',
    features: ['Architecture Cloud Scalable', 'IA Avancée & Big Data', 'App Mobile iOS/Android', 'Support 24/7'],
    unavailableFeatures: []
  }
];

export const ALL_TOOLS = [
  { id: 'converter', name: 'Convertisseur PDF', icon: 'fa-file-pdf', color: 'text-red-500', bg: 'bg-red-500/10', tags: ['pro', 'admin'] },
  { id: 'cv', name: 'Générateur CV IA', icon: 'fa-id-card', color: 'text-blue-500', bg: 'bg-blue-500/10', tags: ['job', 'pro'] },
  { id: 'quote', name: 'Devis Express', icon: 'fa-file-invoice-dollar', color: 'text-green-500', bg: 'bg-green-500/10', tags: ['pro', 'entrepreneur'] },
  { id: 'portal', name: 'Portail Client', icon: 'fa-user-tie', color: 'text-purple-500', bg: 'bg-purple-500/10', tags: ['pro', 'admin'] },
  { id: 'ecommerce', name: 'Calculateur E-com', icon: 'fa-calculator', color: 'text-orange-500', bg: 'bg-orange-500/10', tags: ['entrepreneur', 'commerce'] },
  { id: 'stock', name: 'Gestion Stock', icon: 'fa-boxes', color: 'text-yellow-500', bg: 'bg-yellow-500/10', tags: ['commerce', 'entrepreneur'] },
  { id: 'sports', name: 'Coach Sportif', icon: 'fa-dumbbell', color: 'text-emerald-500', bg: 'bg-emerald-500/10', tags: ['sport', 'santé'] },
  { id: 'calculator', name: 'Calcul Scientifique', icon: 'fa-square-root-alt', color: 'text-cyan-500', bg: 'bg-cyan-500/10', tags: ['étudiant', 'tech'] },
  { id: 'knowledge', name: 'Moteur de Savoir', icon: 'fa-book-reader', color: 'text-indigo-500', bg: 'bg-indigo-500/10', tags: ['étudiant', 'curieux'] },
  { id: 'research', name: 'Assistant Recherche', icon: 'fa-microscope', color: 'text-pink-500', bg: 'bg-pink-500/10', tags: ['étudiant', 'tech'] },
  { id: 'elderly', name: 'Aide aux Seniors', icon: 'fa-heartbeat', color: 'text-rose-500', bg: 'bg-rose-500/10', tags: ['santé', 'famille'] },
  { id: 'women', name: 'Empowerment Femmes', icon: 'fa-female', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', tags: ['femme', 'entrepreneur'] },
  { id: 'performance', name: 'Croissance Pro', icon: 'fa-chart-line', color: 'text-violet-500', bg: 'bg-violet-500/10', tags: ['pro', 'entrepreneur'] },
  { id: 'teenz', name: 'Espace Ados', icon: 'fa-gamepad', color: 'text-sky-500', bg: 'bg-sky-500/10', tags: ['jeune', 'fun'] },
  { id: 'couples', name: 'Logistique Couple', icon: 'fa-heart', color: 'text-red-400', bg: 'bg-red-400/10', tags: ['couple', 'famille'] },
  { id: 'love', name: 'Jeune Amour', icon: 'fa-kiss-wink-heart', color: 'text-pink-400', bg: 'bg-pink-400/10', tags: ['jeune', 'love'] },
  { id: 'dating', name: 'Rencontres Smart', icon: 'fa-comments', color: 'text-orange-400', bg: 'bg-orange-400/10', tags: ['célibataire', 'love'] },
  { id: 'services', name: 'Services Locaux', icon: 'fa-map-marker-alt', color: 'text-blue-400', bg: 'bg-blue-400/10', tags: ['ville', 'job'] },
  { id: 'social', name: 'Réseau Quartier', icon: 'fa-users', color: 'text-indigo-400', bg: 'bg-indigo-400/10', tags: ['ville', 'social'] },
];
