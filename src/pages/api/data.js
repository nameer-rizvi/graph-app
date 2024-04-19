import { wsj } from "../../wsj";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const json = await wsj(req.query.symbol, req.query.timeframe);
      res.status(200).json(json);
    } catch (error) {
      res.status(400).send(error.toString());
    }
  } else res.status(405).send("Method Not Allowed.");
}

export const config = {
  api: {
    responseLimit: "8mb",
  },
};
