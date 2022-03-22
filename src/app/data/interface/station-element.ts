import { StationElement } from "./station";

export interface StationElementsState {
  elements: StationElement[];
  limit: number;
  page: number;
  pages: number;
}
