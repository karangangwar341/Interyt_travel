import { getGlobalFaqs } from "@/lib/data/faqs";
import { GlobalFaqEditor } from "@/components/admin/faqs/GlobalFaqEditor";

export default async function AdminFaqsPage() {
  const faqs = await getGlobalFaqs();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Site-wide FAQs</h1>
      <p className="mb-6 text-sm text-charcoal/55">
        Shown in the &ldquo;Frequently Asked Questions&rdquo; section on the homepage.
      </p>
      <GlobalFaqEditor initial={faqs} />
    </div>
  );
}
