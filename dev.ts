const children = [
  Bun.spawn(["bun", "--watch", "build.ts"], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  }),
  Bun.spawn(["bun", "--watch", "main.ts"], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  }),
];

const shutdown = () => {
  for (const child of children) child.kill();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await Promise.all(children.map((c) => c.exited));
