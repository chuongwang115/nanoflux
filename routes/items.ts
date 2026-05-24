import { Elysia, t } from "elysia";
import { listItems, markAllItemsRead, markItemRead } from "../db/items";

export const routes = new Elysia({ prefix: "/api/items" })
  .get(
    "/",
    ({ query }) => listItems({ cursor: query.cursor, limit: query.limit }),
    {
      query: t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
      }),
    },
  )
  .post(
    "/read-all",
    ({ body }) => {
      markAllItemsRead(body.until);
      return { success: true };
    },
    {
      body: t.Object({
        until: t.String(),
      }),
    },
  )
  .post(
    "/:id/read",
    ({ params }) => {
      markItemRead(params.id);
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  );
