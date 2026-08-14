export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalDocumentOptions {
  title: string;
  lastUpdated: string;
  version: string;
  introduction: string;
  sections: LegalSection[];
}

export const buildLegalDocumentText = ({
  title,
  lastUpdated,
  version,
  introduction,
  sections,
}: LegalDocumentOptions): string => {
  const formattedSections = sections.map((section) => {
    const paragraphs = section.paragraphs?.join('\n\n') ?? '';
    const bullets = section.bullets?.map((item) => `• ${item}`).join('\n') ?? '';
    return [section.title.toUpperCase(), paragraphs, bullets].filter(Boolean).join('\n\n');
  });

  return [
    title,
    `Última actualización: ${lastUpdated}`,
    `Versión: ${version}`,
    introduction,
    ...formattedSections,
    'CONTACTO\n\nHipotecaLab\nMadrid, España\nCorreo electrónico: cdominguezmonferrer@gmail.com',
  ].join('\n\n');
};
