import { Award, Bell, CalendarDays, CheckCircle2, CreditCard, Mail, Phone, ShieldCheck, ToggleLeft, User } from 'lucide-react'

const Profile = () => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <section className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-[1.25rem] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Student avatar"
                className="w-20 h-20 rounded-[1rem] object-cover border border-[var(--color-outline)]"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-white w-10 h-10 rounded-full grid place-items-center border-2 border-white shadow-sm">
                <User className="w-5 h-5" />
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-[0.16em] text-on-surface-variant font-semibold">
                Student profile
              </p>
              <h1 className="text-headline-lg text-on-surface font-semibold mt-2">
                Alex Johnson
              </h1>
              <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl leading-7">
                Passionate about algorithms and machine learning. Developing high-performance
                solutions for educational data analysis and keeping coursework organized.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1555c5]">
              Edit Profile
            </button>
            <button className="inline-flex items-center justify-center rounded-xl border border-[var(--color-outline)] bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-[#f7f9fb]">
              Share Profile
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                Cumulative GPA
              </p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">3.85</p>
            </div>
            <span className="rounded-2xl bg-[#eef4ff] px-3 py-1 text-sm font-semibold text-[#004ac6]">
              +0.05
            </span>
          </div>
          <p className="mt-4 text-body-md text-on-surface-variant leading-7">
            Consistent study routines and assignment review helped improve your GPA this term.
          </p>
        </article>

        <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                Degree progress
              </p>
              <p className="mt-3 text-4xl font-semibold text-on-surface">84/120</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#004ac6]">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 rounded-full bg-[#eef4ff] overflow-hidden h-3">
            <div className="h-3 w-[70%] rounded-full bg-primary" />
          </div>
          <p className="mt-3 text-body-md text-on-surface-variant leading-7">
            You are at 70% completion. Keep focus on major requirements and elective balance.
          </p>
        </article>

        <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                Current term
              </p>
              <p className="mt-3 text-2xl font-semibold text-on-surface">Fall 2024</p>
            </div>
            <span className="inline-flex items-center rounded-2xl bg-[#d0e1fb] px-3 py-1 text-sm font-semibold text-[#0b1c30]">
              In 5 Courses
            </span>
          </div>
          <p className="mt-4 text-body-md text-on-surface-variant leading-7">
            Midterms are in progress. Keep an eye on weekly checkpoints and review sessions.
          </p>
        </article>
      </section>

      {/* Inner profile grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-start">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                  Personal information
                </p>
                <h2 className="text-headline-md text-on-surface font-semibold mt-3">
                  Account details
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#eef4ff] px-3 py-2 text-sm font-semibold text-[#004ac6]">
                <Mail className="w-4 h-4" /> Verified
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-label-sm text-on-surface-variant font-semibold">Institutional email</p>
                <p className="mt-2 text-body-md text-on-surface">alex.j@lumina.edu</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-label-sm text-on-surface-variant font-semibold">Student ID</p>
                <p className="mt-2 text-body-md text-on-surface">LUM-849201</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-label-sm text-on-surface-variant font-semibold">Phone number</p>
                <p className="mt-2 text-body-md text-on-surface">+1 (555) 012-3456</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-label-sm text-on-surface-variant font-semibold">Degree program</p>
                <p className="mt-2 text-body-md text-on-surface">Computer Science</p>
              </div>
            </div>
          </article>

          <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-center">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                  Security
                </p>
                <h2 className="text-headline-md text-on-surface font-semibold mt-3">
                  Account protection
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#d0e1fb] px-3 py-2 text-sm font-semibold text-[#0b1c30]">
                <ShieldCheck className="w-4 h-4" /> Enabled
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#004ac6]">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-on-surface">Two-Factor Authentication</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">Enhanced account security for all StudyHub access.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#004ac6]">
                  <CreditCard className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-on-surface">Login alerts</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">Receive notifications for new sign-ins and device activity.</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="flex flex-col gap-6">
          <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-center">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                  Notification settings
                </p>
                <h2 className="text-headline-md text-on-surface font-semibold mt-3">
                  Stay informed
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-[#eef4ff] px-3 py-2 text-sm font-semibold text-[#004ac6]">
                <Bell className="w-4 h-4" /> Active
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#004ac6]">
                    <Bell className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">Email notifications</p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Summary of daily activities.</p>
                  </div>
                </div>
                <ToggleLeft className="w-10 h-10 text-primary" />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d0e1fb] text-[#0b1c30]">
                    <CalendarDays className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">App notifications</p>
                    <p className="text-label-sm text-on-surface-variant mt-1">Real-time study alerts.</p>
                  </div>
                </div>
                <ToggleLeft className="w-10 h-10 text-[#9ca3af]" />
              </div>
            </div>
          </article>

          <article className="bg-white border border-[var(--color-outline)]/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.03)] rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-col sm:flex-row sm:items-center">
              <div>
                <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
                  Achievements
                </p>
                <h2 className="text-headline-md text-on-surface font-semibold mt-3">
                  Recent milestones
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-[#eef4ff] px-3 py-2 text-sm font-semibold text-[#004ac6]">
                <CheckCircle2 className="w-4 h-4" /> 2 Completed
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-surface-container-low p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f2ff] text-[#004ac6]">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-body-md font-semibold text-on-surface">Dean&apos;s List — Fall 2023</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">Recognized for outstanding academic performance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-surface-container-low p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1e6] text-[#943700]">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-body-md font-semibold text-on-surface">Python for Data Science</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">Certified specialization by Lumina Tech Hub.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-[var(--color-outline)]/80 pt-4">
              <a href="#" className="text-sm font-semibold text-primary hover:underline">
                View All Achievements
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Profile
