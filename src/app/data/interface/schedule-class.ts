export interface ScheduleClass {
  schedule_class: string;
  description: string;
  refers_to: string;
}

export interface ScheduleClassState {
  classes: ScheduleClass[];
  limit: number;
  page: number;
  pages: number;
}

export interface SchedClassUpdatePayload {
  description: string;
  refers_to: string;
}
