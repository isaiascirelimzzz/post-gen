import bcrypt from 'bcrypt'

export const hash = {
  generate: (password: string) => bcrypt.hash(password, 10),
  compare: (password: string, hashed: string) => bcrypt.compare(password, hashed),
}
