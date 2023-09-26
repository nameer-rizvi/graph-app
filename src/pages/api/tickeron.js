import { tickeron } from "../../squezapi";

// Next.js API Routes Documentation
//   https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const json = await tickeron(req.query.symbol);
      res.status(200).json(json);
    } catch (error) {
      res.status(400).send(error.toString());
    }
  } else res.status(405).send("Method Not Allowed.");
}
