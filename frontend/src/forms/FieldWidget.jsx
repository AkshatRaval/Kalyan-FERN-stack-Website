// forms/FieldWidget.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders any field from the schema. To add a new type:
//   1. Add a case below
//   2. Add type: 'yourtype' to a field in Apply.js
//   That's it. Nothing else to touch.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Label } from '../ui/Label';
import { Input, Textarea, Checkbox } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Upload } from 'lucide-react';
import { TopicPickerWidget } from './widgets/TopicPickerWidget';
import { MembersWidget } from './widgets/MembersWidget';

export function FieldWidget({ field, value, onChange, allValues }) {
  const { id, type, label, required, placeholder, options, readOnly, accept } = field;

  // ── Label element (reused across types) ────────────────────────────────────
  const labelEl = (
    <Label htmlFor={id} className="font-semibold text-sm">
      {label}
      {required
        ? <span className="text-destructive"> *</span>
        : <span className="text-muted-foreground font-normal text-xs"> (optional)</span>}
    </Label>
  );

  // ── Widget switcher ─────────────────────────────────────────────────────────
  const widget = (() => {
    switch (type) {

      // ── Scalar inputs ──────────────────────────────────────────────────────
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
      case 'number':
      case 'url':
        return (
          <Input
            id={id}
            type={type}
            value={value ?? ''}
            placeholder={placeholder ?? ''}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            className={readOnly ? 'bg-muted/50 cursor-not-allowed text-muted-foreground' : ''}
          />
        );

      // ── Multiline ──────────────────────────────────────────────────────────
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value ?? ''}
            placeholder={placeholder ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      // ── Dropdown ───────────────────────────────────────────────────────────
      case 'select': {
        const opts = normaliseOptions(options);
        return (
          <Select value={value ?? ''} onValueChange={onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder ?? `Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {opts.map(({ value: v, label: l }) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      // ── Pill radio group ───────────────────────────────────────────────────
      case 'radio': {
        const opts = normaliseOptions(options);
        return (
          <div className="flex flex-wrap gap-3 pt-1">
            {opts.map(({ value: v, label: l }) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={[
                  'text-sm px-4 py-2 rounded-lg border-2 transition-all duration-150',
                  value === v
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border hover:border-primary/40 hover:bg-accent/40',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>
        );
      }

      // ── Single checkbox ────────────────────────────────────────────────────
      // Note: checkbox renders its own label (wider click target)
      case 'checkbox':
        return (
          <div className="flex items-start gap-3">
            <Checkbox
              id={id}
              checked={!!value}
              onCheckedChange={onChange}
              className="mt-0.5 shrink-0"
            />
            <Label htmlFor={id} className="text-sm leading-relaxed cursor-pointer">
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          </div>
        );

      // ── File upload ────────────────────────────────────────────────────────
      case 'file':
        return (
          <>
            <Label
              htmlFor={`file-${id}`}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 flex flex-col items-center hover:bg-accent/50 transition-colors text-center"
            >
              <Upload className="h-7 w-7 mb-2 text-muted-foreground" />
              {value
                ? <span className="text-sm text-primary font-medium">{value.name}</span>
                : <span className="text-sm text-muted-foreground">{placeholder ?? 'Click to upload'}</span>}
            </Label>
            <input
              id={`file-${id}`}
              type="file"
              accept={accept ?? '*/*'}
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
          </>
        );

      // ── Composite: grade-aware topic picker ────────────────────────────────
      case 'topic-picker':
        return (
          <TopicPickerWidget
            field={field}
            value={value ?? []}
            onChange={onChange}
            currentGrade={allValues?.[field.gradeField ?? 'currentClass']}
          />
        );

      // ── Composite: team members ────────────────────────────────────────────
      case 'members':
        return (
          <MembersWidget
            value={value ?? []}
            onChange={onChange}
            max={field.maxMembers ?? 3}
          />
        );

      default:
        console.warn(`FieldWidget: unknown type "${type}" on field "${id}"`);
        return <p className="text-sm text-destructive">Unknown field type: {type}</p>;
    }
  })();

  // Checkbox handles its own label — skip the wrapper
  if (type === 'checkbox') {
    return <div className="col-span-full">{widget}</div>;
  }

  return (
    <div className="space-y-2 flex flex-col">
      {labelEl}
      {widget}
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
// Normalise options: string[] | { value, label }[] → { value, label }[]
function normaliseOptions(options = []) {
  return options.map((o) =>
    typeof o === 'object' ? o : { value: o, label: o }
  );
}