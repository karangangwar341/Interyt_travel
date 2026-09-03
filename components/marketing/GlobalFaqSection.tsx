import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { getGlobalFaqs } from "@/lib/data/faqs";

export async function GlobalFaqSection() {
  const faqs = await getGlobalFaqs();
  if (faqs.length === 0) return null;

  return (
    <section className="bg-warm-white py-20 md:py-28">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Good to Know"
            title="Frequently Asked Questions"
            description="Answers to the questions we hear most often from travelers planning a trip with us."
          />
        </Reveal>
        <div className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-medium text-charcoal marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
