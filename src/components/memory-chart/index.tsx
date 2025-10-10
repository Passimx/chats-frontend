import { useMemoryGraph } from './use-memory-graph.hook.ts';
import { useFileSize } from '../../common/hooks/use-file-size.ts';

const MemoryChart = () => {
    const history = useMemoryGraph(2000, 50);
    const usedMB = useFileSize(history[history.length - 1]?.usedMB * 1024 * 1024);

    const width = 400;
    const height = 100;

    if (!history.length) return <div>Memory API не поддерживается</div>;

    const maxUsed = Math.max(...history.map((p) => p.usedMB));

    const points = history
        .map((p, i) => {
            const x = (i / (history.length - 1)) * width;
            const y = height - (p.usedMB / maxUsed) * height;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div>
            <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
                <polyline points={points} fill="none" stroke="#4caf50" strokeWidth={2} />
            </svg>
            <div>Последнее использование: {usedMB}</div>
        </div>
    );
};

export default MemoryChart;
