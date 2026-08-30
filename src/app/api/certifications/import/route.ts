import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthSession, apiSuccess, apiError, revalidatePortfolioData, ensureHttps } from '@/lib/api-utils';
import { resolveCertificationLogo } from '@/lib/resolve-certification-logo';

export interface RawImportCertItem {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl: string;
  badgeImageUrl?: string | null;
}

function parseDateStr(str?: string | null): string {
  if (!str || !str.trim()) return new Date().toISOString().split('T')[0];
  const cleaned = str.trim();
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

function safeUrl(raw?: string | null): string {
  if (!raw || !raw.trim()) return 'https://linkedin.com';
  return ensureHttps(raw) || 'https://linkedin.com';
}

function parseCsv(csvText: string): RawImportCertItem[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvRow(lines[0]).map((h) => h.toLowerCase().trim());
  const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('title'));
  const authIdx = headers.findIndex((h) => h.includes('authority') || h.includes('issuer'));
  const startIdx = headers.findIndex((h) => h.includes('started') || h.includes('issue'));
  const endIdx = headers.findIndex((h) => h.includes('finished') || h.includes('expir'));
  const licIdx = headers.findIndex((h) => h.includes('license') || h.includes('credential id'));
  const urlIdx = headers.findIndex((h) => h.includes('url') || h.includes('link'));

  const items: RawImportCertItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvRow(lines[i]);
    if (row.length === 0) continue;

    const title = nameIdx >= 0 && row[nameIdx] ? row[nameIdx].trim() : '';
    const issuer = authIdx >= 0 && row[authIdx] ? row[authIdx].trim() : 'Verified Organization';
    if (!title) continue;

    const issueDate = startIdx >= 0 && row[startIdx] ? parseDateStr(row[startIdx]) : new Date().toISOString().split('T')[0];
    const expiryDate = endIdx >= 0 && row[endIdx] ? parseDateStr(row[endIdx]) : null;
    const credentialId = licIdx >= 0 && row[licIdx] ? row[licIdx].trim() : null;
    const credentialUrl = urlIdx >= 0 && row[urlIdx] ? safeUrl(row[urlIdx]) : 'https://linkedin.com';

    const resolved = resolveCertificationLogo({
      issuer,
      title,
      credentialUrl,
    });

    items.push({
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      badgeImageUrl: resolved.iconKey,
    });
  }

  return items;
}

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((s) => s.trim().replace(/^"|"$/g, ''));
}

