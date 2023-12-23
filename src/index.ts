// index.ts
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", routes);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Requested URL not found, Please provide correct URL" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      "Internal Server Error, Something went wrong at server side, Dont worry you can try again in sometime",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
