import { Elysia } from "elysia";
import {
  createFilter,
  deleteFilter,
  getFilter,
  getFilters,
  reorderFilter,
  updateFilter,
  type FilterReorderAction,
} from "../filters";

const REORDER_ACTIONS = new Set<FilterReorderAction>([
  "up",
  "down",
  "top",
  "bottom",
]);

function getFiltersHandler() {
  try {
    return {
      code: 0,
      message: "ok",
      data: { filters: getFilters() },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get filters";
    return { code: 500, message };
  }
}

function getFilterHandler({ params }: { params: { id: string } }) {
  try {
    const filter = getFilter(params.id);
    if (!filter) {
      return { code: 404, message: "Filter not found" };
    }
    return { code: 0, message: "ok", data: filter };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get filter";
    return { code: 500, message };
  }
}

async function createFilterHandler({ body }: { body: any }) {
  try {
    const created = await createFilter(body ?? {});
    return { code: 0, message: "ok", data: created };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create filter";
    return { code: 500, message };
  }
}

async function updateFilterHandler({
  params,
  body,
}: {
  params: { id: string };
  body: any;
}) {
  try {
    const filter = await updateFilter(params.id, body ?? {});
    return { code: 0, message: "ok", data: filter };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update filter";
    return { code: 500, message };
  }
}

async function deleteFilterHandler({ params }: { params: { id: string } }) {
  try {
    await deleteFilter(params.id);
    return { code: 0, message: "ok" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete filter";
    return { code: 500, message };
  }
}

async function reorderFilterHandler({
  params,
  body,
}: {
  params: { id: string };
  body: { action?: string };
}) {
  try {
    const action = body?.action;
    if (!action || !REORDER_ACTIONS.has(action as FilterReorderAction)) {
      return { code: 400, message: "Invalid reorder action" };
    }
    const filters = await reorderFilter(params.id, action as FilterReorderAction);
    return { code: 0, message: "ok", data: { filters } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reorder filter";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/filters" })
  .get("/", getFiltersHandler)
  .post("/create", createFilterHandler)
  .get("/:id", getFilterHandler)
  .post("/:id", updateFilterHandler)
  .post("/:id/reorder", reorderFilterHandler)
  .post("/:id/delete", deleteFilterHandler);
