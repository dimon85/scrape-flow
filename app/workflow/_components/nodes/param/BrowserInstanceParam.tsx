'use client';

import React from 'react';
import { ParamProps } from '@/types/appNode';

const BrowserInstanceParam = ({ param }: ParamProps) => {
  return (
    <div className="space-y-1 p-1 w-full">
      {param.name}
    </div>
  )
}

export default BrowserInstanceParam;
