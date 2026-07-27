import React, { useState, useEffect } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import type { StatItem } from "../../../types/WikiBlocks";
import "../../../assets/CSS/wiki/WikiComponenets/wikiStatBlock.css";


interface StatBlockProps {
    id: number;
    data: {
        title: string;
        maxValue: number;
        stats: StatItem[];
    };
    onChange?: (newData: { title: string; maxValue: number; stats: StatItem[] }) => void;
    readOnly?: boolean; // Set to true if viewing without edit permissions
    onDelete?: () => void; // Optional delete handler for individual stats
}

export default function StatBlockComponent({ id, data, onChange, readOnly = false, onDelete }: StatBlockProps) {

    const { maxValue = 100, stats = [] } = data;
    const [newStatName, setNewStatName] = useState("");
    const [error, setError] = useState<string | null>(null);


    const updateStats = (newStats: StatItem[]) => {
        if (onChange) {
            onChange({
                title: data.title,
                maxValue,
                stats: newStats,
            });
        }
    };

    // Update Slider Value
    const handleSliderChange = (id: string, newValue: number) => {
        const updated = stats.map((stat) =>
            stat.id === id ? { ...stat, value: newValue } : stat
        );
        updateStats(updated);
    };

    // Update Stat Name Directly
    const handleNameChange = (id: string, newLabel: string) => {
        const updated = stats.map((stat) =>
            stat.id === id ? { ...stat, label: newLabel } : stat
        );
        updateStats(updated);
    };

    // Add Stat (Min 3, Max 10)
    const handleAddStat = () => {
        if (!newStatName.trim()) return;

        if (stats.length >= 10) {
            setError("Maximum 10 stats allowed.");
            return;
        }

        setError(null);
        const newItem: StatItem = {
            id: Date.now().toString(),
            label: newStatName.trim(),
            value: Math.round(maxValue / 2),
        };

        updateStats([...stats, newItem]);
        setNewStatName("");
    };

    // Remove Stat
    const handleRemoveStat = (id: string) => {
        if (stats.length <= 3) {
            setError("Radar chart requires at least 3 stats.");
            return;
        }
        setError(null);
        updateStats(stats.filter((stat) => stat.id !== id));
    };

    return (
        <div className="stat-block-container">
            {/* <h3 className="stat-block-title">S T A T S</h3> */}
            <div className="stat-block-header">
                <input 
                    type="text"
                    className="stat-block-title-input"
                    value={data.title}
                    onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
                    placeholder="Stats Title..."
                    disabled={readOnly}
                />
                <button
                    type="button"
                    onClick={onDelete}
                    className="delete-entry-btn"
                    title="Delete block"
                >
                    🗑️
                </button>
            </div>
            {error && <div className="stat-error">{error}</div>}

            {/* <input 
                type="text"
                className="stat-block-title-input"
                value={data.maxValue}
                onChange={(e) => onChange && onChange({ ...data, maxValue: Number(e.target.value) })}
                placeholder="Max Value..."
                disabled={readOnly}
            /> */}

            <div className="stat-block-content">
                {/* Controls Column */}
                <div className="stat-controls">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-row">
                            <input
                                type="text"
                                className="stat-name-input"
                                value={stat.label}
                                onChange={(e) => handleNameChange(stat.id, e.target.value)}
                                disabled={readOnly}
                            />

                            <span className="colon">:</span>

                            <input
                                type="range"
                                className="stat-slider"
                                min={0}
                                max={maxValue}
                                value={stat.value}
                                onChange={(e) =>
                                    handleSliderChange(stat.id, Number(e.target.value))
                                }
                                disabled={readOnly}
                            />

                            <span className="stat-value">{stat.value}</span>

                            {!readOnly && (
                                <button
                                    type="button"
                                    className="delete-stat-btn"
                                    onClick={() => handleRemoveStat(stat.id)}
                                    disabled={stats.length <= 3}
                                    title="Delete Stat"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}

                    {/* New Stat Input */}
                    {!readOnly && stats.length < 10 && (
                        <div className="add-stat-row">
                            <input
                                type="text"
                                className="new-stat-input"
                                placeholder="New stat..."
                                value={newStatName}
                                onChange={(e) => setNewStatName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddStat()}
                            />
                            <button
                                type="button"
                                className="add-stat-btn"
                                onClick={handleAddStat}
                            >
                                + ADD
                            </button>
                        </div>
                    )}
                </div>

                {/* Dynamic Radar Chart */}
                <div className="stat-chart-container">
                    <div className="stats-max-value-label">
                        Max Value:
                    <input 
                        type="number"
                        className="stat-block-maxValue-input"
                        value={data.maxValue}
                        onChange={(e) => onChange && onChange({ ...data, maxValue: Number(e.target.value) })}
                        placeholder="Max Value..."
                        disabled={readOnly}
                    />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats}>
                            <PolarGrid stroke="#443328" />
                            <PolarAngleAxis
                                dataKey="label"
                                stroke="var(--wikiEdit-statsColor)"
                                tick={{ fill: "var(--wikiEdit-statsColor)", fontSize: 13, fontFamily: "serif" }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, maxValue]}
                                tick={false}
                                axisLine={false}
                            />
                            <Radar
                                name="Stats"
                                dataKey="value"
                                stroke="var(--wikiEdit-statsColor)"
                                fill="var(--wikiEdit-statsColor)"
                                fillOpacity={0.35}
                                isAnimationActive={false}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );



}