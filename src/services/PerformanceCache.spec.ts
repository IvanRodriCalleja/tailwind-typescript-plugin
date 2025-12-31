import { PerformanceCache } from './PerformanceCache';

describe('PerformanceCache', () => {
	describe('basic operations', () => {
		it('should return undefined for uncached keys', () => {
			const cache = new PerformanceCache<string, boolean>();

			expect(cache.get('uncached')).toBeUndefined();
		});

		it('should cache and retrieve values', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('key', true);

			expect(cache.get('key')).toBe(true);
		});

		it('should overwrite existing values', () => {
			const cache = new PerformanceCache<string, number>();
			cache.set('key', 1);
			cache.set('key', 2);

			expect(cache.get('key')).toBe(2);
		});

		it('should handle different value types', () => {
			const cache = new PerformanceCache<string, object>();
			const obj = { foo: 'bar' };
			cache.set('key', obj);

			expect(cache.get('key')).toBe(obj);
		});
	});

	describe('has', () => {
		it('should return false for uncached keys', () => {
			const cache = new PerformanceCache<string, boolean>();

			expect(cache.has('uncached')).toBe(false);
		});

		it('should return true for cached keys', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('key', true);

			expect(cache.has('key')).toBe(true);
		});
	});

	describe('size', () => {
		it('should start at 0', () => {
			const cache = new PerformanceCache<string, boolean>();

			expect(cache.size).toBe(0);
		});

		it('should increase when adding items', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('key1', true);
			cache.set('key2', false);

			expect(cache.size).toBe(2);
		});

		it('should not increase when overwriting', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('key', true);
			cache.set('key', false);

			expect(cache.size).toBe(1);
		});
	});

	describe('clear', () => {
		it('should remove all entries', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('key1', true);
			cache.set('key2', false);

			cache.clear();

			expect(cache.size).toBe(0);
			expect(cache.get('key1')).toBeUndefined();
			expect(cache.get('key2')).toBeUndefined();
		});
	});

	describe('LRU eviction', () => {
		it('should evict oldest entry when at capacity', () => {
			const cache = new PerformanceCache<string, number>(3);
			cache.set('first', 1);
			cache.set('second', 2);
			cache.set('third', 3);

			// Cache is full, adding fourth should evict 'first'
			cache.set('fourth', 4);

			expect(cache.get('first')).toBeUndefined();
			expect(cache.get('second')).toBe(2);
			expect(cache.get('third')).toBe(3);
			expect(cache.get('fourth')).toBe(4);
		});

		it('should move accessed entries to end (most recently used)', () => {
			const cache = new PerformanceCache<string, number>(3);
			cache.set('first', 1);
			cache.set('second', 2);
			cache.set('third', 3);

			// Access 'first' to make it most recently used
			cache.get('first');

			// Adding fourth should now evict 'second'
			cache.set('fourth', 4);

			expect(cache.get('first')).toBe(1);
			expect(cache.get('second')).toBeUndefined();
			expect(cache.get('third')).toBe(3);
			expect(cache.get('fourth')).toBe(4);
		});

		it('should handle size of 1', () => {
			const cache = new PerformanceCache<string, number>(1);
			cache.set('first', 1);
			cache.set('second', 2);

			expect(cache.get('first')).toBeUndefined();
			expect(cache.get('second')).toBe(2);
			expect(cache.size).toBe(1);
		});

		it('should not exceed maxSize', () => {
			const cache = new PerformanceCache<string, number>(3);

			for (let i = 0; i < 100; i++) {
				cache.set(`key${i}`, i);
			}

			expect(cache.size).toBe(3);
		});
	});

	describe('default maxSize', () => {
		it('should use default maxSize of 1000', () => {
			const cache = new PerformanceCache<string, boolean>();

			// Add 1001 items
			for (let i = 0; i < 1001; i++) {
				cache.set(`key${i}`, true);
			}

			// Should have evicted the first one
			expect(cache.size).toBe(1000);
			expect(cache.get('key0')).toBeUndefined();
			expect(cache.get('key1000')).toBe(true);
		});
	});

	describe('different key types', () => {
		it('should work with number keys', () => {
			const cache = new PerformanceCache<number, string>();
			cache.set(1, 'one');
			cache.set(2, 'two');

			expect(cache.get(1)).toBe('one');
			expect(cache.get(2)).toBe('two');
		});

		it('should work with object keys', () => {
			const cache = new PerformanceCache<object, string>();
			const key1 = { id: 1 };
			const key2 = { id: 2 };

			cache.set(key1, 'first');
			cache.set(key2, 'second');

			expect(cache.get(key1)).toBe('first');
			expect(cache.get(key2)).toBe('second');
		});
	});

	describe('edge cases', () => {
		it('should handle null values', () => {
			const cache = new PerformanceCache<string, null>();
			cache.set('key', null);

			expect(cache.get('key')).toBeNull();
			expect(cache.has('key')).toBe(true);
		});

		it('should handle undefined values', () => {
			const cache = new PerformanceCache<string, undefined>();
			cache.set('key', undefined);

			// Note: get returns undefined both for missing and stored undefined
			// has() is the way to distinguish
			expect(cache.has('key')).toBe(true);
		});

		it('should handle empty string keys', () => {
			const cache = new PerformanceCache<string, boolean>();
			cache.set('', true);

			expect(cache.get('')).toBe(true);
		});

		it('should handle 0 as key', () => {
			const cache = new PerformanceCache<number, string>();
			cache.set(0, 'zero');

			expect(cache.get(0)).toBe('zero');
		});
	});
});
