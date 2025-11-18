export type RecommendationStatus =
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'ALREADY_INVESTED'
  | null

// Stored preference for a single recommendation
export interface RecommendationPreference {
  id: string
  name: string
  category: string
  status: RecommendationStatus
}

// Shape used when updating a recommendation's status
export interface RecommendationStatusUpdatePayload {
  id: string
  name: string
  category: string
  status: RecommendationStatus
}


