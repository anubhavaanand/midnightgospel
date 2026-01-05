/**
 * SEO Metadata & Open Graph Configuration
 * Dynamic meta tag generation for production
 */

export interface SEOConfig {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'video';
  twitterHandle?: string;
  canonicalUrl?: string;
}

/**
 * Update document head with SEO metadata
 */
export function setSEOMetadata(config: SEOConfig): void {
  // Title
  document.title = config.title;
  updateMetaTag('name', 'description', config.description);

  // Open Graph
  updateMetaTag('property', 'og:title', config.title);
  updateMetaTag('property', 'og:description', config.description);
  updateMetaTag('property', 'og:image', config.image);
  updateMetaTag('property', 'og:url', config.url);
  updateMetaTag('property', 'og:type', config.type || 'website');

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', config.title);
  updateMetaTag('name', 'twitter:description', config.description);
  updateMetaTag('name', 'twitter:image', config.image);
  
  if (config.twitterHandle) {
    updateMetaTag('name', 'twitter:creator', config.twitterHandle);
  }

  // Canonical URL
  if (config.canonicalUrl) {
    updateLinkTag('canonical', config.canonicalUrl);
  }
}

/**
 * Update or create meta tag
 */
function updateMetaTag(attribute: string, name: string, value: string): void {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = value;
}

/**
 * Update or create link tag
 */
function updateLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO_CONFIG: SEOConfig = {
  title: 'Midnight Gospel 3D - Multiverse Simulator',
  description: 'Explore a psychedelic immersive 3D experience adapting the Netflix animated series into an interactive multiverse simulator. Navigate through 6 surreal dimensions with spatial audio and physics-driven interactivity.',
  image: 'https://midnightgospel3d.com/og-image.png',
  url: 'https://midnightgospel3d.com',
  type: 'website',
  twitterHandle: '@midnightgospel',
  canonicalUrl: 'https://midnightgospel3d.com',
};

/**
 * Per-level SEO configurations
 */
export const LEVEL_SEO_CONFIGS: Record<number, Partial<SEOConfig>> = {
  0: {
    title: 'Midnight Gospel 3D - Chromatic Void | Level 0',
    description: 'Enter the Chromatic Void - the beginning of your psychedelic journey through the multiverse simulator.',
  },
  1: {
    title: 'Midnight Gospel 3D - Zombie Apocalypse | Level 1',
    description: 'Descend into the Zombie Apocalypse dimension where reality begins to distort.',
  },
  2: {
    title: 'Midnight Gospel 3D - Clown Planet | Level 2',
    description: 'Experience the chaotic Clown Planet with its surreal machinery and impossible geometry.',
  },
  3: {
    title: 'Midnight Gospel 3D - Ass Cream | Level 3',
    description: 'Navigate the fluid, dreamlike realm of Ass Cream with its non-Euclidean water dynamics.',
  },
  4: {
    title: 'Midnight Gospel 3D - Soul Prison | Level 4',
    description: 'Confront the existential landscape of the Soul Prison, a Bosch-like dimension of consciousness.',
  },
  5: {
    title: 'Midnight Gospel 3D - The Exit | Level 5',
    description: 'Face the final dimension as the simulator reaches its climactic end state - reality fragmentation.',
  },
};

/**
 * Initialize default SEO metadata on page load
 */
export function initializeSEO(): void {
  setSEOMetadata(DEFAULT_SEO_CONFIG);
}

/**
 * Update SEO for level transition
 */
export function updateLevelSEO(levelIndex: number): void {
  const levelConfig = LEVEL_SEO_CONFIGS[levelIndex];
  if (levelConfig) {
    setSEOMetadata({
      ...DEFAULT_SEO_CONFIG,
      ...levelConfig,
    });
  }
}

/**
 * JSON-LD Structured Data
 */
export function getStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Midnight Gospel 3D',
    url: 'https://midnightgospel3d.com',
    description: DEFAULT_SEO_CONFIG.description,
    applicationCategory: 'GameApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Midnight Gospel Studio',
    },
    screenshot: DEFAULT_SEO_CONFIG.image,
  };
}

/**
 * Inject structured data into page
 */
export function injectStructuredData(): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(getStructuredData());
  document.head.appendChild(script);
}
