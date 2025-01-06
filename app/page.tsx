"use client";

import ItemSelector from '@/components/ItemSelector';
import CampaignSelect from '@/components/CampaignSelect';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Selection Persistence Demo
      </h1>
      <div className="max-w-4xl mx-auto">
        <ItemSelector />
        <CampaignSelect />
      </div>
    </main>
  );
}