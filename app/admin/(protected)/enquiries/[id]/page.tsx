import { notFound } from "next/navigation";
import { getEnquiryForAdmin } from "@/lib/data/admin-enquiries";
import { EnquiryDetail } from "@/components/admin/enquiries/EnquiryDetail";

export default async function AdminEnquiryDetailPage({ params }: { params: { id: string } }) {
  const enquiry = await getEnquiryForAdmin(params.id);
  if (!enquiry) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Enquiry Details</h1>
      <p className="mb-6 text-sm text-charcoal/55">From {enquiry.customerName}</p>
      <EnquiryDetail enquiry={enquiry} />
    </div>
  );
}
