import { TreePine, Factory, Pencil, Shield, Clock, Sparkles } from "lucide-react"

const features = [
  {
    icon: TreePine,
    title: "Vật Liệu Chuẩn An Cường",
    description: "Cam kết 100% sử dụng ván gỗ công nghiệp An Cường cao cấp, đảm bảo độ bền và an toàn sức khỏe cho cả gia đình.",
    highlight: "Cam kết đền 200% nếu phát hiện gỗ giả"
  },
  {
    icon: Factory,
    title: "Xưởng Sản Xuất Trực Tiếp",
    description: "Sở hữu xưởng quy mô lớn tại Thanh Đa - Phúc Thọ, giúp bạn tiết kiệm tới 30% chi phí do không qua trung gian.",
    highlight: "Quản lý khép kín, đảm bảo đúng tiến độ"
  },
  {
    icon: Pencil,
    title: "Thiết Kế Độc Bản",
    description: "Đội ngũ KTS dày dặn kinh nghiệm luôn lắng nghe và hiện thực hóa phong cách cá nhân của bạn vào từng góc nhỏ.",
    highlight: "Báo giá chi tiết, tuyệt đối không phát sinh"
  }
]

const stats = [
  { value: "500+", label: "Dự án hoàn thành" },
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "100%", label: "Khách hàng hài lòng" },
  { value: "30%", label: "Tiết kiệm chi phí" }
]

export function FeaturesSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Tại sao chọn chúng tôi</p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 text-balance">
            Giải Pháp Trọn Gói Hoàn Hảo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Chúng tôi mang đến giải pháp nội thất toàn diện, từ thiết kế đến thi công với cam kết chất lượng cao nhất.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 lg:p-10 bg-card border border-border hover:border-accent/50 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl lg:text-2xl mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
              <p className="text-sm font-medium text-accent">{feature.highlight}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl lg:text-5xl mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
