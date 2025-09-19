import { useState, useEffect } from "react";
import { PlayCircle, Calendar, Music2, Mail, Instagram, Youtube, MapPin, ExternalLink } from "lucide-react";

// Static data (safe to keep outside the component)
const MEMBERS = [
  {
    name: "Edge",
    role: "Lead Vocals",
    photo: "/members/edge.jpg",
    bio: "Best vocal you'll ever hear",
  },
  {
    name: "Oz",
    role: "Lead Guitar",
    photo: "/members/oz.jpg",
    bio: "El Dragono Ultimo",
  },
  {
    name: "Matt",
    role: "Rhythm Guitar",
    photo: "/members/matt.jpg",
    bio: "A true Shredding Samurai",
  },
  {
    name: "Jude",
    role: "Drums",
    photo: "/members/jude.jpg",
    bio: "Full gas no brakes",
  },
  {
    name: "This Could Be You",
    role: "Bass Guitar",
    photo: "/members/bass.jpg",
    bio: "We’re looking for a bassist! Hit us up and join the madness.",
  },
];




const IMAGES = [
  { src: "/gallery/ubg-group-2024.png", alt: "Stryke group photo UBG 2024" },
  { src: "/gallery/klos-radio-promo.png", alt: "KLOS radio promo for Stryke" },
  { src: "/gallery/whisky-live-2025-crowd.jpg", alt: "Stryke live crowd at Whisky a Go Go 2025" },
  { src: "/gallery/whisky-vocal-2025.jpg", alt: "Stryke vocalist live at Whisky 2025" },
  { src: "/gallery/whisky-guitar1-2025.jpg", alt: "Stryke guitarist live at Whisky 2025" },
  { src: "/gallery/whisky-drum-2025.jpg", alt: "Stryke drummer live at Whisky 2025" },
  { src: "/gallery/whisky-live-2025-stage.jpg", alt: "Stryke on stage at Whisky a Go Go 2025" },
  { src: "/gallery/vp-guitar1-2024.jpg", alt: "Stryke guitarist at VP 2024" },
  { src: "/gallery/ubg-guitar2-2024.jpg", alt: "Stryke guitarist at UBG 2024" },
  { src: "/gallery/dd-guitar2-2024.jpg", alt: "Stryke guitarist DD at VP 2024" },
];

const STREAMING = [
  { name: "Spotify", href: "https://open.spotify.com/artist/2dONihabzF6RKPH0RFAR9X?si=yw0273DESyWnl8cTb9_8KQ", icon: <Music2 className="w-5 h-5" /> },
  { name: "Apple Music", href: "https://music.apple.com/us/artist/stryke/1736898754", icon: <Music2 className="w-5 h-5" /> },
  { name: "BandMix", href: "https://www.bandmix.com/stryke/", icon: <Music2 className="w-5 h-5" /> },
];

export default function BandSite() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

// --- Members carousel: one-card slide ---
const TRANSITION_MS = 400;                // keep in sync with duration-500 below
const [mStart, setMStart] = useState(0);
const [visibleCount, setVisibleCount] = useState(3);

// slide direction (+1 next, -1 prev) and anim stage
const [dir, setDir] = useState(1);
const [stage, setStage] = useState("idle"); // "idle" | "sliding"

