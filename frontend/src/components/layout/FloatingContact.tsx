"use client";

export function FloatingContact() {
  return (
    <div className="fixed bottom-28 right-8 z-[100] flex flex-col gap-4">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me/0966245396" 
        target="_blank" 
        rel="noreferrer"
        className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-8 h-8 invert" />
        <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Chat Zalo</span>
      </a>

      {/* Call Button */}
      <a 
        href="tel:0966245396" 
        className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative animate-bounce"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Gọi Ngay: 0966.245.396</span>
      </a>
    </div>
  );
}
