import { CERTIFICATION_LOGOS, findLogoById, OrganizationLogoEntry } from './certification-logos';

export interface ResolveLogoParams {
  issuer?: string | null;
  title?: string | null;
  credentialUrl?: string | null;
  badgeImageUrl?: string | null;
}

export interface ResolveLogoResult {
  iconKey: string;
  isCdnUrl: boolean;
  logoEntry?: OrganizationLogoEntry;
  brandColor?: string;
  displayName: string;
}

function extractDomain(url?: string | null): string | null {
  if (!url || !url.trim()) return null;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Intelligent Multi-Tier Resolver for Certification & Academy Logos
 */
export function resolveCertificationLogo({
  issuer,
  title,
  credentialUrl,
  badgeImageUrl,
}: ResolveLogoParams): ResolveLogoResult {
  // 1. Direct explicit HTTP/HTTPS image URL
  if (badgeImageUrl && (badgeImageUrl.startsWith('http://') || badgeImageUrl.startsWith('https://'))) {
    return {
      iconKey: badgeImageUrl,
      isCdnUrl: true,
      displayName: issuer || 'Verified Credential',
    };
  }

  // 2. Direct exact iconKey match from dataset
  if (badgeImageUrl) {
    const directMatch = findLogoById(badgeImageUrl);
    if (directMatch) {
      return {
        iconKey: directMatch.iconKey,
        isCdnUrl: false,
        logoEntry: directMatch,
        brandColor: directMatch.brandColor,
        displayName: directMatch.name,
      };
    }
  }

  const issuerClean = (issuer || '').toLowerCase().trim();
  const titleClean = (title || '').toLowerCase().trim();
  const domain = extractDomain(credentialUrl);

  // 3. Alias / Regex match against curated dataset
  if (issuerClean || titleClean) {
    for (const logo of CERTIFICATION_LOGOS) {
      for (const alias of logo.aliases) {
        if (
          issuerClean.includes(alias) ||
          (alias.length > 3 && titleClean.includes(alias))
        ) {
          return {
            iconKey: logo.iconKey,
            isCdnUrl: false,
            logoEntry: logo,
            brandColor: logo.brandColor,
            displayName: logo.name,
          };
        }
      }
    }
  }

  // 4. Domain match against curated dataset
  if (domain) {
    for (const logo of CERTIFICATION_LOGOS) {
      for (const d of logo.domains) {
        if (domain.includes(d) || d.includes(domain)) {
          return {
            iconKey: logo.iconKey,
            isCdnUrl: false,
            logoEntry: logo,
            brandColor: logo.brandColor,
            displayName: logo.name,
          };
        }
      }
    }

    // 5. Dynamic Smart Google Favicon CDN URL for unlisted domains
    if (domain !== 'linkedin.com' && domain !== 'localhost' && !domain.includes('127.0.0.1')) {
      const cdnFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      return {
        iconKey: cdnFaviconUrl,
        isCdnUrl: true,
        displayName: issuer || domain,
      };
    }
  }

  // 6. Generic Fallback
  return {
    iconKey: badgeImageUrl || 'default-cert',
    isCdnUrl: false,
    displayName: issuer || 'Verified Credential',
  };
}