// Responsive: 1 / 2 / 3 cards
useEffect(() => {
  const update = () => {
    const w = window.innerWidth;
    if (w < 640) setVisibleCount(1);
    else if (w < 1024) setVisibleCount(2);
    else setVisibleCount(3);
  };
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);

// Build the strip of cards to render: visibleCount + 1 so the next card can slide in
const startIndex = dir === 1
  ? mStart
  : (mStart - 1 + MEMBERS.length) % MEMBERS.length;

const STRIP = Array.from({ length: visibleCount + 1 }, (_, k) => {
  const idx = (startIndex + k) % MEMBERS.length;
  return MEMBERS[idx];
});

// Slide helpers: move by exactly 1 card
const go = (direction) => {
  setDir(direction);
  setStage("sliding");                     // start slide
  setTimeout(() => {
    // after slide finishes, advance start index by 1 and reset stage
    setMStart((i) => (i + (direction === 1 ? 1 : -1) + MEMBERS.length) % MEMBERS.length);
    setStage("idle");
  }, TRANSITION_MS);
};

const nextMembers = () => go(+1);
const prevMembers = () => go(-1);

  // Lightbox state/hooks MUST be inside the component
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (idx) => { setActiveIndex(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = (e) => { e?.stopPropagation(); setActiveIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length); };
  const nextImage = (e) => { e?.stopPropagation(); setActiveIndex((i) => (i + 1) % IMAGES.length); };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="#home" className="flex items-center">
            <img
              src="/logo/stryke-logo.png"
              alt="Stryke logo"
              className="h-12 md:h-14 w-auto"  
            />
          </a>
          <div className="hidden md:flex gap-6 text-sm font-bold">
            <a href="#music" className="hover:opacity-80">Music</a>
            <a href="#shows" className="hover:opacity-80">Shows</a>
            <a href="#video" className="hover:opacity-80">Video</a>
            <a href="#gallery" className="hover:opacity-80">Gallery</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </div>
        </nav>
      </header>

{/* HERO */}
<section id="home" className="relative overflow-hidden">
  {/* background image + overlay */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: "url(/gallery/ubg-group-2024.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
  <div className="absolute inset-0 bg-black/60" />
  <div className="container mx-auto px-6 py-24 md:py-32 relative">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left side: heading, text, buttons */}
      <div>
        <h1 className="font-extrabold leading-tight">
  <span className="block text-4xl md:text-6xl">Left Behind</span>
  <span className="block text-2xl md:text-3xl text-neutral-300">Out Now</span>
</h1>

        <div className="mt-8 flex flex-wrap gap-3">
          {STREAMING.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-2xl border border-neutral-800 px-4 py-2 hover:bg-neutral-900"
            >
              {s.icon}
              <span>{s.name}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </a>
          ))}
          <a
  href="#video"
  className="inline-flex items-center gap-2 rounded-2xl bg-[#B00000] px-4 py-2 font-semibold hover:bg-[#C10F0F]"
>
  <PlayCircle className="w-5 h-5" /> Watch Video
