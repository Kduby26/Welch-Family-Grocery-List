import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHousehold } from '@/contexts/HouseholdContext';
import { useKnownItems } from '@/hooks/useKnownItems';
import { addGroceryEntry } from '@/lib/firebase/grocery-list';
import { addKnownItem } from '@/lib/firebase/items';
import { KnownItem, ParsedItem } from '@/types';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { FrequentChips } from './FrequentChips';
import { VoiceInputButton } from './VoiceInputButton';
import { toast } from '@/components/ui/Toast';

export function AddItemBar() {
  const { user } = useAuth();
  const { household } = useHousehold();
  const { searchItems, findByName, frequent } = useKnownItems(household?.id);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<KnownItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 1) {
      setSuggestions(searchItems(value));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addItem = useCallback(
    async (
      name: string,
      quantity: number = 1,
      unit: string | null = null,
      knownItem?: KnownItem
    ) => {
      if (!household || !user) return;

      let itemId: string;
      let category = knownItem?.category ?? 'dry-goods';
      let store = knownItem?.preferredStore ?? null;
      let storeLocked = knownItem?.storeLocked ?? false;

      if (knownItem) {
        itemId = knownItem.id;
      } else {
        // Check if item exists
        const existing = findByName(name);
        if (existing) {
          itemId = existing.id;
          category = existing.category;
          store = existing.preferredStore;
          storeLocked = existing.storeLocked;
        } else {
          itemId = await addKnownItem(household.id, {
            name,
            category: 'dry-goods',
          });
        }
      }

      await addGroceryEntry(household.id, {
        itemId,
        itemName: name,
        category,
        store,
        storeLocked,
        quantityNeeded: quantity,
        quantityOnHand: 0,
        unit,
        notes: knownItem?.defaultNotes ?? null,
        addedBy: user.uid,
      });

      toast(`Added ${name}`, 'success');
    },
    [household, user, findByName]
  );

  const handleSubmit = async () => {
    const name = query.trim();
    if (!name) return;
    await addItem(name);
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = async (item: KnownItem) => {
    await addItem(item.name, item.defaultQuantity, item.unit, item);
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleFrequentAdd = async (item: KnownItem) => {
    await addItem(item.name, item.defaultQuantity, item.unit, item);
  };

  const handleVoiceItems = async (items: ParsedItem[]) => {
    for (const item of items) {
      await addItem(item.name, item.quantity, item.unit);
    }
  };

  return (
    <div className="sticky bottom-[56px] z-20 bg-slate-900 border-t border-slate-800">
      {/* Frequent chips */}
      {frequent.length > 0 && (
        <div className="px-3 py-2 overflow-x-auto flex gap-2 scrollbar-hide">
          <FrequentChips items={frequent} onAdd={handleFrequentAdd} />
        </div>
      )}

      {/* Autocomplete */}
      {showSuggestions && suggestions.length > 0 && (
        <AutocompleteDropdown
          items={suggestions}
          onSelect={handleSelectSuggestion}
        />
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <VoiceInputButton onItems={handleVoiceItems} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Add an item..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 min-h-[48px]"
        />
        <button
          onClick={handleSubmit}
          disabled={!query.trim()}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-500 text-white text-xl font-bold disabled:opacity-30 active:bg-emerald-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
