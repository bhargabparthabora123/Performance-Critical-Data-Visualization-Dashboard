import { generateInitialDataset } from '@/lib/dataGenerator';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // Generate initial dataset on the server
  const initialData = generateInitialDataset(10000);

  return <DashboardClient initialData={initialData} />;
}
