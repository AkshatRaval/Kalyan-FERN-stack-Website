// forms/widgets/TopicPickerWidget.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Grade-aware topic / domain picker. Extracted from FormRenderer so it's
// independently testable and reusable.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import toast from 'react-hot-toast';

export function TopicPickerWidget({ field, value = [], onChange, currentGrade }) {
  const { label, description, selectionMode = 'single', groups = [] } = field;
  const maxSelections = field.maxSelections ?? Infinity;

  const gradeNotSelected = !currentGrade;

  const visibleGroups = groups.filter(
    (g) => g.grades === '*' || g.grades.includes(currentGrade)
  );

  const handleToggle = (topicId) => {
    if (selectionMode === 'single') {
      onChange([topicId]);
      return;
    }
    if (value.includes(topicId)) {
      onChange(value.filter((t) => t !== topicId));
    } else {
      if (value.length >= maxSelections) {
        toast.error(`You can select a maximum of ${maxSelections} topics.`);
        return;
      }
      onChange([...value, topicId]);
    }
  };

  const isSelected = (id) => value.includes(id);

  const getLabelForId = (topicId) => {
    for (const g of groups) {
      const t = g.topics.find((tp) => tp.id === topicId);
      if (t) return t.label;
    }
    return topicId;
  };

  return (
    <div className="space-y-6 col-span-full">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      {selectionMode === 'multi' && maxSelections !== Infinity && (
        <p className="text-xs text-muted-foreground">
          Select up to <span className="font-semibold">{maxSelections}</span> topics.
          ({value.length}/{maxSelections} selected)
        </p>
      )}

      {gradeNotSelected && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <span>⚠️</span>
          <span>Please fill in your <strong>Academic Information</strong> first — topics filter by grade.</span>
        </div>
      )}

      {(gradeNotSelected ? groups : visibleGroups).map((group) => (
        <div
          key={group.id}
          className={gradeNotSelected ? 'opacity-40 pointer-events-none select-none' : ''}
        >
          <div className="flex items-center gap-2 mb-3">
            {group.grades === '*' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Always available
              </span>
            )}
            <h3 className="text-sm font-semibold">{group.label}</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {group.topics.map((topic) => {
              const active = isSelected(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleToggle(topic.id)}
                  className={[
                    'text-left p-4 rounded-xl border-2 transition-all duration-150',
                    active
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border hover:border-primary/40 hover:bg-accent/40 bg-background/50',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-semibold leading-snug ${active ? 'text-primary' : ''}`}>
                      {topic.label}
                    </span>
                    <span className={[
                      'mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      active ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                    ].join(' ')}>
                      {active && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </div>
                  {topic.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{topic.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {value.length > 0 && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">
            {selectionMode === 'single' ? 'Selected:' : 'Selected topics:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((topicId) => (
              <span key={topicId} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {getLabelForId(topicId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}