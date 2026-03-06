export interface WorkCatalogPart {
  id: string;
  title?: string;
  path: string;
}

export interface WorkCatalogItem {
  id: string;
  title: string;
  author?: string;
  language?: string;
  source?: string;
  copyrightProof: string;
  checksum?: string;
  textPath?: string;
  parts?: WorkCatalogPart[];
}

export type CatalogSourceMode = 'preview' | 'works-origin';

export interface WorksCatalogPayload {
  items: WorkCatalogItem[];
  sourceMode: CatalogSourceMode;
  worksBaseUrl: string | null;
}
