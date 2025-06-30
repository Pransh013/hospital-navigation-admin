import { Card } from "@/components/ui/card";
import { Package } from "@/models/package";

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Card key={pkg.packageId} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>
        <div className="text-lg font-semibold">
          &#8377;{pkg.price.toFixed(2)}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <p>{pkg.testIds.length} tests included</p>
      </div>
    </Card>
  );
}
