"use client";

import { useFormState } from "react-dom";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { inputClasses, labelClasses, errorClasses } from "@/components/ui/form-styles";
import { submitContactMessage } from "@/lib/actions/contact";
import { initialFormState } from "@/lib/actions/types";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildTelUrl, buildWhatsAppUrl, whatsappMessages } from "@/lib/whatsapp";

export default function ContactPage() {
  const settings = useSiteSettings();
  const [state, formAction] = useFormState(submitContactMessage, initialFormState);

  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          description="Have a question before you book? Reach out any way that's convenient — we usually reply within a few hours."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <a
              href={buildTelUrl(settings.phone)}
              className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-warm-white p-5"
            >
              <Phone className="mt-0.5 text-forest" size={20} aria-hidden />
              <div>
                <p className="text-sm font-medium text-charcoal">Call us</p>
                <p className="text-sm text-charcoal/60">{settings.phone}</p>
              </div>
            </a>

            <a
              href={buildWhatsAppUrl(settings.whatsapp, whatsappMessages.general())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-warm-white p-5"
            >
              <MessageCircle className="mt-0.5 text-forest" size={20} aria-hidden />
              <div>
                <p className="text-sm font-medium text-charcoal">WhatsApp</p>
                <p className="text-sm text-charcoal/60">Chat with a travel expert</p>
              </div>
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-warm-white p-5"
            >
              <Mail className="mt-0.5 text-forest" size={20} aria-hidden />
              <div>
                <p className="text-sm font-medium text-charcoal">Email</p>
                <p className="text-sm text-charcoal/60">{settings.email}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-warm-white p-5">
              <MapPin className="mt-0.5 text-forest" size={20} aria-hidden />
              <div>
                <p className="text-sm font-medium text-charcoal">Office</p>
                <p className="text-sm text-charcoal/60">{settings.address ?? "Address to be added"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-warm-white p-5">
              <Clock className="mt-0.5 text-forest" size={20} aria-hidden />
              <div>
                <p className="text-sm font-medium text-charcoal">Business Hours</p>
                <p className="text-sm text-charcoal/60">{settings.businessHours ?? "Monday – Saturday, 10am – 7pm IST"}</p>
              </div>
            </div>
          </div>

          <div>
            {state.status === "success" ? (
              <div className="rounded-2xl border border-charcoal/10 bg-warm-white p-8 text-center">
                <p className="font-display text-2xl text-charcoal">Message sent</p>
                <p className="mt-3 text-sm text-charcoal/70">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5 rounded-2xl border border-charcoal/10 bg-ivory p-6 shadow-md shadow-charcoal/5 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClasses}>Name</label>
                    <input id="name" name="name" required className={inputClasses} />
                    {state.fieldErrors?.name ? <p className={errorClasses}>{state.fieldErrors.name[0]}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClasses}>Phone</label>
                    <input id="phone" name="phone" type="tel" required className={inputClasses} />
                    {state.fieldErrors?.phone ? <p className={errorClasses}>{state.fieldErrors.phone[0]}</p> : null}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>Email (optional)</label>
                  <input id="email" name="email" type="email" className={inputClasses} />
                  {state.fieldErrors?.email ? <p className={errorClasses}>{state.fieldErrors.email[0]}</p> : null}
                </div>
                <div>
                  <label htmlFor="subject" className={labelClasses}>Subject</label>
                  <input id="subject" name="subject" required className={inputClasses} />
                  {state.fieldErrors?.subject ? <p className={errorClasses}>{state.fieldErrors.subject[0]}</p> : null}
                </div>
                <div>
                  <label htmlFor="message" className={labelClasses}>Message</label>
                  <textarea id="message" name="message" rows={5} required className={inputClasses} />
                  {state.fieldErrors?.message ? <p className={errorClasses}>{state.fieldErrors.message[0]}</p> : null}
                </div>

                {state.status === "error" && state.message ? (
                  <p className="rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">{state.message}</p>
                ) : null}

                <SubmitButton>Send Message</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
