'use client';

import React, {
  useId,
  useState,
  useEffect,
} from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ParamProps } from '@/types/appNode';
import { Textarea } from '@/components/ui/textarea';

const StringParam = ({ param, value, disabled, updateNodeParamValue }: ParamProps) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setInternalValue(event.target.value);
  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => updateNodeParamValue(event.target.value);

  const id = useId();

  let Component: any = Input;
  if (param.variant === 'textarea') {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        id={id}
        type="text"
        className="text-xs w-full"
        placeholder="Enter a value"
        value={internalValue}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {param.helperText && (
        <p className="text-xs text-muted-foreground px-2">
          {param.helperText}
        </p>
      )}
    </div>
  )
}

export default StringParam;