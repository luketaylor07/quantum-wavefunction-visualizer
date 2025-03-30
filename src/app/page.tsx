"use client";

import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    ChartData
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const NUM_POINTS = 200;

const calculatePsi = (x: number, n: number, L: number, normalized: boolean): number => {
    if (x < 0 || x > L || L <= 0) return 0;
    const factor = normalized ? Math.sqrt(2 / L) : 1;
    return factor * Math.sin((n * Math.PI * x) / L);
};

const calculateProbDensity = (psiValue: number): number => {
    return psiValue * psiValue;
};

export default function QuantumVisualizerPage() {
    const [quantumNumberN, setQuantumNumberN] = useState<number>(1);
    const [boxLengthL, setBoxLengthL] = useState<number>(1.0);
    const [applyNormalization, setApplyNormalization] = useState<boolean>(false);

    const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value) && value > 0) {
            setBoxLengthL(value);
        } else if (event.target.value === '') {

        }
    };

    const handleLengthBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (isNaN(value) || value <= 0) {
            setBoxLengthL(1.0);
        }
    };

    const chartData = useMemo((): ChartData<'line'> => {
        const L = boxLengthL > 0 ? boxLengthL : 1.0;
        const xValues = Array.from({ length: NUM_POINTS + 1 }, (_, i) => (i * L) / NUM_POINTS);
        const psiValues = xValues.map(x => calculatePsi(x, quantumNumberN, L, applyNormalization));
        const probDensityValues = psiValues.map(calculateProbDensity);

        const labels = xValues.map(x => x.toFixed(3));

        return {
            labels: labels,
            datasets: [
                {
                    label: `Wave Pattern (n=${quantumNumberN}, L=${L.toFixed(2)}${applyNormalization ? ', Scaled' : ''})`,
                    data: psiValues,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 2,
                    yAxisID: 'yPsi',
                },
                {
                    label: `Probability Distribution (n=${quantumNumberN}, L=${L.toFixed(2)}${applyNormalization ? ', Scaled' : ''})`,
                    data: probDensityValues,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.3)',
                    tension: 0.1,
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: true,
                    yAxisID: 'yProb',
                },
            ],
        };
    }, [quantumNumberN, boxLengthL, applyNormalization]);

    const chartOptions = useMemo((): ChartOptions<'line'> => {
        const L = boxLengthL > 0 ? boxLengthL : 1.0;
        let maxPsiAbs = 1.1;
        let maxProb = 1.1;

        if (applyNormalization && L > 0) {
            maxPsiAbs = Math.sqrt(2 / L) * 1.1;
            maxProb = (2 / L) * 1.1;
        }

        const yPsiTitle = applyNormalization ? 'Wave Pattern (Scaled)' : 'Wave Pattern';
        const yProbTitle = applyNormalization ? 'Probability Distribution (Scaled)' : 'Probability Distribution';

        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            interaction: {
                mode: 'index' as const,
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: `Particle in a Box (Length=${L.toFixed(2)}) - Energy Level ${quantumNumberN}`,
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            if (tooltipItems.length > 0) {
                                const index = tooltipItems[0].dataIndex;
                                const xVal = (index * L) / NUM_POINTS;
                                return `x = ${xVal.toFixed(4)}`;
                            }
                            return '';
                        },
                        label: function (context) {
                            let label = context.dataset.label?.split(' (')[0] || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(4);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Position (x)',
                    },
                    min: 0,
                    max: L,
                    ticks: {
                        stepSize: L / 10,
                        callback: function (value) {

                            const numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
                            return numericValue.toFixed(2);
                        }
                    }
                },
                yPsi: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    min: -maxPsiAbs,
                    max: maxPsiAbs,
                    title: {
                        display: true,
                        text: yPsiTitle,
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                yProb: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    min: 0,
                    max: maxProb,
                    title: {
                        display: true,
                        text: yProbTitle,
                    },
                    grid: {
                        drawOnChartArea: true,
                    }
                },
            },
        };
    }, [boxLengthL, applyNormalization, quantumNumberN]);

    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 bg-gray-50">
            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
                    Wave Pattern Visualizer for Quantum Particles
                </h1>
                <p className="mb-6 text-center text-gray-600">
                    Interactive visualization of the wave pattern (Ψ) and probability distribution (|Ψ|²) for a particle trapped in a one-dimensional box.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
                    <div className="flex flex-col items-center space-y-2">
                        <label htmlFor="quantumNumber" className="block text-lg font-medium text-gray-700">
                            Quantum Number (n): {quantumNumberN}
                        </label>
                        <input
                            type="range"
                            id="quantumNumber"
                            min="1"
                            max="10"
                            step="1"
                            value={quantumNumberN}
                            onChange={(e) => setQuantumNumberN(parseInt(e.target.value, 10))}
                            className="w-full max-w-xs h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs text-gray-500">(1 to 10)</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <label htmlFor="boxLength" className="block text-lg font-medium text-gray-700">
                            Box Length (L)
                        </label>
                        <input
                            type="number"
                            id="boxLength"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={boxLengthL}
                            onChange={handleLengthChange}
                            onBlur={handleLengthBlur}
                            className="w-full max-w-xs px-3 py-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center"
                        />
                        <span className="text-xs text-gray-500">(e.g., 0.1 to 10)</span>
                    </div>

                    <div className="flex flex-col items-center space-y-2 pt-2 md:pt-8">
                        <label htmlFor="normalize" className="flex items-center space-x-2 text-lg font-medium text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                id="normalize"
                                checked={applyNormalization}
                                onChange={(e) => setApplyNormalization(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span>Normalize</span>
                        </label>
                        <span className="text-xs text-gray-500">(Apply √2/L factor)</span>
                    </div>
                </div>

                <div className="relative h-[45vh] md:h-[55vh] w-full border border-gray-200 rounded mt-4">
                    {chartData && chartOptions ? (
                        <Line options={chartOptions} data={chartData} />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">Loading Chart...</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>
                        Wave Pattern = {applyNormalization ? "√(2/L) × " : ""}sin(n×π×x/L) when x is between 0 and L
                    </p>
                    <p>
                        Probability Distribution = {applyNormalization ? "(2/L) × " : ""}sin²(n×π×x/L) when x is between 0 and L
                    </p>
                </div>
            </div>
        </main>
    );
}