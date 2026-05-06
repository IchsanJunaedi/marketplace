/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <div className={`bg-background text-on-background min-h-screen`}>
<Navbar active="Shop" />
<main className="pt-24 pb-16 max-w-[1440px] mx-auto px-6 lg:px-container-padding flex flex-col gap-12">
<section className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap items-center">
<div className="lg:col-span-5 flex flex-col items-start gap-6 pr-0 lg:pr-8">
<span className="font-label-caps text-label-caps text-surface-tint uppercase tracking-wider bg-secondary-container px-3 py-1 rounded-sm">B2B Procurement Platform</span>
<h1 className="font-h1 text-h1 text-on-background leading-tight text-4xl lg:text-5xl">Industrial-grade equipment for the modern enterprise.</h1>
<p className="font-body-md text-body-md text-on-surface-variant text-lg max-w-[32rem]">Streamline your supply chain with high-performance machinery, bulk materials, and certified components—delivered reliably to your facilities worldwide.</p>
<div className="flex items-center gap-4 mt-2">
<button className="bg-primary text-on-primary font-data-tabular text-data-tabular px-6 py-3 rounded hover:bg-surface-tint transition-colors active:scale-95 shadow-sm">
                        Explore Catalog
                    </button>
<button className="border border-outline bg-transparent text-on-surface font-data-tabular text-data-tabular px-6 py-3 rounded hover:bg-surface-container transition-colors active:scale-95">
                        Request Quote
                    </button>
</div>
</div>
<div className="lg:col-span-7 grid grid-cols-12 grid-rows-2 gap-unit h-[450px] mt-8 lg:mt-0">
<div className="col-span-12 md:col-span-8 row-span-2 relative rounded overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="close up of precision industrial machinery manufacturing part in clean bright factory" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRhO-EKdvQz_lR9ztk8wGMUp2aI9SolhVBDNmbfie1odLOXwrQpWKdlKM_uGhtde8b8_rjy1pa0O6rjVd0-ZApNhX95VZ_GiGQ4A_wQrmnts11w_n5UiMFrW2FWqopMahdOfnNYHj_DbDM4lX-3hgdIHFv-Qw7iygh9LlgGHBm0QIX_IO8WTedolcdsNw2fz04dzwr4l8rx5FTVJrtliANaTw4x88tBfzyxS-uYEKepYwvOWGLn-psxlr2xYDGyRCoshRDX4-6rWmK" />
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<div className="absolute bottom-6 left-6 right-6">
<p className="font-data-tabular text-data-tabular text-white bg-black/50 backdrop-blur-sm w-fit px-3 py-1 rounded-sm border border-white/20">Precision Engineering</p>
</div>
</div>
<div className="hidden md:block col-span-4 row-span-1 rounded overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="worker in safety gear inspecting automated assembly line in modern warehouse" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe_voRjygZFhApmTiV3Q0P44mC8jvB0HaHlAvTl2vxz6ZW33eN_wbYStxgz9jOc51ABKtgJ6cTqa-9bQccqL8V7geSFB-PlBS6cuDWP-TlRXlGJrXBeyFFnHAY5sH0PZlBvEgwB8SiReb5rRDqCd5c14txr0bmMnJ1uLxh4RVdsfFBaFEqTN9HKpttTU-9C78T2QkES5VJctyRXW4ooF2_qhGEfAHYRJK1f6SE276Re1enqxgXBK0To08AosOS5u2Awex4rKARuEBD" />
</div>
<div className="hidden md:block col-span-4 row-span-1 rounded overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="neatly organized rows of inventory boxes on tall metal shelves in distribution center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLuoxPO84hHs0bZwnTOlhESAhl-e7zwl3wEMrYqLObcRBRKgA6JXbxf7dFAVEeK45vxQWOXqU_h5j5bfC1zopuugFIjeSO0xgAfxi1tAove6NRl8iELXXXZyJpU7eWgInKs6NZH3POmoVFtN26K5qN6kiAXg4Z9tiMd828YkjFplzlZH83l8Qa07JmfBcL9MSTLh46G4TmpYP-cUhWo1JyIlYtA_KDN2i-79UxUVq1EIfqzdpBWIJM6EFtDqJZiDnMzzXqb6YA26KT" />
</div>
</div>
</section>
<section className="flex flex-col gap-6 mt-8">
<div className="flex items-center justify-between border-b border-surface-variant pb-4">
<h2 className="font-h2 text-h2 text-on-background">Feature Categories</h2>
<a className="font-body-sm text-body-sm text-surface-tint hover:underline flex items-center gap-1" href="#">
                    View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-card-gap">
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">precision_manufacturing</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Machinery</span>
</a>
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">inventory_2</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Bulk Materials</span>
</a>
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">memory</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Components</span>
</a>
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">hardware</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Tools</span>
</a>
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group hidden md:flex" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">construction</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Fasteners</span>
</a>
<a className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group hidden lg:flex" href="#">
<div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">engineering</span>
</div>
<span className="font-data-tabular text-data-tabular text-on-surface">Safety Gear</span>
</a>
</div>
</section>
</main>
    </div>
  );
}
