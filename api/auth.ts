import { Elysia, t, type AnyElysia } from "elysia";
import {
  consumeLoginAttempt,
  createSessionToken,
  isRequestAuthenticated,
  isSecureRequest,
  passwordsEqual,
  sessionCookieHeader,
} from "../shared/admin-auth";

export type AdminAuthOptions = {
  required: boolean;
  password: string;
};

export function withAdminAuth(routes: AnyElysia, options: AdminAuthOptions) {
  if (!options.required) return routes;
  return new Elysia()
    .onBeforeHandle(({ request, set }) => {
      if (isRequestAuthenticated(request, options.password)) return;
      set.status = 401;
      return { code: 401, message: "Unauthorized" };
    })
    .use(routes);
}

export function createAuthRoutes(options: AdminAuthOptions) {
  return new Elysia({ prefix: "/api/auth" })
    .get("/status", ({ request }) => {
      if (!options.required) {
        return { code: 0, message: "ok", data: { required: false, authenticated: true } };
      }
      return {
        code: 0,
        message: "ok",
        data: {
          required: true,
          authenticated: isRequestAuthenticated(request, options.password),
        },
      };
    })
    .post(
      "/login",
      ({ request, body, server, set }) => {
        if (!options.required) {
          return { code: 0, message: "ok", data: { required: false, authenticated: true } };
        }

        const ip = server?.requestIP(request)?.address ?? "unknown";
        if (!consumeLoginAttempt(ip)) {
          set.status = 429;
          return { code: 429, message: "Too many login attempts" };
        }

        const password = typeof body?.password === "string" ? body.password : "";
        if (!passwordsEqual(password, options.password)) {
          set.status = 401;
          return { code: 401, message: "Invalid password" };
        }

        set.headers["set-cookie"] = sessionCookieHeader(
          createSessionToken(options.password),
          isSecureRequest(request),
        );
        return { code: 0, message: "ok", data: { required: true, authenticated: true } };
      },
      {
        body: t.Object({
          password: t.String(),
        }),
      },
    )
    .post("/logout", ({ request, set }) => {
      set.headers["set-cookie"] = sessionCookieHeader(null, isSecureRequest(request));
      return {
        code: 0,
        message: "ok",
        data: {
          required: options.required,
          authenticated: !options.required,
        },
      };
    });
}
