declare namespace Express {
  export interface Request {
    userToken?: import('jsonwebtoken').JwtPayload,
  }
}
