import express, { Request, Response } from "express";

interface Flag {
  key: string;
  enabled: boolean;
  description: string;
}

const app = express();
app.use(express.json());

const flags = new Map<string, Flag>();

// Health check
//
// Kubernetes liveness/readiness probes in the Helm chart expect `/healthz`.
// Keep `/health` for backwards compatibility.
app.get(["/health", "/healthz"], (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// List all flags
app.get("/api/flags", (_req: Request, res: Response) => {
  res.json(Array.from(flags.values()));
});

// Get single flag
app.get("/api/flags/:key", (req: Request<{ key: string }>, res: Response) => {
  const flag = flags.get(req.params.key);
  if (!flag) {
    res.status(404).json({ error: "Flag not found" });
    return;
  }
  res.json(flag);
});

// Create flag
app.post("/api/flags", (req: Request, res: Response) => {
  const { key, enabled, description } = req.body;

  if (!key || typeof key !== "string") {
    res.status(400).json({ error: "key is required and must be a string" });
    return;
  }
  if (typeof enabled !== "boolean") {
    res.status(400).json({ error: "enabled is required and must be a boolean" });
    return;
  }
  if (flags.has(key)) {
    res.status(409).json({ error: "Flag already exists" });
    return;
  }

  const flag: Flag = {
    key,
    enabled,
    description: typeof description === "string" ? description : "",
  };

  flags.set(key, flag);
  res.status(201).json(flag);
});

// Update flag
app.patch("/api/flags/:key", (req: Request<{ key: string }>, res: Response) => {
  const flag = flags.get(req.params.key);
  if (!flag) {
    res.status(404).json({ error: "Flag not found" });
    return;
  }

  if (typeof req.body.enabled === "boolean") {
    flag.enabled = req.body.enabled;
  }
  if (typeof req.body.description === "string") {
    flag.description = req.body.description;
  }

  flags.set(flag.key, flag);
  res.json(flag);
});

// Delete flag
app.delete("/api/flags/:key", (req: Request<{ key: string }>, res: Response) => {
  if (!flags.has(req.params.key)) {
    res.status(404).json({ error: "Flag not found" });
    return;
  }
  flags.delete(req.params.key);
  res.status(204).send();
});

const PORT = parseInt(process.env.PORT || "3005", 10);
app.listen(PORT, () => {
  console.log(`Feature flag manager listening on port ${PORT}`);
});
