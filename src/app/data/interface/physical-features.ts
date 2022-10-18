export interface PhysicalFeature {
  associated_with: string;
  begin_date: Date;
  end_date: Date;
  image: string;
  description: string;
  classified_into: string;
}

export interface PhysicalFeatureClass {
  feature_class: string;
  description: string;
  refers_to: string;
}

export interface PhysicalFeatureState {
  features: PhysicalFeature[];
  limit: number;
  page: number;
  pages: number;
}
