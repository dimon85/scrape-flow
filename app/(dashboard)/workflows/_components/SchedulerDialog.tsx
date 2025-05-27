"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useMutation } from '@tanstack/react-query';
import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron';
import { toast } from 'sonner';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from "cron-parser";
import { removeWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule';
import { Separator } from '@/components/ui/separator';

const SchedulerDialog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = useState<string>(props.cron || '');
  const [validCron, setValidCron] = useState<boolean>(false);
  const [readableCron, setReadableCron] = useState<string>("");
  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' });
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' });
    },
  });
  const removeScheduleMutation = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule updated successfully', { id: 'cron' });
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'cron' });
    },
  });

  useEffect(() => {
    try {
      CronExpressionParser.parse(cron);
      const hummanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(hummanCronStr);
    } catch {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary",
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" />
              <span>Set schedule</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Specify a cron expressino to schedule periodic execution of this workflow execution.
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-green-500 text-green-500",
            )}
          >
            {validCron? readableCron : "Not a valid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  disabled={mutation.isPending || removeScheduleMutation.isPending}
                  onClick={() => {
                    toast.loading('Removing schedule...', { id: 'cron' });
                    removeScheduleMutation.mutate(props.workflowId);
                  }}
                >
                  Remove schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                toast.loading('Saving...', { id: 'cron' });
                mutation.mutate({
                  id: props.workflowId,
                  cron,
                });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
