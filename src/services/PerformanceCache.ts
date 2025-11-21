/**
 * Performance optimization: LRU Cache for validation results
 * Reduces redundant validation calls for the same class names
 */
export class PerformanceCache<K, V> {
	private cache: Map<K, V>;
	private maxSize: number;

	constructor(maxSize: number = 1000) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	get(key: K): V | undefined {
		if (!this.cache.has(key)) {
			return undefined;
		}

		// Move to end (most recently used)
		const value = this.cache.get(key)!;
		this.cache.delete(key);
		this.cache.set(key, value);

		return value;
	}

	set(key: K, value: V): void {
		// Remove oldest if at capacity
		if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey !== undefined) {
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, value);
	}

	has(key: K): boolean {
		return this.cache.has(key);
	}

	clear(): void {
		this.cache.clear();
	}

	get size(): number {
		return this.cache.size;
	}
}
