export interface TutorPermissionUser {
  id: number
  username: string
  email: string
}

export interface TutorPermission {
  id: number
  tryOutId: number
  user: TutorPermissionUser | null
  grantedBy?: TutorPermissionUser | null
  grantedAt: string
}
