import type { Request, Response, NextFunction } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;

function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;
  if (!secret) throw new AppError("Gateway secret is not configured", 500);
  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;

  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, 1);
  }
  return combined || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
}

//main middleware-> run on every "/auth" request before the proxy forward to the auth service.
export function gatewayAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    stripIdentityHeaders(req);
    attachGatewaySecret(req);
    const path = requestPath(req);

    //if this path is a public route we are going to bypass it
    // we do not need auth

    if (isPublicRoute(req.method, path)) {
      return next();
    }

    const authHeader = req.header("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid auth token", 401);
    }

    const token = authHeader.slice("Bearer ".length).trim();

    const payload = verifyToken(token);

    //RBAC -> is this role allowed on this method/path
    const allowedRoles = getAllowedRoles(req.method, path);

    if (!allowedRoles) throw new AppError("Route not found!", 404);

    //forbidden
    if (!allowedRoles.includes(payload.role))
      throw new AppError("You do not have access to this route!", 403);

    attachUserHeaders(req, payload.userId, payload.role);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
  }
  //in-case if jwt verification is failed
  return next(new AppError("Invalid or expired token", 401));
}
