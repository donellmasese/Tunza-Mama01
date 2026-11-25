import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MOOD_OPTIONS = [
  { emoji: "🌱", label: "Grounded", title: "You are resting in peace", note: "Take a gentle breath and savor this calm moment, Mama." },
  { emoji: "🌸", label: "Tender", title: "You are holding gentle joy", note: "Celebrate the small moments of warmth with your baby today." },
  { emoji: "🌧️", label: "Tired", title: "You are carrying heavy fatigue", note: "Rest when you can, Mama. Your body and mind have done monumental labor. Drink water and allow yourself grace today." },
  { emoji: "⚡", label: "Anxious", title: "You are feeling fluttery anxiety", note: "You do not have to carry every worry alone. Consider booking a calm check-in with a counsellor." },
  { emoji: "🫂", label: "Heavy", title: "You are feeling isolated or low", note: "Your feelings are valid. Reaching out to a verified maternal counsellor is a strong, caring step." },
];

const FAQS = [
  {
    q: "Is my identity and counselling completely confidential?",
    a: "Yes, 100%. Tunza Mama adheres to strict healthcare confidentiality codes and Kenya Data Protection Act standards. Neither family members nor unauthorized users can access your private counselling records.",
  },
  {
    q: "How do virtual online sessions work if I have a crying baby?",
    a: "Our counsellors specialize specifically in maternal care—crying infants, breastfeeding breaks, and rocking pauses are completely welcomed during your online or phone session.",
  },
  {
    q: "How does appointment booking and follow-up support work?",
    a: "Create a free account, filter counsellors by specialization and availability, and request a convenient time slot. Once confirmed, you receive scheduled reminders and post-session follow-up notes in your dashboard.",
  },
  {
    q: "What if I need immediate psychiatric emergency care?",
    a: "Tunza Mama focuses on non-acute structured psychological counselling coordination. For urgent emergencies, please call the toll-free Kenyan Mental Health Crisis Line at 1199 or visit the nearest hospital immediately.",
  },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[2]);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleRoleSwitch = (e) => {
    const val = e.target.value;
    if (val === "mother") navigate("/woman-dashboard");
    if (val === "counsellor") navigate("/counsellor-dashboard");
    if (val === "admin") navigate("/admin-dashboard");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg">
            <Link className="flex items-center gap-space-sm" to="/">
              <span className="material-symbols-outlined text-primary text-[30px]">spa</span>
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                Tunza Mama
              </span>
            </Link>
            <nav className="hidden xl:flex items-center gap-space-xs">
              <Link className="transition-colors bg-surface-container-high text-primary font-bold rounded-full px-4 py-2" to="/">
                Home
              </Link>
              <a className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full" href="#about">
                About Us
              </a>
              <a className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full" href="#services">
                Services
              </a>
              <Link className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full" to="/counsellors">
                Find a Counsellor
              </Link>
              <a className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full" href="#contact">
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm sm:gap-space-md">
            <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full shadow-[0_1px_4px_rgba(126,74,158,0.06)]">
              <span className="font-caption text-caption text-on-surface-variant mr-2 uppercase tracking-wider">
                Demo View
              </span>
              <select
                onChange={handleRoleSwitch}
                defaultValue=""
                className="bg-transparent font-label-md text-label-md text-primary font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="" disabled>Select Role</option>
                <option value="mother">Woman Dashboard</option>
                <option value="counsellor">Counsellor Dashboard</option>
                <option value="admin">Admin Dashboard</option>
              </select>
            </div>

            <Link
              className="hidden md:inline-flex px-4 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              to="/login"
            >
              Sign In
            </Link>
            <Link
              className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary font-label-lg text-label-lg text-on-primary shadow-[0_4px_16px_rgba(126,74,158,0.22)] hover:opacity-95 transition-opacity"
              to="/register"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background pb-space-xl pt-space-md lg:pt-space-lg">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-secondary-fixed/40 rounded-full blur-3xl -z-10 opacity-70"></div>
            <div className="pointer-events-none absolute top-48 -right-20 w-[420px] h-[420px] bg-primary-fixed/30 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-surface-container-high shadow-sm text-secondary">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                      Kenya Perinatal Mental Health Sanctuary
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    Nurturing Mothers, Uplifting Families{" "}
                    <span className="text-primary block sm:inline">across Kenya</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    A gentle, confidential, and empathetic mental wellness platform for pregnant and postpartum women. Connect with qualified maternal mental health counsellors, check availability, request appointments, and receive continuous follow-up support.
                  </p>

                  {/* Dual CTAs */}
                  <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                    <Link
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg shadow-md hover:bg-on-secondary-container transition-all hover:scale-[1.02]"
                      to="/counsellors"
                    >
                      <span className="material-symbols-outlined text-[20px]">person_search</span>
                      Find a Counsellor
                    </Link>
                    <a
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg shadow-sm hover:bg-surface-variant transition-all"
                      href="#how-it-works"
                    >
                      <span className="material-symbols-outlined text-[20px]">spa</span>
                      Learn How It Works
                    </a>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-space-md grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container-lowest shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Qualified Counsellors
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container-lowest shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        100% Confidential
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container-lowest shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Online &amp; In-Person
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Card Column */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    <div className="rounded-xl overflow-hidden shadow-xl bg-surface-container-lowest p-2">
                      <img
                        alt="Mother embracing her newborn"
                        className="w-full h-96 lg:h-[440px] object-cover rounded-lg"
                        src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=900&q=80"
                      />
                    </div>
                    <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-lg shadow-xl max-w-xs flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary flex-shrink-0">
                        <span className="material-symbols-outlined text-[24px]">self_improvement</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md font-bold text-on-surface">
                          You Are Not Alone, Mama
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          Coordinated maternal counselling &amp; follow-up care across Kenya.
                        </p>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-tertiary text-on-tertiary px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
                        psychology_alt
                      </span>
                      <span className="font-label-md text-label-md font-semibold">
                        Supportive Care
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About / Maternal Mental Health Introduction */}
          <section className="py-space-xl bg-surface-container-lowest" id="about">
            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                <div className="max-w-2xl">
                  <span className="font-caption text-caption uppercase tracking-wider text-secondary font-bold">
                    About Tunza Mama
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Supporting Maternal Wellbeing During Pregnancy &amp; After Childbirth
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                    Pregnancy and the postpartum period bring major emotional and physical changes. Tunza Mama bridges the gap between expectant or new mothers and qualified counsellors by simplifying appointment booking, reminders, and continuous follow-up support.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                    Swahili &amp; English
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md">
                    Confidential Support
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="bg-surface-container-low rounded-lg p-space-lg flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">rainy</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Postpartum Blues &amp; Emotional Distress
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Sudden mood shifts, deep fatigue, and feeling overwhelmed after delivery are common signals that deserve compassionate, non-judgmental counselling support.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container rounded-lg p-space-lg flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">bubble_chart</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Antenatal Anxiety &amp; Birth Concerns
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Concerns around pregnancy changes, delivery preparation, or balancing family responsibilities are met with practical emotional support from trained counsellors.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-space-lg flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">family_restroom</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Safe &amp; Accessible Coordination
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                      Designed to be welcoming and easy to use on phones, tablets, or laptops so every mother can view counsellor availability and track her sessions effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-space-xl bg-surface" id="services">
            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="text-center max-w-3xl mx-auto mb-space-lg">
                <span className="font-caption text-caption uppercase tracking-wider text-primary font-bold">
                  Our Support Services
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                  Maternal Mental Health Support at Every Stage
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">pregnant_woman</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Emotional Wellbeing During Pregnancy
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    One-on-one counselling to help expectant mothers navigate stress, anxiety, and emotional transitions throughout pregnancy.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">child_care</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Postpartum Emotional Support
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    Dedicated post-delivery counselling for mothers adjusting to newborn care, recovery, and postpartum emotional distress.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Maternal Mental Health Counselling
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    Structured counselling sessions delivered by qualified professionals either online or in-person based on your comfort.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Counselling Appointment Coordination
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    Real-time counsellor availability checks, conflict-free appointment booking, and timely session reminders.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">quick_reference</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Follow-Up Support &amp; Referrals
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                    Recorded post-session action plans, scheduled follow-up dates, and coordinated referrals to specialized care when needed.
                  </p>
                </div>
              </div>

              {/* Safety & Scope Notice */}
              <div className="mt-space-lg bg-surface-container-high/80 rounded-lg p-space-md flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[26px] flex-shrink-0">info</span>
                <p className="font-body-md text-body-md text-on-surface">
                  <span className="font-semibold text-secondary">Important Notice:</span> Tunza Mama supports maternal mental health counselling coordination and does not provide medical diagnosis, replace professional medical care, or operate as an emergency crisis service. If you need urgent help, please visit the nearest health facility or call <strong>1199</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works 4-Step Section */}
          <section className="py-space-xl bg-surface-container-low" id="how-it-works">
            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="text-center max-w-2xl mx-auto mb-space-lg">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary font-bold">
                  How It Works
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                  Four Simple Steps to Support
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {[
                  { step: "1", title: "Create an Account", desc: "Register quickly as a pregnant or postpartum woman with your basic contact details." },
                  { step: "2", title: "Find a Suitable Counsellor", desc: "Browse verified counsellors and filter by specialisation, session mode, and availability." },
                  { step: "3", title: "Request an Appointment", desc: "Choose an open date and time slot for an online or in-person counselling session." },
                  { step: "4", title: "Receive Reminders & Follow-Up", desc: "Get appointment updates, session reminders, and personalized follow-up steps." },
                ].map((item) => (
                  <div key={item.step} className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
                    <span className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-headline-md font-bold mb-4">
                      {item.step}
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Counsellors Section (Sample Prototype Data) */}
          <section className="py-space-xl bg-surface">
            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
                <div>
                  <span className="font-caption text-caption uppercase tracking-wider text-primary font-bold">
                    Sample Prototype Directory
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Featured Maternal Counsellors
                  </h2>
                </div>
                <Link
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg hover:bg-surface-variant transition-colors self-start md:self-auto"
                  to="/counsellors"
                >
                  View All Counsellors
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {[
                  {
                    name: "Sample Counsellor A",
                    qual: "MSc Counselling Psychology",
                    spec: "Emotional Wellbeing During Pregnancy",
                    avail: "Mon – Fri • 9:00 AM – 4:00 PM",
                    mode: "Online & In-Person",
                  },
                  {
                    name: "Sample Counsellor B",
                    qual: "BA Community & Maternal Counselling",
                    spec: "Postpartum Emotional Support",
                    avail: "Tue – Sat • 10:00 AM – 5:00 PM",
                    mode: "Online Counselling",
                  },
                  {
                    name: "Sample Counsellor C",
                    qual: "Diploma in Perinatal Mental Health",
                    spec: "Antenatal & Postnatal Transitions",
                    avail: "Mon, Wed, Fri • 8:30 AM – 3:30 PM",
                    mode: "In-Person & Online",
                  },
                ].map((c, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold">
                          {c.name.slice(-1)}
                        </div>
                        <div>
                          <h3 className="font-title-md text-title-md text-on-surface font-bold">{c.name}</h3>
                          <p className="font-caption text-caption text-on-surface-variant">{c.qual}</p>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-md text-label-md mb-3">
                        {c.spec}
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        <strong>Availability:</strong> {c.avail}
                      </p>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        <strong>Session Type:</strong> {c.mode}
                      </p>
                    </div>
                    <div className="mt-space-lg flex gap-2">
                      <Link
                        to="/counsellors"
                        className="flex-1 text-center px-4 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg text-label-lg"
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/book"
                        className="flex-1 text-center px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg"
                      >
                        Request Session
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Mood Check-In + FAQs */}
          <section className="py-space-xl bg-surface-container-lowest">
            <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Interactive Mood Check-In */}
              <div className="lg:col-span-5 bg-surface-container-low rounded-lg p-space-lg shadow-sm h-fit">
                <span className="font-label-md text-label-md text-secondary uppercase font-bold tracking-wider">
                  Mama Daily Check-in
                </span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold mt-1">
                  How is your heart feeling today, Mama?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 mb-5">
                  A gentle self-reflection tool (informational only, not a clinical diagnosis).
                </p>
                <div className="grid grid-cols-5 gap-2 text-center mb-5">
                  {MOOD_OPTIONS.map((m) => {
                    const active = selectedMood.label === m.label;
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setSelectedMood(m)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                          active
                            ? "bg-secondary text-on-secondary shadow-md"
                            : "bg-surface-container-lowest hover:bg-secondary-fixed text-on-surface"
                        }`}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="font-caption text-caption font-semibold">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-lowest border-l-4 border-secondary">
                  <p className="font-label-md text-label-md text-on-surface font-bold">
                    {selectedMood.title}
                  </p>
                  <p className="font-caption text-caption text-on-surface-variant mt-1">
                    {selectedMood.note}
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="lg:col-span-7">
                <span className="font-caption text-caption uppercase tracking-wider text-primary font-bold">
                  Frequently Asked Questions
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 mb-4">
                  Common Questions About Tunza Mama
                </h2>
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-surface-container-low rounded-lg p-space-md shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left gap-4"
                      >
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          {faq.q}
                        </span>
                        <span className="material-symbols-outlined text-primary">
                          {openFaq === idx ? "expand_less" : "expand_more"}
                        </span>
                      </button>
                      {openFaq === idx && (
                        <p className="mt-3 pt-2 text-on-surface-variant font-body-md text-body-md">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-space-xl" id="contact">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm">
            <div className="flex items-center gap-space-md">
              <span className="material-symbols-outlined text-tertiary text-[28px]">health_and_safety</span>
              <div>
                <h4 className="font-title-md text-title-md text-tertiary font-semibold">
                  Urgent Help &amp; Crisis Contacts (Kenya)
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Tunza Mama is not an emergency crisis service. For urgent support in Kenya, call{" "}
                  <strong className="text-tertiary">1199</strong> or visit your nearest hospital.
                </p>
              </div>
            </div>
            <Link
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-sm hover:opacity-90 transition-opacity"
              to="/counsellors"
            >
              Find a Counsellor
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md font-body-md text-body-md text-on-surface-variant">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary">spa</span>
              <span className="font-label-md text-label-md text-on-surface">
                © 2026 Tunza Mama Management System — Digital Maternal Mental Health Counselling &amp; Support Platform
              </span>
            </div>
            <div className="flex items-center gap-space-lg font-label-md text-label-md">
              <Link className="hover:text-primary" to="/">Home</Link>
              <Link className="hover:text-primary" to="/counsellors">Counsellors</Link>
              <Link className="hover:text-primary" to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}