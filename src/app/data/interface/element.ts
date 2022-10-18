export interface ObsElement {
  element_id?: string,
  abbreviation: string,
  element_name: string,
  description: string,
  element_scale: number,
  upper_limit: string,
  lower_limit: string,
  units: string,
  element_type: string,
  qc_total_required: number,
  selected: boolean
}

export interface ObsElementState {
  elements: ObsElement[],
  limit: number,
  page: number,
  pages: number
}
