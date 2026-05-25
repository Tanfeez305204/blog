import TopBar from "@/components/admin/TopBar";

export default function SettingsPage() {
  const integrations = ["Google Analytics", "Cloudinary", "Mailchimp", "OpenAI"];
  return (
    <>
      <TopBar title="Settings" />
      <main className="grid gap-8 p-5 md:ml-72 md:p-12 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-3xl font-bold">Site Settings</h2>
          <div className="mt-6 grid gap-4">
            <label className="font-semibold">Site Name<input defaultValue="Qalam Blog Studio" className="mt-2 w-full rounded border border-stone-300 p-3" /></label>
            <label className="font-semibold">Domain<input defaultValue={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"} className="mt-2 w-full rounded border border-stone-300 p-3" /></label>
            <label className="font-semibold">Tagline<input defaultValue="Daily ideas for sharp readers" className="mt-2 w-full rounded border border-stone-300 p-3" /></label>
            <button className="w-fit rounded-lg bg-accent px-5 py-3 font-bold text-white">Save Settings</button>
          </div>
        </section>
        <aside className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="font-heading text-3xl font-bold">Integrations</h2>
          <div className="mt-6 space-y-3">
            {integrations.map((item) => (
              <div key={item} className="flex items-center justify-between rounded border border-stone-200 p-3">
                <span className="font-semibold">{item}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Ready</span>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </>
  );
}
