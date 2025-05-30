"use client";
import React, { useCallback, useState } from 'react';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from '@/schema/workflows';
import { DuplicateWorkflow } from '@/actions/workflows/duplicateWorkflow';
import {
  Form,
  FormControl,
  FormItem,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { cn } from '@/lib/utils';


const DuplicateWorkflowDialog = ({ workflowId }: { workflowId?: string }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", { id: "duplicated-workflow" });
      setOpen(prev => !prev);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate workflow', {
        id: 'duplicate-workflow'
      });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
    toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
    mutate(values);
  }, [mutate]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
        />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-sky-400">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Choose a desciptive and unique name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>Provide a brief description of what your workflow does. <br /> This is optional but can help you remember the workflow&apos;s purpose</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && 'Proceed'}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateWorkflowDialog;
