import { DestinationForm } from "@/components/admin/destinations/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">New Destination</h1>
      <p className="mb-6 text-sm text-charcoal/55">Fill in the core details. You can add a hero image once the destination is created.</p>
      <DestinationForm />
    </div>
  );
}
