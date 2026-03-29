import { ParsedItem } from '@/types';

const NUMBER_WORDS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  'a couple': 2, 'a couple of': 2, 'a few': 3, some: 1,
  'a dozen': 12, 'half a dozen': 6,
};

const UNITS = [
  'can', 'cans', 'box', 'boxes', 'bag', 'bags', 'bottle', 'bottles',
  'jar', 'jars', 'bunch', 'bunches', 'dozen', 'pack', 'packs',
  'lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces',
  'gal', 'gallon', 'gallons', 'qt', 'quart', 'quarts',
  'pint', 'pints', 'cup', 'cups', 'count', 'loaf', 'loaves',
  'head', 'heads', 'clove', 'cloves', 'slice', 'slices',
];

const UNIT_NORMALIZE: Record<string, string> = {
  cans: 'can', boxes: 'box', bags: 'bag', bottles: 'bottle',
  jars: 'jar', bunches: 'bunch', packs: 'pack',
  lbs: 'lb', pound: 'lb', pounds: 'lb',
  ounce: 'oz', ounces: 'oz',
  gallon: 'gal', gallons: 'gal',
  quart: 'qt', quarts: 'qt',
  pints: 'pint', cups: 'cup',
  loaves: 'loaf', heads: 'head', cloves: 'clove', slices: 'slice',
};

function normalizeUnit(u: string): string {
  return UNIT_NORMALIZE[u.toLowerCase()] ?? u.toLowerCase();
}

function splitItems(text: string): string[] {
  // Split on commas, "and", or semicolons
  return text
    .split(/,\s*|\s+and\s+|;\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseQuantity(text: string): { quantity: number; unit: string | null; name: string } {
  let remaining = text.trim();

  // Check for multi-word number phrases first
  for (const [phrase, num] of Object.entries(NUMBER_WORDS)) {
    const regex = new RegExp(`^${phrase}\\s+`, 'i');
    if (regex.test(remaining)) {
      remaining = remaining.replace(regex, '').trim();
      // Check if next word is a unit
      const unitMatch = remaining.match(
        new RegExp(`^(${UNITS.join('|')})(?:\\s+of)?\\s+`, 'i')
      );
      if (unitMatch) {
        const unit = normalizeUnit(unitMatch[1]);
        const name = remaining.slice(unitMatch[0].length).trim();
        return { quantity: num, unit, name: name || remaining };
      }
      // "a dozen eggs" where "dozen" is the implicit unit
      if (phrase.includes('dozen')) {
        return { quantity: num, unit: null, name: remaining };
      }
      return { quantity: num, unit: null, name: remaining };
    }
  }

  // Check for numeric quantity: "2 cans of tomatoes", "3 lbs ground beef"
  const numericMatch = remaining.match(
    /^(\d+(?:\.\d+)?)\s*/
  );
  if (numericMatch) {
    const quantity = parseFloat(numericMatch[1]);
    remaining = remaining.slice(numericMatch[0].length).trim();

    // Check for unit
    const unitMatch = remaining.match(
      new RegExp(`^(${UNITS.join('|')})(?:\\s+of)?\\s+`, 'i')
    );
    if (unitMatch) {
      const unit = normalizeUnit(unitMatch[1]);
      const name = remaining.slice(unitMatch[0].length).trim();
      return { quantity, unit, name: name || remaining };
    }

    return { quantity, unit: null, name: remaining || text.trim() };
  }

  // "half a pound of ground beef"
  const halfMatch = remaining.match(
    /^half\s+(?:a\s+)?(pound|gallon|dozen|lb|gal)\s+(?:of\s+)?/i
  );
  if (halfMatch) {
    const unit = normalizeUnit(halfMatch[1]);
    const name = remaining.slice(halfMatch[0].length).trim();
    return { quantity: 0.5, unit, name };
  }

  // No quantity found — default to 1
  return { quantity: 1, unit: null, name: remaining };
}

export function parseVoiceInput(transcript: string): ParsedItem[] {
  // Clean up: remove leading "we need", "I need", "get", "buy", "add" etc.
  let cleaned = transcript
    .replace(/^(we need|i need|get|buy|add|grab|pick up)\s+/i, '')
    .trim();

  if (!cleaned) return [];

  const segments = splitItems(cleaned);
  return segments.map((segment) => {
    const { quantity, unit, name } = parseQuantity(segment);
    // Capitalize first letter of each word in name
    const capitalized = name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return { name: capitalized, quantity, unit };
  });
}
