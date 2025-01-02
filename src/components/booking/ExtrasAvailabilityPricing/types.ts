export interface ExtraOption {
  id: string;
  name: string;
  code: string;
  hostId: string;
  extra_id: number;
  tourOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
  extraOptions: {
    basisId: number;
    subbasisId: number;
    timeId: number;
  };
}

export interface ProcessedExtra {
  name: string;
  code: string;
  extra_id: number;
  availability: {
    available: number;
    operational: boolean;
    expired: boolean;
  };
  pricing: {
    adult: number;
    child: number;
    infant: number;
    currency: string;
  };
}

export interface AdultExtra {
  adultId: number;
  extraId: string | null;
}