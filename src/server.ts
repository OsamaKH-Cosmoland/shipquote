import "dotenv/config";
import "./instrument";
import { app } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// The database connection is established lazily on the first request that needs
// it (see ensureDbConnected in app.ts) rather than here at startup, so this
// entrypoint and the serverless one in api/ share the same connection logic.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
