export const siteConfig = {
  name: "Supreme Computer",
  location: "Akpata, Benin City, Edo State",
  address: "Km 2, Upper Siluko Road, Akpata, Benin City, Edo State, Nigeria.",
  email: "computersupreme0@gmail.com",
  phones: [
    { display: "0815 240 4200", compact: "08152404200", href: "tel:+2348152404200", whatsapp: "https://wa.me/2348152404200" },
    { display: "0808 416 0376", compact: "08084160376", href: "tel:+2348084160376", whatsapp: "https://wa.me/2348084160376" },
  ],
  hours: { weekdays: "Monday–Saturday", times: "8:00 AM–5:00 PM", sunday: "Closed" },
} as const;

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

export const whatsappAbout = (service: string) =>
  `${siteConfig.phones[0].whatsapp}?text=${encodeURIComponent(`Hello Supreme Computer, I would like to ask about ${service}.`)}`;
