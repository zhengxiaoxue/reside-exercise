export type InfectionDataRecord = {
  id: string
  admin0Id: string
  admin1Id: string
  summaryTypeId: string
  indicatorId: string
  ageGroupId: string | null
  value: number
}

export type InfectionDataResponse = {
  data: InfectionDataRecord[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export type SearchPayload = {
  admin0Id: string
  indicator: string
}

export type InfectionTableFilters = {
  admin1Id: string
  summaryTypeId: string
  minValue: string
  maxValue: string
}