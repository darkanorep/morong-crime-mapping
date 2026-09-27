export type CrimeCategory =
  | "index-crime"
  | "non-index-crime"
  | "vehicular-accident"

export type BarangayId =
  | "poblacion"
  | "mabayo"
  | "binaritan"
  | "sabang"
  | "nagbalayong"

export interface Crime {
  id: string
  name: string
  category: CrimeCategory

  yearly: {
    "2024": number
    "2025": number
    "2026": number
  }

  barangays: Record<BarangayId, number>

  total: number
}

export interface CrimeDataset {
  reportingPeriod: {
    from: number
    to: number
  }

  location: {
    municipality: string
    province: string
    country: string
  }

  crimes: Crime[]
}