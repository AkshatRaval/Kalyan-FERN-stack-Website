// forms/widgets/MembersWidget.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Dynamic list of team member name inputs.
// value: [{ name: string }, ...]
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Input } from '../../ui/Input';
import toast from 'react-hot-toast';

export function MembersWidget({ value = [], onChange, max = 3 }) {
  const update = (index, name) => {
    const next = [...value];
    next[index] = { name };
    onChange(next);
  };

  const add = () => {
    if (value.length >= max) {
      toast.error(`Maximum ${max} additional members allowed.`);
      return;
    }
    onChange([...value, { name: '' }]);
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3 col-span-full">
      {value.map((member, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={`Member ${index + 1} full name`}
            value={member.name}
            onChange={(e) => update(index, e.target.value)}
            className="flex-grow"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="px-3 py-2 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors shrink-0"
          >
            Remove
          </button>
        </div>
      ))}

      {value.length < max && (
        <button
          type="button"
          onClick={add}
          className="w-full p-2 border-2 border-dashed rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground"
        >
          + Add team member
        </button>
      )}

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          The person submitting this form is the team leader. Add additional members above.
        </p>
      )}
    </div>
  );
}