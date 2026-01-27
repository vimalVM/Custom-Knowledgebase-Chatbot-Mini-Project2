export type Audience = "student" | "faculty" | "staff" | "visitor" | "all"

export type KBItem = {
  id: string
  title: string
  audience: Audience[] | "all"
  content: string
  tags?: string[]
}

export type KBEmbedding = {
  id: string
  embedding: number[]
}