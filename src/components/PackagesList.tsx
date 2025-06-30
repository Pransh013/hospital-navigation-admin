"use client";

import { Package } from "@/models/package";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PackageCard from "./PackageCard";
import Link from "next/link";
import { Button } from "./ui/button";

const PackagesList = ({ packages }: { packages: Package[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Packages</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search packages..."
              className="pl-9 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/packages/add">Add Package</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full">
            No packages found.
          </p>
        ) : (
          filteredPackages.map((pkg) => (
            <PackageCard key={pkg.packageId} pkg={pkg} />
          ))
        )}
      </div>
    </>
  );
};

export default PackagesList;
