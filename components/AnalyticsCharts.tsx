import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  views: number;
  clicks: number;
  leads: number;
  whatsappClicks: number;
  phoneClicks: number;
  mapClicks: number;
  dailyStats: {
    [date: string]: {
      views: number;
      clicks: number;
      leads: number;
    };
  };
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  locationStats: {
    [location: string]: number;
  };
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [dailyData, setDailyData] = useState<any>(null);
  const [deviceData, setDeviceData] = useState<any>(null);
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    // Prepare daily stats data
    const dates = Object.keys(data.dailyStats).reverse();
    const views = dates.map(date => data.dailyStats[date].views);
    const clicks = dates.map(date => data.dailyStats[date].clicks);
    const leads = dates.map(date => data.dailyStats[date].leads);

    setDailyData({
      labels: dates,
      datasets: [
        {
          label: 'Views',
          data: views,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Clicks',
          data: clicks,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
        {
          label: 'Leads',
          data: leads,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1,
        },
      ],
    });

    // Prepare device stats data
    setDeviceData({
      labels: ['Mobile', 'Desktop', 'Tablet'],
      datasets: [
        {
          data: [
            data.deviceStats.mobile,
            data.deviceStats.desktop,
            data.deviceStats.tablet,
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
          ],
        },
      ],
    });

    // Prepare location stats data
    const locations = Object.keys(data.locationStats);
    const locationValues = locations.map(loc => data.locationStats[loc]);

    setLocationData({
      labels: locations,
      datasets: [
        {
          label: 'Visitors by Location',
          data: locationValues,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
          ],
        },
      ],
    });
  }, [data]);

  if (!dailyData || !deviceData || !locationData) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daily Traffic</h3>
        <Line
          data={dailyData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <Doughnut
            data={deviceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Visitor Locations</h3>
          <Bar
            data={locationData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-blue-600">{data.views}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-green-600">{data.clicks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-purple-600">{data.leads}</p>
        </div>
      </div>
    </div>
  );
} 