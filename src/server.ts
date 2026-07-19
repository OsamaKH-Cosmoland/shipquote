import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function bootstrap() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap();
