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
