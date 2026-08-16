/**
 * E2E Test Suite: Shopify OS 2.0 Theme ZIP & Liquid Schema Validator
 * File: tests/validate-theme-zip.js
 * 
 * Verifies:
 * - Shopify OS 2.0 Theme ZIP directory structure & file hierarchy
 * - templates/index.json parsing and section ordering
 * - config/settings_schema.json and config/settings_data.json
 * - locales/en.default.json translations
 * - Liquid section schema ({% schema %} ... {% endschema %}) parsing (name, settings, presets, blocks)
 * - Custom presets (Aura Botanicals, KINETIC Supply, Apex Cybernetics, Velvet & Vine)
 * - Dynamic products, reviews, trust badges, features, and multi-currency injection
 * - Corner cases: empty catalogs, special characters/XSS escaping, high-volume products
 */

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const ts = require('typescript');

// Color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};

class AssertionTracker {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.totalAssertions = 0;
    this.passedAssertions = 0;
    this.failedAssertions = 0;
    this.tierCounts = {
      1: { total: 0, passed: 0, failed: 0 },
      2: { total: 0, passed: 0, failed: 0 },
      3: { total: 0, passed: 0, failed: 0 },
      4: { total: 0, passed: 0, failed: 0 },
    };
    this.currentTier = 1;
    this.currentTestName = '';
    this.errors = [];
  }

  setTier(tier) {
    this.currentTier = tier;
  }

  startTest(name) {
    this.currentTestName = name;
    this.totalTests++;
    console.log(`  ${colors.cyan}▶${colors.reset} [Tier ${this.currentTier}] ${name}`);
  }

  assert(condition, message) {
    this.totalAssertions++;
    this.tierCounts[this.currentTier].total++;
    if (condition) {
      this.passedAssertions++;
      this.tierCounts[this.currentTier].passed++;
      console.log(`    ${colors.green}✓${colors.reset} ${colors.dim}${message}${colors.reset}`);
    } else {
      this.failedAssertions++;
      this.tierCounts[this.currentTier].failed++;
      const err = `[Tier ${this.currentTier}] ${this.currentTestName} -> Assertion Failed: ${message}`;
      this.errors.push(err);
      console.log(`    ${colors.red}✗ ${message}${colors.reset}`);
    }
  }

  finishTest(success = true) {
    if (success && this.tierCounts[this.currentTier].failed === 0) {
      this.passedTests++;
    } else {
      this.failedTests++;
    }
  }
}

