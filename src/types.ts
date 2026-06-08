export interface Province {
  id: string;
  name: string;
  capital: string;
  description: string;
  population: string;
  agriculturalProducts: string[];
  historicSites: string[];
  climate: string;
}

export interface CultureItem {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  iconName: string; // Used to select Lucide icons
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

export interface HistoricHero {
  name: string;
  role: string;
  lifeSpan: string;
  achievements: string;
  description: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}
