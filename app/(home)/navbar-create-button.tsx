"use client";

import { Plus } from "lucide-react";
import { useCreateDocument } from "@/app/hooks/use-create-document";
import { UpgradeModal } from "@/components/upgrade-modal";

export const NavbarCreateButton = () => {
  const { create, showUpgrade, setShowUpgrade, docCount } = useCreateDocument();

  return (
    <>
      <button
        onClick={() => create("Untitled Document")}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium rounded-full transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:block">New</span>
      </button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        docCount={docCount}
      />
    </>
  );
};