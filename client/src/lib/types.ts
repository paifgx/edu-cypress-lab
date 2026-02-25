export interface Program {
  id: string
  title: string
  description: string
  category: string
}

export interface Application {
  id: string
  programId: string
  programTitle: string
  applicantName: string
  applicantEmail: string
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface User {
  email: string
  role: 'citizen' | 'officer'
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}
