import { formatBDT } from "@/lib/currency";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  DollarSign,
  TestTube,
} from "lucide-react";
import { toast } from "sonner";
import { LabCatalogItem } from "@/data/lab-staff-data";

interface LabCatalogModuleProps {
  catalog: LabCatalogItem[];
  onAddTest: (test: LabCatalogItem) => void;
}

export function LabCatalogModule({
  catalog,
  onAddTest,
}: LabCatalogModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("Biochemistry");
  const [price, setPrice] = useState(25.0);
  const [sampleType, setSampleType] = useState("SST Serum");
  const [processingTimeHours, setProcessingTimeHours] = useState(2);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: LabCatalogItem = {
      id: `cat-${Date.now()}`,
      testName,
      category,
      price,
      sampleType,
      processingTimeHours,
      availability: "Available",
    };
    onAddTest(newTest);
    setModalOpen(false);
    toast.success(`Added ${testName} to Lab Test Catalog`);
  };

  const filtered = catalog.filter(
    (c) =>
      c.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Diagnostic Test Master Catalog
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure offered pathology & biochemistry tests, pricing, sample container types, and processing turnaround times.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Test to Catalog
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search test name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {item.category}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  {item.availability}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{item.testName}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TestTube className="h-3.5 w-3.5 text-teal" /> Specimen: <strong className="text-foreground">{item.sampleType}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">{formatBDT(item.price)}</span>
              <span className="text-muted-foreground flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> {item.processingTimeHours} Hour(s) TAT
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Add Diagnostic Test
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTest} className="space-y-3 mt-2 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Test Name</Label>
              <Input value={testName} onChange={(e) => setTestName(e.target.value)} required className="mt-1 rounded-xl text-xs font-semibold" />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="Hematology">Hematology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Serology">Serology</SelectItem>
                  <SelectItem value="Microbiology">Microbiology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Price (BDT)</Label>
                <Input type="number" step="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 rounded-xl text-xs font-bold" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Turnaround Time (Hours)</Label>
                <Input type="number" value={processingTimeHours} onChange={(e) => setProcessingTimeHours(Number(e.target.value))} className="mt-1 rounded-xl text-xs font-bold" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Sample Container Type</Label>
              <Input value={sampleType} onChange={(e) => setSampleType(e.target.value)} required className="mt-1 rounded-xl text-xs" />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md">
              Save Test to Catalog
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
