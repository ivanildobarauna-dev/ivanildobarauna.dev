export interface PortfolioSnapshot {
  projects: unknown[];
  education: {
    formations: unknown[];
    certifications: unknown[];
  };
  socialMedia: unknown[];
  experiences: unknown[];
  companyDurations: { name: string; duration: string }[];
  totalExperience: {
    total_duration: string;
    asOf: string;
  };
  database: {
    tables: Record<string, unknown[]>;
  };
}

let snapshotPromise: Promise<PortfolioSnapshot> | undefined;

export function getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  if (!snapshotPromise) {
    snapshotPromise = fetch('/data/portfolio.json', {
      headers: { Accept: 'application/json' },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Falha ao carregar os dados do portfólio. Status: ${response.status}`);
      }

      return response.json() as Promise<PortfolioSnapshot>;
    }).catch((error: unknown) => {
      snapshotPromise = undefined;
      throw error;
    });
  }

  return snapshotPromise;
}

function completedMonthsBetween(startDate: string, endDate = new Date()): number {
  const start = new Date(`${startDate}T00:00:00`);
  let months = (endDate.getFullYear() - start.getFullYear()) * 12 + endDate.getMonth() - start.getMonth();

  if (endDate.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

export function formatDurationFromStart(startDate: string): string {
  const months = completedMonthsBetween(startDate);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (remainingMonths || !parts.length) parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`);
  return parts.join(' e ');
}

export function advanceDurationFromSnapshot(duration: string, asOf: string): string {
  const years = Number(duration.match(/(\d+)\s+ano/)?.[1] ?? 0);
  const months = Number(duration.match(/(\d+)\s+mes/)?.[1] ?? 0);
  const totalMonths = years * 12 + months + completedMonthsBetween(asOf);
  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  return `${totalYears} ${totalYears === 1 ? 'ano' : 'anos'}${remainingMonths ? ` e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}` : ''}`;
}
