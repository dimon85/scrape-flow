import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Props {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}
const CustomDialogHeader = (props: Props) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {props.icon && (
            <props.icon
              size="40"
              className={cn(
                "stroke-primary",
                props.iconClassName
              )}
            />
          )}
          {props.title && (
            <p className={cn(
              "text-xl text-primary",
              props.titleClassName
            )}>
              {props.title}
            </p>
          )}
          {props.subTitle && (
            <p className={cn(
              "text-sm text-muted-foreground",
              props.subTitle
            )}>
              {props.subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  )
}

export default CustomDialogHeader;
