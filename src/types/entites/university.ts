export interface University {
  id: number
  name: string
  type: 'PTN' | 'PTS' | 'PTK'
  programs?: UniversityMajor[]
  createdAt?: string
}

export interface UniversityMajor {
  id: number
  universityId: number
  name: string
  passingGrade: number
  university?: University
}

export interface UserTarget {
  id: number
  userId: number
  universityMajorId: number
  priority: number
  universityProgram?: UniversityMajor
}
