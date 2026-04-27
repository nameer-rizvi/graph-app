export async function GET() {
  return new Response(process.env.CRON_SECRET);
}
