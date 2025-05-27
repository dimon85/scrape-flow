import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LockKeyholeIcon, ShieldIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';
import CreateCredentialDialog from '@/app/(dashboard)/credentials/_components/CreateCredentialDialog';
import DeleteCredentialDialog from '@/app/(dashboard)/credentials/_components/DeleteCredentialDialog';

const CredentialsPage = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">
            Credentials
          </h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-green-400" />
          <AlertTitle className="text-green-400">Encryption</AlertTitle>
          <AlertDescription>All information is securely encrypted, ensuring your data remains safe</AlertDescription>
        </Alert>
        <Suspense
          fallback={
            <Skeleton className="h-[300px] w-full" />
          }
        >
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
};

async function UserCredentials() {
  const credentials = await GetCredentialsForUser();
  if (!credentials) {
    return <div className="">Something went wrong</div>
  }

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldIcon size={40} className="stroke-green-400"/>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="text-bold">
            No credentials created yet
          </p>
          <p className="text-muted-foreground">
            Click the button below to create your first credential
          </p>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        })
        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-green-400" />
              </div>
              <div>
                <p className="font-bold">
                  {credential.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {createdAt}
                </p>
              </div>
            </div>
            <DeleteCredentialDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}

export default CredentialsPage;