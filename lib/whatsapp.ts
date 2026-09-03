export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(phoneNumber: string) {
  return `tel:${phoneNumber.replace(/\s/g, "")}`;
}

export const whatsappMessages = {
  general: () =>
    "Hi! I'd like to know more about planning a trip with Bharat Trails.",

  destination: (destinationName: string) =>
    `Hi, I'm interested in traveling to ${destinationName}. Could you share some trip options?`,

  trip: (tripTitle: string) =>
    `Hi, I'm interested in the ${tripTitle} trip. Please share availability and booking details.`,

  tripDeparture: (tripTitle: string, departureDateLabel: string) =>
    `Hi, I'm interested in the ${tripTitle} departing on ${departureDateLabel}. Please share availability and booking details.`,

  customTrip: (destinationName?: string) =>
    destinationName
      ? `Hi, I'd like help planning a customized trip to ${destinationName}.`
      : "Hi, I'd like help planning a customized trip.",
};
