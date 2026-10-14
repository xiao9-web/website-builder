import type { Access, PayloadRequest } from 'payload'

export const administrator = ({ req }: { req: PayloadRequest }): boolean => req.user?.collection === 'users'
export const publishedOrAdministrator: Access = ({ req }) => (
  req.user?.collection === 'users' ? true : { _status: { equals: 'published' } }
)
