"use client";
import React, { useCallback, useState } from 'react';
import { Loader2, ShieldEllipsisIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/createCredential';
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

const CreateCredentialDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created successfully", { id: "create-credential" });
      form.reset();
      setOpen(false);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create credential', {
        id: 'create-credential',
      });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
    toast.loading("Creating credential...", { id: "create-credential" });
    mutate(values);
  }, [mutate]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          {triggerText ?? "Create"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={ShieldEllipsisIcon}
          title="Create credential"
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
                    <FormDescription>
                      Enter a unique an desciptive name for the credential
                      <br />
                      This name will be used to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with the credential
                      <br />
                      This value will be securely encrypted and stored
                    </FormDescription>
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

export default CreateCredentialDialog;
