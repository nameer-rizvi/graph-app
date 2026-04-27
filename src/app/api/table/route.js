import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const screener = searchParams.get("screener")?.toLowerCase() ?? "";

    const timeframe = searchParams.get("timeframe")?.toLowerCase() ?? "";

    const valid =
      ["etfs", "equities"].includes(screener) &&
      ["weekly", "monthly"].includes(timeframe);

    if (!valid) throw new Error("Invalid request.");

    const { blobs } = await list({ prefix: `table/${screener}/${timeframe}` });

    if (!blobs.length) {
      throw new Error("Data not available yet — cron may not have run.");
    }

    const res = await fetch(blobs[0].url);

    const rows = await res.json();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