export async function POST(request: Request) {
  const authError = await requireAuthSession();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { mode, csvData, jsonData, items, url, title, issuer } = body;

    const existingCerts = await prisma.certification.findMany({
      select: { id: true, title: true, issuer: true, credentialId: true },
    });

    const isDuplicate = (item: RawImportCertItem) => {
      const matchTitle = existingCerts.some(
        (c) =>
          c.title.toLowerCase().trim() === item.title.toLowerCase().trim() &&
          c.issuer.toLowerCase().trim() === item.issuer.toLowerCase().trim()
      );
      const matchId =
        item.credentialId &&
        existingCerts.some((c) => c.credentialId && c.credentialId.toLowerCase() === item.credentialId?.toLowerCase());
      return Boolean(matchTitle || matchId);
    };

    if (mode === 'preview') {
      let parsedItems: RawImportCertItem[] = [];

      if (csvData) {
        parsedItems = parseCsv(csvData);
      } else if (jsonData && Array.isArray(jsonData)) {
        parsedItems = jsonData
          .map((raw: any) => {
            const rawTitle = String(raw.title || raw.name || '').trim();
            const rawIssuer = String(raw.issuer || raw.authority || 'Verified Organization').trim();
            const rawUrl = safeUrl(raw.credentialUrl || raw.url);
            const resolved = resolveCertificationLogo({
              issuer: rawIssuer,
              title: rawTitle,
              credentialUrl: rawUrl,
              badgeImageUrl: raw.badgeImageUrl,
            });

            return {
              title: rawTitle,
              issuer: rawIssuer,
              issueDate: parseDateStr(raw.issueDate || raw.startedOn || raw.started_on),
              expiryDate: raw.expiryDate || raw.finishedOn ? parseDateStr(raw.expiryDate || raw.finishedOn) : null,
              credentialId: raw.credentialId || raw.licenseNumber ? String(raw.credentialId || raw.licenseNumber).trim() : null,
              credentialUrl: rawUrl,
              badgeImageUrl: raw.badgeImageUrl ? String(raw.badgeImageUrl).trim() : resolved.iconKey,
            };
          })
          .filter((i: RawImportCertItem) => i.title.length > 0);
      } else if (url) {
        const parsedUrl = safeUrl(url);
        let detectedIssuer = issuer || 'Verified Authority';
        let detectedTitle = title || 'Verified Credential';

        if (!issuer) {
          if (parsedUrl.includes('credly.com') || parsedUrl.includes('youracclaim.com')) {
            detectedIssuer = 'Credly Verified Issuer';
          } else if (parsedUrl.includes('coursera.org')) {
            detectedIssuer = 'Coursera';
          } else if (parsedUrl.includes('udemy.com')) {
            detectedIssuer = 'Udemy';
          } else if (parsedUrl.includes('cloud.google.com')) {
            detectedIssuer = 'Google Cloud';
          } else if (parsedUrl.includes('aws.training') || parsedUrl.includes('amazon')) {
            detectedIssuer = 'Amazon Web Services';
          } else if (parsedUrl.includes('microsoft.com')) {
            detectedIssuer = 'Microsoft';
          } else if (parsedUrl.includes('stanford.edu')) {
            detectedIssuer = 'Stanford Online';
          } else if (parsedUrl.includes('mit.edu')) {
            detectedIssuer = 'MIT';
          } else if (parsedUrl.includes('harvard.edu')) {
            detectedIssuer = 'Harvard University';
          }
        }

        if (!title) {
          try {
            const u = new URL(parsedUrl);
            const pathParts = u.pathname.split('/').filter(Boolean);
            if (pathParts.length > 0) {
              detectedTitle = pathParts[pathParts.length - 1].replace(/[-_]/g, ' ');
              detectedTitle = detectedTitle.charAt(0).toUpperCase() + detectedTitle.slice(1);
            }
          } catch {
            detectedTitle = 'Professional Certificate';
          }
        }

        const resolved = resolveCertificationLogo({
          issuer: detectedIssuer,
          title: detectedTitle,
          credentialUrl: parsedUrl,
        });

        parsedItems = [
          {
            title: detectedTitle,
            issuer: detectedIssuer,
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: null,
            credentialId: null,
            credentialUrl: parsedUrl,
            badgeImageUrl: resolved.iconKey,
          },
        ];
      }

      const itemsWithDupes = parsedItems.map((item) => ({
        ...item,
        isDuplicate: isDuplicate(item),
      }));

      return apiSuccess({
        items: itemsWithDupes,
        totalCount: itemsWithDupes.length,
        duplicateCount: itemsWithDupes.filter((i) => i.isDuplicate).length,
      });
    }

    if (mode === 'commit') {
      if (!Array.isArray(items) || items.length === 0) {
        return apiError('No items provided to import', 400);
      }

      const maxOrderCert = await prisma.certification.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      let currentOrder = (maxOrderCert?.order ?? -1) + 1;

      const created: any[] = [];
      for (const item of items) {
        const resolved = resolveCertificationLogo({
          issuer: item.issuer,
          title: item.title,
          credentialUrl: item.credentialUrl,
          badgeImageUrl: item.badgeImageUrl,
        });

        const cert = await prisma.certification.create({
          data: {
            title: item.title,
            issuer: item.issuer,
            issueDate: new Date(item.issueDate || Date.now()),
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
            credentialId: item.credentialId || null,
            credentialUrl: safeUrl(item.credentialUrl),
            badgeImageUrl: item.badgeImageUrl || resolved.iconKey,
            order: currentOrder++,
          },
        });
        created.push(cert);
      }

      revalidatePortfolioData();
      return apiSuccess({ success: true, count: created.length, items: created });
    }

    return apiError('Invalid mode specified (expected "preview" or "commit")', 400);
  } catch (error: any) {
    console.error('[IMPORT_CERTIFICATIONS_ERROR]:', error);
    return apiError(error.message || 'Failed to import certifications', 500);
  }
}
