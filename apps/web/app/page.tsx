import { auth } from "@/auth";
import { shlink } from "@/lib/shlink";
import { VisitsChart } from "@/components/VisitsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  let stats = { totalUrls: 0 };
  let chartData: { date: string; count: number }[] = [];

  try {
    const [urlsData, visitsData] = await Promise.all([
      shlink.listShortUrls(1, 1),
      shlink.getVisits()
    ]);

    stats.totalUrls = urlsData?.shortUrls?.pagination?.totalItems || 0;

    // Process visits data for chart (group by date)
    if (visitsData?.visits?.data) {
      const visitsByDate = visitsData.visits.data.reduce((acc: any, visit: any) => {
        const date = new Date(visit.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      chartData = Object.entries(visitsByDate).map(([date, count]) => ({
        date,
        count: count as number,
      })).slice(-7); // Last 7 days with data
    } else {
      console.warn("Unexpected visits data structure:", visitsData);
    }

  } catch (e) {
    console.error("Failed to fetch stats", e);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Short URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUrls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{session?.user?.name || session?.user?.email}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <VisitsChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
