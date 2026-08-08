interface AuthUserPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
      currentUser?: any;
    }
  }
}

export { };