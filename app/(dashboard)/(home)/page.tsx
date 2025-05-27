import React, { Suspense } from 'react';
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react';
import { GetPeriods } from '@/actions/analitics/getPeriods';
import { GetWorkflowExecutionStats } from '@/actions/analitics/getWorkflowExecutionStats';
import { GetCreditsUsageInPeriod } from '@/actions/analitics/getCreditsUsageInPeriod';
import { Period } from '@/types/analitics';
import { Skeleton } from '@/components/ui/skeleton';
import { GetStatsCardsValues } from '@/actions/analitics/getStatsCardsValues';
import PeriodSelector from '@/app/(dashboard)/(home)/_components/PeriodSelector';
import StatsCard from '@/app/(dashboard)/(home)/_components/StatsCard';
import ExecutionStatusChart from '@/app/(dashboard)/(home)/_components/ExecutionStatusChart';
import CreditUsageChart from '@/app/(dashboard)/billing/_components/CreditUsageChart';

const HomePage = ({ searchParams }: {
  searchParams: { month?: string; year?: string };
}) => {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return (
    <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
  );
}

async function StatsCards({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetStatsCardsValues(selectedPeriod);

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflo executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <Skeleton  key={index} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return (
    <ExecutionStatusChart
      data={data}
    />
  );
}
async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credits consumed in the selected period"
    />
  );
}

export default HomePage;
