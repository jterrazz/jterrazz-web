export enum ExperimentArchitecture {
  Atomic = "Atomic Design",
  // Code Architectures
  Clean = "Clean Architecture",
  DomainInfrastructure = "Domain/Infrastructure Architecture",
  Hexagonal = "Hexagonal Architecture",

  // Design Systems
  Spectrum = "Spectrum (Adobe's Design System)",
}

export enum ExperimentCategory {
  App = "Application",
  Hackathon = "Hackathon",
  System = "System/Algorithm",
  Tool = "Tool",
}

export enum ExperimentContext {
  Personal = "Personal Project",
  School42 = "42 Paris School",
  Professional = "Professional Work",
  Hackathon = "Hackathon",
}

export enum ExperimentStatus {
  Active = "active",
  Archived = "archived",
  Building = "building",
  Completed = "completed",
  Concept = "concept",
}

export type Experiment = {
  category: ExperimentCategory;
  components: Array<ExperimentComponent>; // Can be empty for simple experiments
  context: ExperimentContext;
  description: string;
  tagline: string; // Short one-liner for card display

  // Optional details for rich page
  iconUrl?: string;
  longDescription?: string;
  images?: {
    thumbnail: string;
    screenshots?: string[];
  };
  storeLinks?: {
    appStore?: string;
    playStore?: string;
    web?: string;
  };
  hasPrivacyPolicy?: boolean;

  name: string;
  slug: string;
  status: ExperimentStatus;
  url?: URL;
  year: number;
};

export type ExperimentComponent = {
  architectures: Array<ExperimentArchitecture>;
  description: string;
  isPrivate?: boolean;
  name: string;
  sourceUrl: URL;
  status: ExperimentStatus;
};
