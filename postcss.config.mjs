import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/postcss";

const root = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: [
    tailwindcss({
      base: path.join(root, "client"),
      optimize: { minify: true },
    }),
  ],
};
