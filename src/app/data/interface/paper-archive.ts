export interface PaperArchive {
  belongs_to: string;
  form_datetime: string;
  classified_into: string;
  image: string;
}

export interface PaperArchivesState {
  archives: PaperArchive[];
  limit: number;
  page: number;
  pages: number;
}


export interface PaperArchiveDefinition {
  form_id: string;
  description: string;
}

export interface PaperArchiveDefinitionState {
  definitions: PaperArchiveDefinition[];
  limit: number;
  page: number;
  pages: number;
}
