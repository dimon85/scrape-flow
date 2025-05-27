import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactCountUpWrapper } from '@/components/ReactCountUpWrapper';

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}
const StatsCard = (props: Props) => {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{props.title}</CardTitle>
        <props.icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-green-400 opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-400">
          <ReactCountUpWrapper value={props.value} />
        </div>
      </CardContent>
    </Card>
  )
}

export default StatsCard