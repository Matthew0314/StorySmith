import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


interface FeatureUsageChartProps {
    data: {
        name: string;
        value: number;
    }[];
}



export default function FeatureUsageChart({ data }: FeatureUsageChartProps) {
    return (
        <div className="chart-container">

            <h2>Feature Usage</h2>

            <ResponsiveContainer width="100%" height={300}>

                <BarChart data={data}>

                    <CartesianGrid />

                    <XAxis dataKey="name"/>

                    <YAxis />

                    <Tooltip />

                    <Bar 
                        dataKey="value"
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}