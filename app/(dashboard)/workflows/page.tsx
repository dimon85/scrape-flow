import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GetWorkflowsForUser } from '@/actions/workflows/getWorkflowsForUser';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, InboxIcon } from 'lucide-react';
import CreateWorkflowDialog from './_components/CreateWorkflowDialog';
import WorkflowCard from './_components/WorkflowCard';

const page = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage you workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await GetWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Plese try again later</AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
    <div className="flex flex-col items-center h-full gap-4">
      <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
        <InboxIcon size={48} className="stroke-sky-600"/>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <p className="font-bold">No workflow creted yet</p>
        <p className="text-sm text-muted-foreground">
          Click the button bellow to createe your first workflow
        </p>
      </div>
      <CreateWorkflowDialog triggerText='Create your first workflow' />
    </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
        />
      ))}
    </div>
  );
}

export default page;