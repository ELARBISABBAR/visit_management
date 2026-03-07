import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip
    
} from 'chart.js';
import type {ChartOptions} from 'chart.js';
import type { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type VisitorsLineChartProps = {
    labels: string[];
    data: number[];
    title?: string;
    actions?: ReactNode;
};

export function VisitorsLineChart({
    labels,
    data,
    title = 'Total des visiteurs par jour',
    actions,
}: VisitorsLineChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Visiteurs',
                data,
                borderColor: '#F4B400',
                backgroundColor: 'rgba(244, 180, 0, 0.16)',
                pointBackgroundColor: '#D99A00',
                pointBorderColor: '#D99A00',
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
                grid: {
                    color: '#E5E7EB',
                },
                ticks: {
                    precision: 0,
                    color: '#6B7280',
                },
            },
            x: {
                grid: {
                    color: '#F3F4F6',
                },
                ticks: {
                    color: '#6B7280',
                },
            },
        },
    };

    return (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
                {actions}
            </div>
            <div className="h-72">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

