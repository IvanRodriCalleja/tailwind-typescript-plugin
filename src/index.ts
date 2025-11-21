import * as ts from 'typescript/lib/tsserverlibrary';

import { TailwindTypescriptPlugin } from './plugin/TailwindTypescriptPlugin';

/**
 * Main entry point for the TypeScript Language Service Plugin
 *
 * REFACTORED ARCHITECTURE:
 *
 * This plugin now follows Clean Architecture and SOLID principles:
 *
 * 1. Core Layer (src/core/):
 *    - types.ts: Domain types (ClassNameInfo, ExtractionContext, etc.)
 *    - interfaces.ts: Contracts (IClassNameExtractor, IClassNameValidator, etc.)
 *
 * 2. Extractors Layer (src/extractors/):
 *    - BaseExtractor: Abstract base with common functionality
 *    - StringLiteralExtractor: Handles string literals
 *    - TemplateExpressionExtractor: Handles template strings
 *    - ExpressionExtractor: Handles all expression types (ternary, binary, etc.)
 *    - JsxAttributeExtractor: Main orchestrator for JSX className attributes
 *
 * 3. Services Layer (src/services/):
 *    - ClassNameExtractionService: Orchestrates AST traversal and extraction
 *    - DiagnosticService: Creates TypeScript diagnostics
 *    - ValidationService: Validates classes and creates diagnostics
 *    - PluginConfigService: Manages plugin configuration
 *    - PerformanceCache: LRU cache for performance optimization
 *
 * 4. Plugin Layer (src/plugin/):
 *    - TailwindTypescriptPlugin: Thin adapter to TypeScript API
 *
 * 5. Infrastructure Layer:
 *    - TailwindValidator: Validates against Tailwind CSS design system
 *    - Logger: Logging abstraction
 *
 * SOLID PRINCIPLES APPLIED:
 *
 * - Single Responsibility: Each class has one clear purpose
 * - Open/Closed: Easy to add new extractors without modifying existing code
 * - Liskov Substitution: All extractors implement the same interface
 * - Interface Segregation: Small, focused interfaces
 * - Dependency Inversion: Depends on abstractions (IClassNameValidator, etc.)
 *
 * EXTENSIBILITY:
 *
 * To add a new extraction pattern:
 * 1. Create a new extractor class extending BaseExtractor
 * 2. Implement canHandle() and extract() methods
 * 3. Add it to ClassNameExtractionService.extractors array
 *
 * To use the TypeScript type checker:
 * The type checker is obtained fresh for each file validation from the current program.
 * It's available in the ExtractionContext passed to extractors for type-based features.
 *
 * PERFORMANCE OPTIMIZATIONS:
 *
 * - LRU cache for validation results (2000 entries)
 * - Lazy initialization of design system
 * - Fresh type checker per-file (always accurate, no staleness)
 * - Fast path for static class validation
 */
export = (mod: { typescript: typeof ts }) => new TailwindTypescriptPlugin(mod.typescript);
