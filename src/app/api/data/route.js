import { NextResponse } from "next/server";
import { wsj } from "../../../wsj";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol");

    const timeframe = searchParams.get("timeframe");

    const data = await wsj(symbol, timeframe);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }
}
