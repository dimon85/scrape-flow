import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import ExecutionViewer from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer";

export const ExecutionViewerPage = async ({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  }
}) => {
  const { workflowId, executionId } = await params;
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run detail"
        subtitle={`Run ID: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full items-center justify-center">
            <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
          </div>
        }>
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default ExecutionViewerPage;

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    return <div>Unaunthenticated</div>;
  }

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Workflow execution not found</div>;
  }

  return (
    <ExecutionViewer initialData={workflowExecution} />
  );
};