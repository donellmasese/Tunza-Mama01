import { useState } from "react";
import { apiRequest, getCurrentUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

const COUNSELLORS = [
  {
    id: 1,
    name: "Sample Counsellor A",
    qualification: "MSc Counselling Psychology • Perinatal Care",
    badge: "Prenatal & Postpartum Specialist",
    specialties: ["antenatal", "postpartum"],
    specialtyLabels: ["Emotional Wellbeing During Pregnancy", "Postpartum Support"],
    mode: "both",
    modeLabel: "Online & In-Person",
    language: "both",
    languageLabel: "English & Kiswahili",
    availKey: "tomorrow",
    availLabel: "Tomorrow • 10:00 AM",
    location: "Nairobi Counselling Room & Online",
    bio: "Compassionate, non-judgmental support for expectant and new mothers navigating pregnancy stress, mood shifts, and post-delivery adjustment.",
  },
  {
    id: 2,
    name: "Sample Counsellor B",
    qualification: "BA Community & Maternal Counselling",
    badge: "First-Time Mother Support",
    specialties: ["antenatal", "parenting-stress"],
    specialtyLabels: ["Antenatal Stress & Worry", "Early Motherhood Transition"],
    mode: "online",
    modeLabel: "Online Session",
    language: "both",
    languageLabel: "English & Kiswahili",
    availKey: "today",
    availLabel: "Today • 4:30 PM",
    location: "Online Tele-Counselling",
    bio: "Helping expectant and first-time mothers build emotional resilience, manage birth anticipation anxiety, and establish calm daily routines.",
  },
  {
    id: 3,
    name: "Sample Counsellor C",
    qualification: "Diploma in Perinatal Mental Health",
    badge: "Post-Delivery Recovery",
    specialties: ["postpartum", "birth-trauma"],
    specialtyLabels: ["Postpartum Emotional Distress", "Birth Recovery Support"],
    mode: "both",
    modeLabel: "Online & In-Person",
    language: "both",
    languageLabel: "English & Kiswahili",
    availKey: "this-week",
    availLabel: "Thursday • 11:30 AM",
    location: "Kisumu Centre & Online",
    bio: "Dedicated emotional support for mothers recovering from difficult deliveries, prolonged hospital stays, or overwhelming postpartum exhaustion.",
  },
  {
    id: 4,
    name: "Sample Counsellor D",
    qualification: "MA Perinatal & Family Counselling",
    badge: "Family & Postpartum Support",
    specialties: ["postpartum", "parenting-stress"],
    specialtyLabels: ["Postpartum Transitions", "Family & Partner Adjustment"],
    mode: "online",
    modeLabel: "Online Session",
    language: "english",
    languageLabel: "English",
    availKey: "this-week",
    availLabel: "Wednesday • 2:00 PM",
    location: "Online Video or Phone Call",
    bio: "Supporting mothers and families as they adjust to newborn care responsibilities, sleep disruption, and emotional wellbeing after childbirth.",
  },
  {
    id: 5,
    name: "Sample Counsellor E",
    qualification: "BSc Psychological Counselling",
    badge: "Antenatal Wellness",
    specialties: ["antenatal", "high-risk"],
    specialtyLabels: ["High-Risk Pregnancy Support", "Pregnancy Anxiety"],
    mode: "both",
    modeLabel: "Online & In-Person",
    language: "kiswahili",
    languageLabel: "Kiswahili & English",
    availKey: "tomorrow",
    availLabel: "Tomorrow • 3:00 PM",
    location: "Mombasa Clinic & Online",
    bio: "Providing steady emotional reassurance and structured coping strategies for mothers experiencing medical complications or pregnancy anxiety.",
  },
  {
    id: 6,
    name: "Sample Counsellor F",
    qualification: "Certified Maternal Health Counsellor",
    badge: "Young Mothers Support",
    specialties: ["parenting-stress", "antenatal"],
    specialtyLabels: ["Young Mother Support", "Confidence & Self-Care"],
    mode: "both",
    modeLabel: "Online & In-Person",
    language: "both",
    languageLabel: "English & Kiswahili",
    availKey: "weekend",
    availLabel: "Saturday • 9:00 AM",
    location: "Nairobi Westlands & Online",
    bio: "Creating a stigma-free, welcoming environment for young and first-time mothers seeking confidential guidance and ongoing follow-up care.",
  },
];

const SPECIALTY_CHIPS = [
  { key: "all", label: "All Specialisations" },
  { key: "antenatal", label: "Antenatal & Pregnancy Anxiety" },
  { key: "postpartum", label: "Postpartum Emotional Support" },
  { key: "birth-trauma", label: "Birth Recovery & Loss" },
  { key: "parenting-stress", label: "Motherhood Transitions" },
  { key: "high-risk", label: "High-Risk Pregnancy" },
];

export default function FindCounsellor() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [language, setLanguage] = useState("all");
  const [mode, setMode] = useState("all");
  const [specialty, setSpecialty] = useState("all");

  // Booking modal state
  const [bookingCounsellor, setBookingCounsellor] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    sessionType: "Online",
    notes: "",
  });

  // Profile modal state
  const [profileCounsellor, setProfileCounsellor] = useState(null);

  const filteredCounsellors = COUNSELLORS.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.specialtyLabels.some((s) => s.toLowerCase().includes(q));

    const matchesAvail = availability === "all" || c.availKey === availability;
    const matchesLang = language === "all" || c.language === "both" || c.language === language;
    const matchesMode = mode === "all" || c.mode === "both" || c.mode === mode;
    const matchesSpec = specialty === "all" || c.specialties.includes(specialty);

    return matchesSearch && matchesAvail && matchesLang && matchesMode && matchesSpec;
  });

  const resetFilters = () => {
    setSearch("");
    setAvailability("all");
    setLanguage("all");
    setMode("all");
    setSpecialty("all");
  };

  const openBooking = (counsellor) => {
    setBookingCounsellor(counsellor);
    setBookingSubmitted(false);
    setBookingForm({
      fullName: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      sessionType: counsellor.mode === "online" ? "Online" : "Online",
      notes: "",
    });
  };

 const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          womanId: user?.id || 4,
          counsellorId: bookingTarget.id,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
          sessionMode: bookingMode === "online" ? "Online" : "In-Person",
          notes: bookingNotes,
        }),
      });
      setBookingSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleSwitch = (e) => {
    const val = e.target.value;
    if (val === "mother") navigate("/woman-dashboard");
    if (val === "counsellor") navigate("/counsellor-dashboard");
    if (val === "admin") navigate("/admin-dashboard");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header */}
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
              <Link
                className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
                to="/"
              >
                Home
              </Link>
              <Link
                className="transition-colors bg-surface-container-high text-primary font-bold rounded-full px-4 py-2"
                to="/counsellors"
              >
                Find a Counsellor
              </Link>
              <Link
                className="px-3 py-2 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
                to="/woman-dashboard"
              >
                My Appointments
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm sm:gap-space-md">
            <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full shadow-sm">
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
              className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary font-label-lg text-label-lg text-on-primary shadow-md hover:opacity-95 transition-opacity"
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
          {/* Intro Banner */}
          <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-md">
            <div className="bg-surface-container-low rounded-lg p-space-lg md:p-space-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest text-tertiary px-3.5 py-1.5 rounded-full shadow-sm mb-space-sm">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span className="font-label-md text-label-md font-semibold tracking-wide uppercase">
                    Verified Maternal Mental Health Counsellors
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                  Find Your Maternal Mental Health Counsellor
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-2xl leading-relaxed">
                  Browse qualified counsellors supporting pregnant and postpartum women. Filter by specialisation, availability, and session mode, then request an appointment that fits your schedule.
                </p>
              </div>

              <div className="relative z-10 w-full md:w-auto shrink-0">
                <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-3 rounded-DEFAULT shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">call</span>
                  </div>
                  <div>
                    <div className="font-caption text-caption uppercase tracking-wider text-outline">
                      Urgent Crisis Support (Kenya)
                    </div>
                    <div className="font-title-md text-title-md font-bold text-tertiary">
                      Call 1199 (Toll-Free)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search & Filters */}
          <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-sm">
            <div className="bg-surface-container-lowest rounded-lg p-space-md md:p-space-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by counsellor, location, or focus..."
                    className="w-full bg-surface-bright text-on-surface placeholder:text-outline pl-11 pr-4 py-3 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>

                {/* Availability */}
                <div className="md:col-span-3 relative">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface pl-4 pr-10 py-3 rounded-full font-label-lg text-label-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    <option value="all">Availability: Any Time</option>
                    <option value="today">Available Today</option>
                    <option value="tomorrow">Available Tomorrow</option>
                    <option value="this-week">This Week</option>
                    <option value="weekend">Weekend Slots</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>

                {/* Language */}
                <div className="md:col-span-2 relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none bg-surface-container-low text-on-surface pl-4 pr-9 py-3 rounded-full font-label-lg text-label-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="kiswahili">Kiswahili</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                    translate
                  </span>
                </div>

                {/* Session Mode */}
                <div className="md:col-span-3 flex items-center justify-end bg-surface-container-low p-1 rounded-full shadow-inner">
                  {[
                    { key: "all", label: "All Modes" },
                    { key: "online", label: "Online" },
                    { key: "in-person", label: "In-Person" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setMode(item.key)}
                      className={`flex-1 py-2 px-3 rounded-full font-label-md text-label-md transition-all ${
                        mode === item.key
                          ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialisation Chips */}
              <div className="flex items-center gap-space-xs overflow-x-auto pt-space-md pb-space-xs">
                <span className="font-label-md text-label-md text-outline shrink-0 mr-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">filter_alt</span> Focus:
                </span>
                {SPECIALTY_CHIPS.map((chip) => {
                  const active = specialty === chip.key;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setSpecialty(chip.key)}
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all ${
                        active
                          ? "bg-primary text-on-primary font-semibold shadow-sm"
                          : "bg-surface-container-high text-on-surface font-medium hover:bg-surface-container"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Counsellor Cards + Sidebar */}
          <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Directory Grid */}
              <div className="lg:col-span-8 flex flex-col gap-space-md">
                <div className="flex items-center justify-between px-space-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Available Counsellors (Sample Prototype Data)
                    </span>
                    <span className="bg-surface-container-high font-label-md text-label-md text-primary font-bold px-2.5 py-0.5 rounded-full">
                      {filteredCounsellors.length} available
                    </span>
                  </div>
                </div>

                {filteredCounsellors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {filteredCounsellors.map((c) => (
                      <article
                        key={c.id}
                        className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col gap-space-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-headline-md font-bold shrink-0">
                              {c.name.slice(-1)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-caption text-caption text-tertiary bg-tertiary-fixed px-2.5 py-0.5 rounded-full font-semibold">
                                {c.badge}
                              </span>
                              <h2 className="font-title-md text-title-md font-bold text-on-surface mt-1 truncate">
                                {c.name}
                              </h2>
                              <p className="font-caption text-caption text-on-surface-variant">
                                {c.qualification}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {c.specialtyLabels.map((lbl, i) => (
                              <span
                                key={i}
                                className="font-caption text-caption bg-surface-container-high text-primary font-semibold px-2.5 py-1 rounded-full"
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>

                          <p className="font-body-md text-body-md text-on-surface-variant">
                            {c.bio}
                          </p>

                          <div className="bg-surface-container-low p-2.5 rounded-DEFAULT flex flex-col gap-1 font-label-md text-label-md text-on-surface mt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-tertiary">
                                  location_on
                                </span>
                                {c.location}
                              </span>
                              <span className="font-caption text-caption text-tertiary bg-surface-container-lowest px-2 py-0.5 rounded-full font-bold">
                                {c.availLabel}
                              </span>
                            </div>
                            <span className="font-caption text-caption text-on-surface-variant">
                              Languages: {c.languageLabel} • {c.modeLabel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-space-md pt-space-xs">
                          <button
                            type="button"
                            onClick={() => openBooking(c)}
                            className="flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-label-md font-semibold text-center shadow-sm hover:opacity-95 transition-opacity"
                          >
                            Request Appointment
                          </button>
                          <button
                            type="button"
                            onClick={() => setProfileCounsellor(c)}
                            className="px-4 py-2.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
                          >
                            Profile
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-lg text-center shadow-sm">
                    <span className="material-symbols-outlined text-primary text-[36px] mb-2">
                      manage_search
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      No matching counsellors found
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1 mb-space-md">
                      Try clearing your search or resetting the filters to view all available maternal counsellors.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 flex flex-col gap-space-md sticky top-24">
                <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-md">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      How Appointment Booking Works
                    </h3>
                  </div>
                  <ol className="flex flex-col gap-space-md font-body-md text-body-md text-on-surface-variant">
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-surface-container-high text-primary font-label-md font-bold flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <strong className="text-on-surface font-semibold block">
                          Choose a Suitable Counsellor
                        </strong>
                        Filter by specialization, session mode (online or in-person), and open availability.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-surface-container-high text-primary font-label-md font-bold flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <strong className="text-on-surface font-semibold block">
                          Submit Your Appointment Request
                        </strong>
                        Pick your preferred date and time slot without double-booking conflicts.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-surface-container-high text-primary font-label-md font-bold flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <strong className="text-on-surface font-semibold block">
                          Receive Reminders &amp; Follow-Up
                        </strong>
                        Track appointment status (Pending, Confirmed, Completed) and follow-up actions in your dashboard.
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-surface-container-high rounded-lg p-space-md text-on-surface-variant flex flex-col gap-2">
                  <span className="font-label-md text-label-md text-secondary uppercase font-bold">
                    Confidentiality &amp; Care Notice
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">
                    Your personal details and appointment notes are protected through role-based access control. Tunza Mama coordinates counselling support and does not replace emergency hospital care.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* Appointment Request Modal */}
      {bookingCounsellor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl relative">
            <button
              type="button"
              onClick={() => setBookingCounsellor(null)}
              className="absolute right-4 top-4 p-2 rounded-full text-outline hover:bg-surface-container-high text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-space-sm mb-space-md">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">calendar_today</span>
              </div>
              <div>
                <span className="font-caption text-caption uppercase tracking-wider text-secondary font-bold">
                  Counselling Appointment Request
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  {bookingCounsellor.name}
                </h3>
              </div>
            </div>

            {!bookingSubmitted ? (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-space-sm">
                <div className="bg-surface-container-low p-3 rounded-DEFAULT text-body-md">
                  <p>
                    <strong>Focus:</strong> {bookingCounsellor.specialtyLabels.join(", ")}
                  </p>
                  <p>
                    <strong>Next Open Slot:</strong> {bookingCounsellor.availLabel}
                  </p>
                </div>

                <div>
                  <label className="font-label-md text-label-md font-semibold block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                    placeholder="e.g. Sample User A"
                    className="w-full bg-surface-bright px-4 py-2.5 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-md text-label-md font-semibold block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="w-full bg-surface-bright px-4 py-2.5 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md font-semibold block mb-1">
                      Session Mode
                    </label>
                    <select
                      value={bookingForm.sessionType}
                      onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                      className="w-full bg-surface-bright px-4 py-2.5 rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    >
                      <option value="Online">Online Counselling</option>
                      <option value="In-Person">In-Person Session</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-label-md text-label-md font-semibold block mb-1">
                    Brief Reason / Support Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Share anything you would like your counsellor to know beforehand..."
                    className="w-full bg-surface-bright px-4 py-2 rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-label-lg text-label-lg font-semibold shadow-md hover:opacity-95"
                >
                  Submit Appointment Request
                </button>
              </form>
            ) : (
              <div className="text-center py-space-lg flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-sm">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Appointment Request Submitted
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1 mb-space-md">
                  Your request with <strong>{bookingCounsellor.name}</strong> is now marked{" "}
                  <strong>Pending Confirmation</strong>. You can track it in your Woman Dashboard.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingCounsellor(null)}
                    className="px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/woman-dashboard")}
                    className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg font-semibold"
                  >
                    Go to My Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Profile Modal */}
      {profileCounsellor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl relative">
            <button
              type="button"
              onClick={() => setProfileCounsellor(null)}
              className="absolute right-4 top-4 p-2 rounded-full text-outline hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <span className="font-caption text-caption uppercase tracking-wider text-tertiary font-bold">
              Counsellor Profile
            </span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
              {profileCounsellor.name}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {profileCounsellor.qualification}
            </p>
            <div className="mt-4 space-y-2 text-body-md">
              <p>{profileCounsellor.bio}</p>
              <p>
                <strong>Specialisations:</strong> {profileCounsellor.specialtyLabels.join(", ")}
              </p>
              <p>
                <strong>Availability:</strong> {profileCounsellor.availLabel}
              </p>
              <p>
                <strong>Session Mode:</strong> {profileCounsellor.modeLabel}
              </p>
              <p>
                <strong>Languages:</strong> {profileCounsellor.languageLabel}
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setProfileCounsellor(null)}
                className="flex-1 py-2.5 rounded-full bg-surface-container-high text-primary font-label-lg font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const c = profileCounsellor;
                  setProfileCounsellor(null);
                  openBooking(c);
                }}
                className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-lg font-semibold"
              >
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}