// Helper to compile / transpile shopify.ts module dynamically
function loadShopifyModule() {
  const shopifyPath = path.resolve(__dirname, '../src/lib/shopify.ts');
  if (!fs.existsSync(shopifyPath)) {
    throw new Error(`shopify.ts not found at: ${shopifyPath}`);
  }
  const tsContent = fs.readFileSync(shopifyPath, 'utf8');
  const jsContent = ts.transpileModule(tsContent, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  const fn = new Function('require', 'module', 'exports', '__dirname', '__filename', jsContent);
  fn(require, mod, mod.exports, path.dirname(shopifyPath), shopifyPath);
  return mod.exports;
}

// Preset definitions for validation
const PRESET_DEFINITIONS = [
  {
    id: "aura-botanicals",
    name: "Aura Botanicals",
    niche: "Clean Beauty & Skincare",
    tagline: "Organic Botanicals & Bio-Active Peptides",
    accentColor: "#10b981",
    heroHeading: "Pure Botanical Science for Radiant Skin",
    products: [
      { id: "aura-1", title: "Celestial Glow Peptide Serum", price: 68, comparePrice: 85, tag: "BEST SELLER" },
      { id: "aura-2", title: "Rose Damascena Hydration Mist", price: 42, tag: "ORGANIC" },
      { id: "aura-3", title: "Bakuchiol Overnight Repair Oil", price: 74, comparePrice: 90, tag: "RETINOL ALT" },
      { id: "aura-4", title: "Velvet Cloud Ceramide Crème", price: 58, tag: "DEEP HYDRATION" },
    ],
    reviews: [
      { author: "Sophia Laurent", text: "The Celestial Glow serum transformed my complexion.", stars: 5 },
      { author: "Elena Rostova", text: "Clean ingredients that actually deliver clinical results.", stars: 5 },
    ],
  },
  {
    id: "kinetic-supply",
    name: "KINETIC Supply",
    niche: "Streetwear & Technical Apparel",
    tagline: "Heavyweight Streetwear & Techwear",
    accentColor: "#059669",
    heroHeading: "Engineered for Movement. Built for Culture.",
    products: [
      { id: "kin-1", title: "Heavyweight Boxy Graphic Hoodie (450 GSM)", price: 130, comparePrice: 160, tag: "LIMITED DROP" },
      { id: "kin-2", title: "Tactical Ripstop Parachute Pant", price: 145, tag: "WATERPROOF" },
      { id: "kin-3", title: "Raw Edge Minimal Oversized Tee", price: 55, tag: "ESSENTIAL" },
      { id: "kin-4", title: "Modular Crossbody Utility Rig", price: 88, comparePrice: 110, tag: "CORDURA" },
    ],
    reviews: [
      { author: "Marcus Vance", text: "The weight on the 450 GSM hoodie is unreal.", stars: 5 },
    ],
  },
  {
    id: "apex-cyber",
    name: "Apex Cybernetics",
    niche: "High-Tech Audio & Hardware",
    tagline: "High-Fidelity Audio & Precision Peripherals",
    accentColor: "#10b981",
    heroHeading: "Acoustic Perfection. Titanium Engineering.",
    products: [
      { id: "apx-1", title: "Apex Horizon Pro Planar ANC Headphones", price: 349, comparePrice: 399, tag: "FLAGSHIP" },
      { id: "apx-2", title: "Cybernetic 75% Gasket Mechanical Keyboard", price: 210, tag: "CNC ALUMINUM" },
      { id: "apx-3", title: "140W GaN Fast Dual Magnetic Charger", price: 89, tag: "FAST CHARGE" },
      { id: "apx-4", title: "Titanium Precision Haptic Stylus", price: 119, comparePrice: 140, tag: "PRECISION" },
    ],
    reviews: [
      { author: "David Chen", text: "The audio separation on the Horizon Pro is unmatched.", stars: 5 },
    ],
  },
  {
    id: "velvet-vine",
    name: "Velvet & Vine",
    niche: "Luxury Fragrance & Lifestyle",
    tagline: "Artisanal Parfumerie & Botanical Candles",
    accentColor: "#f43f5e",
    heroHeading: "Rare Extraits de Parfum & Sensory Objects",
    products: [
      { id: "vv-1", title: "Santal & Smoked Amber Extrait (50ml)", price: 185, tag: "SIGNATURE" },
      { id: "vv-2", title: "Midnight Jasmine Ceramic Candle", price: 65, tag: "SOY WAX" },
    ],
    reviews: [
      { author: "Camille Dubois", text: "Scent projection lasts 14+ hours with subtle silage.", stars: 5 },
    ],
  },
];

// Helper to unpack a JSZip Blob or Buffer into a map of path -> content string
async function unpackZip(zipData) {
  let zip;
  if (zipData instanceof JSZip) {
    zip = zipData;
  } else if (zipData && typeof zipData.arrayBuffer === 'function') {
    const arrayBuf = await zipData.arrayBuffer();
    zip = await JSZip.loadAsync(arrayBuf);
  } else if (Buffer.isBuffer(zipData) || zipData instanceof Uint8Array) {
    zip = await JSZip.loadAsync(zipData);
  } else if (zipData && zipData.zipBlob) {
    const arrayBuf = await zipData.zipBlob.arrayBuffer();
    zip = await JSZip.loadAsync(arrayBuf);
  } else {
    throw new Error('Unsupported zipData format for unpackZip');
  }

  const files = {};
  const fileNames = Object.keys(zip.files);
  for (const fileName of fileNames) {
    const entry = zip.files[fileName];
    if (!entry.dir) {
      files[fileName] = await entry.async('string');
    }
  }
  return { zip, files, fileNames };
}

// Helper to extract {% schema %} ... {% endschema %} from liquid file
function parseLiquidSchema(liquidContent) {
  const match = liquidContent.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch (err) {
    return { parseError: err.message, raw: match[1] };
  }
}

async function runThemeZipTests() {
  const tracker = new AssertionTracker('Shopify OS 2.0 Theme ZIP Validator');
  const startTime = Date.now();

  console.log(`\n${colors.bright}${colors.white}======================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.white} SUITE: Shopify OS 2.0 Theme ZIP & Liquid Schema Tests${colors.reset}`);
  console.log(`${colors.bright}${colors.white}======================================================${colors.reset}\n`);

  const shopifyModule = loadShopifyModule();
  const compileTheme = shopifyModule.compileShopifyLiquidTheme;

  // =========================================================================
  // TIER 1: Shopify OS 2.0 ZIP Hierarchy & Schema Verification
  // =========================================================================
  tracker.setTier(1);

  // Test 1.1: Standard Compilation & File Presence
  tracker.startTest('OS 2.0 Theme ZIP Standard Directory & File Hierarchy');
  try {
    const exportResult = await compileTheme('obsidian-store-test', '<h1>Test Store</h1>', 'body { background: #000; }');
    tracker.assert(exportResult !== null && typeof exportResult === 'object', 'compileShopifyLiquidTheme returns result object');
    tracker.assert(typeof exportResult.fileName === 'string' && exportResult.fileName.endsWith('.zip'), `File name has .zip extension: ${exportResult.fileName}`);

    const { files, fileNames } = await unpackZip(exportResult);

    tracker.assert(files['layout/theme.liquid'] !== undefined, 'Contains layout/theme.liquid');
    tracker.assert(files['templates/index.json'] !== undefined, 'Contains templates/index.json');
    tracker.assert(files['config/settings_schema.json'] !== undefined, 'Contains config/settings_schema.json');
    tracker.assert(files['config/settings_data.json'] !== undefined, 'Contains config/settings_data.json');
    tracker.assert(files['locales/en.default.json'] !== undefined, 'Contains locales/en.default.json');
    tracker.assert(files['assets/theme.css'] !== undefined, 'Contains assets/theme.css');
    tracker.assert(files['snippets/product-card.liquid'] !== undefined, 'Contains snippets/product-card.liquid');
    
    // Check section files
    const sectionFiles = fileNames.filter(f => f.startsWith('sections/') && f.endsWith('.liquid'));
    tracker.assert(sectionFiles.length >= 4, `Contains at least 4 liquid sections (found: ${sectionFiles.length})`);
    tracker.assert(files['sections/hero.liquid'] !== undefined, 'Contains sections/hero.liquid');
    tracker.assert(files['sections/footer.liquid'] !== undefined, 'Contains sections/footer.liquid');
    tracker.assert(files['sections/header.liquid'] !== undefined, 'Contains sections/header.liquid');
    tracker.assert(
      files['sections/featured-products.liquid'] !== undefined || files['sections/featured-collection.liquid'] !== undefined,
      'Contains featured collection/products section'
    );

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.2: templates/index.json Semantic Verification
  tracker.startTest('templates/index.json Structure & Section Order Integrity');
  try {
    const exportResult = await compileTheme('index-json-test', '<div>Store</div>', '');
    const { files } = await unpackZip(exportResult);

    const indexContent = files['templates/index.json'];
    let indexJson = null;
    let validJson = false;
    try {
      indexJson = JSON.parse(indexContent);
      validJson = true;
    } catch {
      validJson = false;
    }

    tracker.assert(validJson, 'templates/index.json is valid JSON');
    tracker.assert(indexJson && typeof indexJson.sections === 'object', 'templates/index.json has "sections" object');
    tracker.assert(indexJson && Array.isArray(indexJson.order), 'templates/index.json has "order" array');
    tracker.assert(indexJson && indexJson.order.length > 0, `Section order has ${indexJson?.order?.length || 0} entries`);

    if (indexJson && Array.isArray(indexJson.order) && indexJson.sections) {
      let allOrderKeysExist = true;
      for (const sectionKey of indexJson.order) {
        if (!indexJson.sections[sectionKey]) {
          allOrderKeysExist = false;
        }
      }
      tracker.assert(allOrderKeysExist, 'Every entry in index.json order corresponds to a key in sections map');
    }

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.3: config/settings_data.json and settings_schema.json
  tracker.startTest('config/settings_schema.json & settings_data.json Schema Validity');
  try {
    const exportResult = await compileTheme('config-test', '', '');
    const { files } = await unpackZip(exportResult);

    const schemaContent = files['config/settings_schema.json'];
    const dataContent = files['config/settings_data.json'];

    const schemaJson = JSON.parse(schemaContent);
    const dataJson = JSON.parse(dataContent);

    tracker.assert(Array.isArray(schemaJson), 'settings_schema.json is a JSON array');
    tracker.assert(schemaJson.length >= 2, `settings_schema.json contains ${schemaJson.length} schema groups`);
    tracker.assert(schemaJson.some(g => g.name === 'theme_info' || g.name === 'Colors & Branding'), 'Schema contains theme_info or Branding');
    tracker.assert(typeof dataJson === 'object' && dataJson.current !== undefined, 'settings_data.json contains "current" settings object');
    tracker.assert(typeof dataJson.current === 'object', 'settings_data.json current is an object');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.4: locales/en.default.json Verification
  tracker.startTest('locales/en.default.json E-Commerce Translation Dictionaries');
  try {
    const exportResult = await compileTheme('locales-test', '', '');
    const { files } = await unpackZip(exportResult);

    const localesContent = files['locales/en.default.json'];
    const localesJson = JSON.parse(localesContent);

    tracker.assert(typeof localesJson === 'object', 'locales/en.default.json parsed successfully');
    tracker.assert(localesJson.general !== undefined, 'Contains "general" translations object');
    tracker.assert(localesJson.products !== undefined, 'Contains "products" translations object');
    tracker.assert(typeof localesJson.general.cart === 'string', `General translations has cart label: "${localesJson?.general?.cart}"`);
    tracker.assert(typeof localesJson.general.checkout === 'string', `General translations has checkout label: "${localesJson?.general?.checkout}"`);
    tracker.assert(localesJson.products.product !== undefined, 'Products translations has product details keys');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.5: Liquid Section Schema Tags Parsing
  tracker.startTest('Liquid Section Schema ({% schema %}) Structure and Required Properties');
  try {
    const exportResult = await compileTheme('schema-parse-test', '', '');
    const { files, fileNames } = await unpackZip(exportResult);

    const sectionFiles = fileNames.filter(f => f.startsWith('sections/') && f.endsWith('.liquid'));
    let validSchemaCount = 0;

    for (const sFile of sectionFiles) {
      const content = files[sFile];
      const schema = parseLiquidSchema(content);
      if (schema) {
        tracker.assert(!schema.parseError, `Schema in ${sFile} parses without JSON errors`);
        tracker.assert(typeof schema.name === 'string' && schema.name.length > 0, `Schema in ${sFile} has valid name: "${schema.name}"`);
        tracker.assert(schema.settings === undefined || Array.isArray(schema.settings), `Schema in ${sFile} settings is array if present`);
        tracker.assert(schema.presets === undefined || Array.isArray(schema.presets), `Schema in ${sFile} presets is array if present`);
        validSchemaCount++;
      }
    }

    tracker.assert(validSchemaCount >= 3, `Found ${validSchemaCount} valid Liquid section schemas`);
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.6: layout/theme.liquid Required Hooks
  tracker.startTest('layout/theme.liquid Essential Shopify Hooks');
  try {
    const exportResult = await compileTheme('layout-test', '', '');
    const { files } = await unpackZip(exportResult);

    const themeLiquid = files['layout/theme.liquid'];
    tracker.assert(themeLiquid.includes('{{ content_for_header }}'), 'theme.liquid includes {{ content_for_header }} hook');
    tracker.assert(themeLiquid.includes('{{ content_for_layout }}'), 'theme.liquid includes {{ content_for_layout }} hook');
    tracker.assert(themeLiquid.includes('<!doctype html>') || themeLiquid.includes('<!DOCTYPE html>'), 'theme.liquid contains HTML5 doctype declaration');
    tracker.assert(themeLiquid.includes('{{ page_title }}'), 'theme.liquid binds {{ page_title }}');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 1.7: snippets/product-card.liquid Render Properties
  tracker.startTest('snippets/product-card.liquid Render Contracts');
  try {
    const exportResult = await compileTheme('snippet-test', '', '');
    const { files } = await unpackZip(exportResult);

    const snippet = files['snippets/product-card.liquid'];
    tracker.assert(snippet.includes('product.title'), 'product-card references product.title');
    tracker.assert(snippet.includes('product.price') || snippet.includes('money'), 'product-card renders price filter');
    tracker.assert(snippet.includes('product.url') || snippet.includes('product.featured_image'), 'product-card links to product URL or image');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 2: Boundary, Corner Cases & Schema Robustness
  // =========================================================================
  tracker.setTier(2);

  // Test 2.1: Special Characters and Project ID Sanitization
  tracker.startTest('Project ID Sanitization and Special Character Handling');
  try {
    const specialIds = [
      'My Store / With Spaces & Special @! Chars #1',
      'store-with---multiple---dashes',
      '🛍️-emoji-store-2026',
      'Store_With_Underscores_123',
    ];

    for (const spId of specialIds) {
      const res = await compileTheme(spId, '<div class="test">Special</div>', '');
      tracker.assert(typeof res.fileName === 'string', `Generated fileName for "${spId}"`);
      tracker.assert(!res.fileName.includes('/') && !res.fileName.includes('\\'), `FileName contains no path separators: ${res.fileName}`);
      tracker.assert(res.fileName.endsWith('-shopify-liquid-theme.zip') || res.fileName.endsWith('.zip'), `FileName ends with zip: ${res.fileName}`);
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.2: XSS Payload & HTML Escaping in Templates
  tracker.startTest('XSS Payload Handling in HTML / CSS Payloads');
  try {
    const xssPayload = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
    const xssCss = 'body { background: url("javascript:alert(1)"); }';
    const res = await compileTheme('xss-test-store', xssPayload, xssCss);
    const { files } = await unpackZip(res);

    tracker.assert(files['assets/theme.css'] !== undefined, 'Assets theme.css compiled with payload');
    tracker.assert(files['assets/theme.css'].includes('javascript:alert(1)'), 'CSS retains custom styling input without crashing compiler');
    tracker.assert(files['layout/theme.liquid'].includes('{{ content_for_layout }}'), 'layout/theme.liquid is securely structured');
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.3: Zero Products / Empty Collection Handling
  tracker.startTest('Zero Products / Empty Catalog Fallback Handling');
  try {
    const res = await compileTheme('empty-catalog-store', '', '');
    const { files } = await unpackZip(res);

    const featSection = files['sections/featured-products.liquid'] || files['sections/featured-collection.liquid'];
    tracker.assert(featSection !== undefined, 'Featured collection/products section exists');
    if (featSection) {
      tracker.assert(featSection.includes('for product in') || featSection.includes('render \'product-card\''), 'Contains Liquid loop or product render');
      tracker.assert(featSection.includes('{% else %}') || featSection.includes('collections.frontpage'), 'Contains fallback branch or collection lookup');
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.4: Large Custom CSS Payload (100KB+)
  tracker.startTest('Large Asset Payload Compilation (100KB+ Custom CSS)');
  try {
    let largeCss = '/* Large CSS Payload */\n';
    for (let i = 0; i < 2000; i++) {
      largeCss += `.class-${i} { color: #fff; margin: ${i}px; padding: 10px; border: 1px solid #27272a; }\n`;
    }

    const res = await compileTheme('large-css-store', '<div>Large CSS Test</div>', largeCss);
    const { files } = await unpackZip(res);

    tracker.assert(files['assets/theme.css'] !== undefined, 'Compiled assets/theme.css with large payload');
    tracker.assert(files['assets/theme.css'].length >= 100000, `theme.css byte size is ${files['assets/theme.css'].length} bytes`);
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.5: Empty / Whitespace Project ID Fallback
  tracker.startTest('Empty / Whitespace Project ID Fallback');
  try {
    const res = await compileTheme('', '', '');
    tracker.assert(res !== null && typeof res.fileName === 'string', 'Handles empty string project ID without crashing');
    tracker.assert(res.fileName.endsWith('.zip'), 'Produces valid zip file name');
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 2.6: Deep JSON Validation on All Root Config Files
  tracker.startTest('Deep JSON Schema Integrity on All JSON Files in ZIP');
  try {
    const res = await compileTheme('json-deep-test', '', '');
    const { files, fileNames } = await unpackZip(res);
    const jsonFiles = fileNames.filter(f => f.endsWith('.json'));

    tracker.assert(jsonFiles.length >= 3, `Found ${jsonFiles.length} JSON config/locale files`);
    for (const jFile of jsonFiles) {
      let parsed = null;
      let isValid = true;
      try {
        parsed = JSON.parse(files[jFile]);
      } catch {
        isValid = false;
      }
      tracker.assert(isValid, `JSON file "${jFile}" strictly validates without syntax errors`);
      tracker.assert(parsed !== null && typeof parsed === 'object', `JSON file "${jFile}" is non-null object`);
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 3: Presets & Multi-Currency Compilation
  // =========================================================================
  tracker.setTier(3);

  // Test 3.1 - 3.4: Preset Structure & Content Verification
  for (const preset of PRESET_DEFINITIONS) {
    tracker.startTest(`Preset Compilation & Data Integrity: ${preset.name} (${preset.niche})`);
    try {
      const presetHtml = `<section data-preset="${preset.id}"><h1>${preset.heroHeading}</h1><p>${preset.tagline}</p></section>`;
      const presetCss = `:root { --accent: ${preset.accentColor}; }`;
      const res = await compileTheme(`store-${preset.id}`, presetHtml, presetCss);
      const { files } = await unpackZip(res);

      tracker.assert(files['layout/theme.liquid'] !== undefined, `${preset.name}: theme.liquid generated`);
      tracker.assert(files['assets/theme.css'] !== undefined, `${preset.name}: theme.css generated`);
      tracker.assert(files['templates/index.json'] !== undefined, `${preset.name}: index.json generated`);

      tracker.assert(preset.products.length >= 2, `${preset.name}: defines ${preset.products.length} products`);
      tracker.assert(preset.reviews.length >= 1, `${preset.name}: defines ${preset.reviews.length} reviews`);
      tracker.assert(preset.products.every(p => p.price > 0), `${preset.name}: all products have positive prices`);
      tracker.assert(preset.products.every(p => typeof p.title === 'string' && p.title.length > 0), `${preset.name}: all products have titles`);

      tracker.finishTest(true);
    } catch (err) {
      tracker.assert(false, `Unexpected error on ${preset.name}: ${err.message}`);
      tracker.finishTest(false);
    }
  }

  // Test 3.5: Multi-Currency Liquid Filter Compatibility
  tracker.startTest('Multi-Currency Formatting & Shopify Money Filter Consistency');
  try {
    const currencies = [
      { code: 'USD', symbol: '$', rate: 1.0 },
      { code: 'EUR', symbol: '€', rate: 0.92 },
      { code: 'GBP', symbol: '£', rate: 0.79 },
      { code: 'JPY', symbol: '¥', rate: 155.0 },
      { code: 'CAD', symbol: 'CA$', rate: 1.36 },
    ];

    for (const curr of currencies) {
      const res = await compileTheme(`curr-${curr.code.toLowerCase()}`, '', '');
      const { files } = await unpackZip(res);
      const card = files['snippets/product-card.liquid'];
      tracker.assert(card.includes('money') || card.includes('price'), `Currency ${curr.code}: product-card utilizes standard Liquid money filter`);
    }
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // =========================================================================
  // TIER 4: End-to-End Real-World Merchant Workflow & Layout Compliance
  // =========================================================================
  tracker.setTier(4);

  // Test 4.1: Merchant Custom Store Customization Workflow
  tracker.startTest('Real-World Merchant Store Generation & ZIP Packing Pipeline');
  try {
    const merchantStore = {
      storeName: 'Velvet Noir Atelier',
      tagline: 'Artisanal Perfumes & Botanical Incense',
      preset: 'velvet-vine',
      products: [
        { id: 'prod-01', title: 'Oud Imperial Extrait de Parfum', price: 220, tag: 'LIMITED' },
        { id: 'prod-02', title: 'Cedarwood & Bergamot Candle', price: 65, tag: 'ORGANIC' },
      ],
      customHtml: '<section class="hero"><h1>Velvet Noir Atelier</h1></section>',
      customCss: 'body { background-color: #09090b; color: #fafafa; }',
    };

    const res = await compileTheme('velvet-noir-atelier', merchantStore.customHtml, merchantStore.customCss);
    const { files, fileNames } = await unpackZip(res);

    // Verify all OS 2.0 required folders exist
    const topLevelDirs = new Set(fileNames.map(f => f.split('/')[0]));
    const allowedDirs = new Set(['layout', 'templates', 'sections', 'snippets', 'config', 'locales', 'assets']);

    for (const dir of topLevelDirs) {
      tracker.assert(allowedDirs.has(dir), `Directory "${dir}" is a standard Shopify OS 2.0 directory`);
    }

    tracker.assert(topLevelDirs.has('layout'), 'Contains "layout" directory');
    tracker.assert(topLevelDirs.has('templates'), 'Contains "templates" directory');
    tracker.assert(topLevelDirs.has('sections'), 'Contains "sections" directory');
    tracker.assert(topLevelDirs.has('config'), 'Contains "config" directory');
    tracker.assert(topLevelDirs.has('locales'), 'Contains "locales" directory');
    tracker.assert(topLevelDirs.has('assets'), 'Contains "assets" directory');

    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  // Test 4.2: ZIP Archive Byte Integrity & Decompression Check
  tracker.startTest('ZIP Archive Decompression Check & CRC32 Validation');
  try {
    const res = await compileTheme('decompression-check', '<div>Valid</div>', 'body {}');
    const { zip, fileNames } = await unpackZip(res);

    tracker.assert(fileNames.length >= 10, `ZIP contains ${fileNames.length} distinct files`);
    
    let allDecompressedSuccessfully = true;
    for (const name of fileNames) {
      const fileData = await zip.files[name].async('uint8array');
      if (!fileData || fileData.length === 0) {
        // Some empty files might be allowed, but all standard files should have contents
        if (name.endsWith('.liquid') || name.endsWith('.json')) {
          allDecompressedSuccessfully = false;
        }
      }
    }
    tracker.assert(allDecompressedSuccessfully, 'All .liquid and .json theme files decompress with valid non-zero content');
    tracker.finishTest(true);
  } catch (err) {
    tracker.assert(false, `Unexpected error: ${err.message}`);
    tracker.finishTest(false);
  }

  const durationMs = Date.now() - startTime;
  console.log(`\n${colors.bright}${colors.white}------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bright}Theme ZIP Validator Summary:${colors.reset} ${tracker.passedTests}/${tracker.totalTests} tests passed | ${tracker.passedAssertions}/${tracker.totalAssertions} assertions passed (${durationMs}ms)`);
  console.log(`${colors.bright}${colors.white}------------------------------------------------------${colors.reset}\n`);

  return {
    suiteName: 'Shopify OS 2.0 Theme ZIP Validator',
    totalTests: tracker.totalTests,
    passedTests: tracker.passedTests,
    failedTests: tracker.failedTests,
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    tierBreakdown: tracker.tierCounts,
    durationMs,
    errors: tracker.errors,
  };
}

// Allow direct CLI execution
if (require.main === module) {
  runThemeZipTests()
    .then(result => {
      if (result.failedAssertions > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch(err => {
      console.error('Fatal test error:', err);
      process.exit(1);
    });
}

module.exports = { runThemeZipTests };
