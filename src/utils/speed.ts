import { performance } from "perf_hooks";

const speed = async <T>(op: Promise<T>): Promise<T & { latency: number }> => {
  const start = performance.now();
  const result = await op;
  const end = performance.now();
  return { ...result, latency: end - start };
};

export default speed;
