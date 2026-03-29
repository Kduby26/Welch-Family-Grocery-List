import { KnownItem } from '@/types';
import { Chip } from '@/components/ui/Chip';

interface Props {
  items: KnownItem[];
  onAdd: (item: KnownItem) => void;
}

export function FrequentChips({ items, onAdd }: Props) {
  return (
    <>
      {items.map((item) => (
        <Chip
          key={item.id}
          label={item.name}
          onClick={() => onAdd(item)}
        />
      ))}
    </>
  );
}
