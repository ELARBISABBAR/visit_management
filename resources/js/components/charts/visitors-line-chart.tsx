import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type VisitorsLineChartProps = {
    labels: string[];
    data: number[];
    title?: string;
};

export function VisitorsLineChart({
    labels,
    data,
    title = 'Total des visiteurs par jour',
}: VisitorsLineChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Visiteurs',
                data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#2563eb',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.parsed.y} visite(s)`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>
            <div className="h-72">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

