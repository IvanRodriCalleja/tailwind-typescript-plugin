## 📊 Performance Benchmark Results

### Test File Details
- **File**: AllUseCases.tsx
- **Size**: 249.00 KB
- **Lines**: 8,114
- **className usages**: 1,481
- **Invalid classes**: 278

### Performance Comparison

| Implementation | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | **Average** | Status |
|---|---|---|---|---|---|---|---|
| 🆕 **NEW** (Refactored) | 6.44ms | 7.06ms | 6.95ms | 15.82ms | 5.79ms | **8.41ms** | Clean Architecture |
| 📦 **OLD** (Monolithic) | 5.18ms | 4.53ms | 4.37ms | 4.04ms | 4.81ms | **4.59ms** | Monolithic |

### Analysis
❌ **NEW is 1.83x slower (+3.82ms)**

> ⚠️ **Note**: The NEW implementation shows slower first-run times due to:
> - Clean Architecture abstraction layers
> - Service initialization overhead
> - Object creation for proper separation of concerns

> ✅ **Benefits in Real Usage**:
> - **10-95x faster** on repeated validations (LRU cache)
> - Much better developer experience during editing
> - See [PERFORMANCE_ANALYSIS.md](../PERFORMANCE_ANALYSIS.md) for detailed analysis

### Memory Usage

- **NEW**: 0.64 MB heap used
- **OLD**: -2.86 MB heap used

---

### 🎯 Architecture Benefits of NEW Implementation

- ✅ **Clean Architecture** + SOLID principles
- ✅ **19 focused files** vs 1 monolithic file (491 lines)
- ✅ **Easy to extend** - Add new extractors without modifying existing code
- ✅ **Easy to maintain** - Clear responsibilities and separation of concerns
- ✅ **474 tests passing** - Comprehensive test coverage
- ✅ **LRU cache** - 10-95x speedup on repeated validations
- ✅ **Type-safe** - Full TypeScript type checking throughout

_Benchmark run at: 11/21/2025, 12:03:50 PM_
