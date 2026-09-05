export interface PortfolioSnapshot {
  projects: unknown[];
  education: {
    formations: unknown[];
    certifications: unknown[];
  };
  socialMedia: unknown[];
  experiences: unknown[];
  companyDurations: { name: string; duration: string }[];
  totalExperience: { total_duration: string };
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
    });
  }

  return snapshotPromise;
}