</a>

        </div>
      </div>

      {/* Right side: Spotify embed */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-2xl">
        <iframe
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/artist/2dONihabzF6RKPH0RFAR9X?utm_source=generator"
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Artist Embed"
          allowFullScreen
        />
      </div>
    </div>
  </div>
</section>


{/* SHOWS */}
<section id="shows" className="container mx-auto px-6 py-20">
  <div className="flex items-center gap-3">
    <Calendar className="w-6 h-6" />
    <h2 className="text-2xl md:text-3xl font-bold">Upcoming Shows</h2>
  </div>

  <div className="mt-6 rounded-2xl border border-neutral-800 p-6 text-center text-neutral-300">
    To be announced soon…
  </div>
</section>


{/* MEMBERS */}
<section id="members" className="container mx-auto px-6 py-20">
  <h2 className="text-2xl md:text-3xl font-bold">Members</h2>

  {/* Viewport */}
  <div className="mt-6 overflow-hidden">
    <div
      className="flex gap-6 transition-transform duration-500"
      style={{
        // Slide by one card width (100% of viewport / visibleCount)
        transform: stage === "sliding"
          ? `translateX(${dir === 1 ? -100 / visibleCount : 100 / visibleCount}%)`
          : "translateX(0%)",
      }}
    >
      {STRIP.map((m) => (
        <div
          key={m.name}
          // Each card takes exactly 1/visibleCount of the viewport width
          style={{ flex: `0 0 ${100 / visibleCount}%` }}
          className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden group"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={m.photo}
              alt={`${m.name} — ${m.role}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <div className="text-lg font-semibold">{m.name}</div>
            <div className="text-xs uppercase tracking-wide text-neutral-400">{m.role}</div>
            <p className="mt-3 text-sm text-neutral-300">{m.bio}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Arrows at the bottom, centered */}
  <div className="mt-6 flex items-center justify-center gap-2">
    <button
      type="button"
      onClick={prevMembers}
      className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900"
      aria-label="Previous members"
    >
      ←
    </button>
    <button
      type="button"
      onClick={nextMembers}
      className="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900"
      aria-label="Next members"
    >
      →
    </button>
  </div>
</section>




{/* VIDEO */}
<section id="video" className="container mx-auto px-6 py-20">
 <div className="mt-6 grid gap-6 md:grid-cols-2">
  {/* First video */}
  <div className="rounded-3xl overflow-hidden border border-neutral-800">
    <div className="aspect-video">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/ES-oNObxC_s?si=kORkXWHhBQhDx7_J"
        title="Official Music Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
    <div className="p-4 text-sm text-neutral-300">Official Music Video</div>
  </div>

  {/* Second video */}
  <div className="rounded-3xl overflow-hidden border border-neutral-800">
    <div className="aspect-video">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/1wBtAQU7iLE?si=lonSp2DjCPCA7fwO"
        title="Live Performance Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
    <div className="p-4 text-sm text-neutral-300">Live Performance Video</div>
  </div>
</div>
</section>


{/* FEATURED TRACKS */}
<section id="music" className="container mx-auto px-6 py-20">
  <div className="flex items-center gap-3">
    <Music2 className="w-6 h-6" />
    <h2 className="text-2xl md:text-3xl font-bold">Featured Tracks</h2>
  </div>

  <div className="mt-6 grid gap-6 md:grid-cols-2">
    {/* First track */}
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-4">
      <iframe
        style={{ borderRadius: 12 }}
        src="https://open.spotify.com/embed/track/4mIDnH67YoPPmTHBdz2Kv3?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Track 1"
        allowFullScreen
      />
    </div>

    {/* Second track */}
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-4">
      <iframe
        style={{ borderRadius: 12 }}
        src="https://open.spotify.com/embed/track/00WUTTecPsgVEKJVKvIRow?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Track 2"
        allowFullScreen
      />
    </div>
  </div>
</section>



{/* GALLERY */}
<section id="gallery" className="container mx-auto px-6 py-20">
  <h2 className="text-2xl md:text-3xl font-bold">Gallery</h2>

  {/* Grid */}
  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
    {IMAGES.map((img, idx) => (
      <button
        key={img.src}
        onClick={() => openLightbox(idx)}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50"
        aria-label={`Open image: ${img.alt}`}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* subtle overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
      </button>
    ))}
  </div>

  {/* Lightbox */}
  {lightboxOpen && (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-6xl w-full">
        {/* Image */}
        <img
          src={IMAGES[activeIndex].src}
          alt={IMAGES[activeIndex].alt}
          className="w-full h-auto rounded-2xl border border-neutral-800 shadow-2xl"
        />

        {/* Caption */}
        <div className="mt-3 text-center text-neutral-300 text-sm">
          {IMAGES[activeIndex].alt}
        </div>

        {/* Controls */}
        <button
          onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          className="absolute top-3 right-3 rounde-full bg-neutral-900/80 border border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-800"
          aria-label="Close"
        >
          ✕
        </button>

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
          aria-label="Previous image"
        >
          ←
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
          aria-label="Next image"
        >
          →
        </button>
      </div>
    </div>
  )}
</section>





{/* CONTACT */}
<section id="contact" className="container mx-auto px-6 py-20">
  <div className="flex items-center gap-3">
    <Mail className="w-6 h-6" />
    <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
  </div>

  <div className="mt-6 grid md:grid-cols-2 gap-6">
    {/* Left column: form */}
    <form className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
      <div className="grid gap-4">
        <input
          placeholder="Your name"
          className="w-full rounded-xl bg-neutral-950/60 border border-neutral-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
        />
        <input
          placeholder="Your email"
          className="w-full rounded-xl bg-neutral-950/60 border border-neutral-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
        />
        <textarea
          placeholder="Message"
          rows={5}
          className="w-full rounded-xl bg-neutral-950/60 border border-neutral-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
        />
        <button
          type="button"
          className="rounded-xl bg-fuchsia-600 px-4 py-3 font-semibold hover:brightness-110"
        >
          Send
        </button>
      </div>
    </form>

    {/* Right column: booking info + socials */}
    <div className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
      <h3 className="font-semibold">Booking & Press</h3>
      <p className="text-neutral-300 mt-2">
        For bookings, press, or collaborations, email{" "}
        <a className="underline" href="mailto:stryebandofficial@gmail.com">
          stryebandofficial@gmail.com
        </a>.
      </p>
      <div className="mt-6 flex gap-3">
        <a
          href="https://www.instagram.com/strykerocks/"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900"
        >
          <Instagram className="w-4 h-4" /> Instagram
        </a>
        <a
          href="https://www.youtube.com/@StrykeBandOfficial"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 px-3 py-2 hover:bg-neutral-900"
        >
          <Youtube className="w-4 h-4" /> YouTube
        </a>
      </div>

      {/* Newsletter */}
      <div id="newsletter" className="mt-12 rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
        <h3 className="font-semibold">Get new music & show alerts</h3>
        <div className="mt-4 flex gap-2 max-w-md">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-xl bg-neutral-950/60 border border-neutral-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
          />
          <button className="rounded-xl bg-fuchsia-600 px-4 py-3 font-semibold hover:brightness-110">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          Connect this to Mailchimp, ConvertKit, or Beehiiv.
        </p>
      </div>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer className="border-t border-neutral-900">
  <div className="container mx-auto px-6 py-10 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
    <div>© {year} STRYKE — All rights reserved.</div>
    <div className="flex gap-4">
      <a href="#" className="hover:text-neutral-200">Privacy</a>
      <a href="#" className="hover:text-neutral-200">Terms</a>
      <a href="#contact" className="hover:text-neutral-200">Contact</a>
    </div>
  </div>
</footer>
</div>
);
}

