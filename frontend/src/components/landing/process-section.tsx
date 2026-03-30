const steps = [
  {
    number: "01",
    title: "Tư Vấn & Khảo Sát",
    description: "Lắng nghe nhu cầu, khảo sát hiện trạng và đưa ra tư vấn chuyên nghiệp miễn phí."
  },
  {
    number: "02",
    title: "Thiết Kế 3D",
    description: "Đội ngũ KTS thiết kế bản vẽ 3D chi tiết, giúp bạn hình dung rõ không gian tương lai."
  },
  {
    number: "03",
    title: "Báo Giá Chi Tiết",
    description: "Báo giá minh bạch từng hạng mục, cam kết không phát sinh chi phí."
  },
  {
    number: "04",
    title: "Sản Xuất & Thi Công",
    description: "Sản xuất tại xưởng riêng, thi công đúng tiến độ với đội ngũ thợ lành nghề."
  },
  {
    number: "05",
    title: "Nghiệm Thu & Bàn Giao",
    description: "Kiểm tra chất lượng kỹ lưỡng, bàn giao công trình hoàn hảo đến từng chi tiết."
  }
]

export function ProcessSection() {
  return (
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/60 mb-4">Quy trình làm việc</p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-balance">
            5 Bước Đơn Giản
          </h2>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-primary-foreground/20" />
              )}
              
              <div className="text-center">
                <span className="font-serif text-5xl lg:text-6xl text-primary-foreground/20 group-hover:text-primary-foreground/40 transition-colors duration-300">
                  {step.number}
                </span>
                <h3 className="font-serif text-lg lg:text-xl mt-4 mb-3">{step.title}</h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
