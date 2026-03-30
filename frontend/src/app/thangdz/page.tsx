"use client";

export default function ThangDZPage() {
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
          Thang <span className="text-red-600">DZ</span> No.1
        </h1>
        <div className="h-2 w-32 bg-red-600 mx-auto mb-10" />
        <p className="text-stone-400 text-xl font-medium leading-relaxed">
          Hệ thống CI/CD Automation của NVHome hoạt động hoàn hảo.<br/>
          Tự động Pull & Build thành công! 🚀
        </p>
        <div className="mt-12 p-6 border border-stone-800 rounded-3xl bg-white/5 backdrop-blur-sm">
            <p className="text-xs font-black text-stone-500 uppercase tracking-[0.3em] mb-4">Pipeline Status</p>
            <div className="flex justify-center gap-4">
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                    Git Push Received
                </span>
                <span className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                    Docker Build Done
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
