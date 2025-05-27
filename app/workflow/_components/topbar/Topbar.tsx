"use client";

import React from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/TooltipWrapper';
import SaveBtn from '@/app/workflow/_components/topbar/SaveBtn';
import ExcecuteBtn from '@/app/workflow/_components/topbar/ExcecuteBtn';
import NavigationTabs from '@/app/workflow/_components/topbar/NavigationTabs';
import PublishBtn from '@/app/workflow/_components/topbar/PublishBtn';
import UnpublishBtn from '@/app/workflow/_components/topbar/UnpublishBtn';

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

const Topbar = (props: Props) => {
  const {
    title,
    subtitle,
    workflowId,
    hideButtons = false,
    isPublished = false,
  } = props;
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper
          content="Back"
        >
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => router.back()}
          >
            <ArrowLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (<p className="text-xs text-muted-foreground text-ellipsis truncate">{subtitle}</p>)}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExcecuteBtn workflowId={workflowId} />
            {isPublished && (
              <UnpublishBtn workflowId={workflowId} />
            )}
            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId}/>
                <PublishBtn workflowId={workflowId}/>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
