export interface PrivateSection {
  id: string;
  title: string;
  from?: string;
  paragraphs?: string[];
  bullets?: string[];
}

/** Content moved off the public site. Newest sections append at the bottom. */
export const PRIVATE_SECTIONS: PrivateSection[] = [];
