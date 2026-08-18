import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { CreateWorkspaceModal } from '../components/modules/CreateWorkspaceModal';
import { useWorkspaces } from '../hooks/useWorkspaces';

export const DashboardLayout = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { createWorkspace } = useWorkspaces();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <Outlet context={{ searchValue }} />
        </main>
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createWorkspace}
      />
    </div>
  );
};
