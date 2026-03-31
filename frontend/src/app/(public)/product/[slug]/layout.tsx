import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

async function getProduct(slug: string) {
  try {
    // Ưu tiên dùng biến môi trường nội bộ Docker nếu có, nếu không dùng Public URL
    const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:5232/api';
    
    // Đảm bảo URL là tuyệt đối cho Server-side fetch
    const fetchUrl = baseUrl.startsWith('http') ? `${baseUrl}/products/${slug}` : `http://nvhome_backend:5232/api/products/${slug}`;

    const res = await fetch(fetchUrl, {
      next: { revalidate: 3600 } // Cache SEO trong 1 giờ
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("SEO Metadata Fetch Error:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Sản phẩm | NVHome - Nội thất cao cấp',
      description: 'Khám phá bộ sưu tập nội thất sang trọng tại NVHome.'
    };
  }

  const images = product.images ? product.images.split(',') : [];
  const ogImage = images.length > 0 ? images[0] : '/logo.png';
  
  // Làm sạch mô tả (loại bỏ tag HTML) cho meta description
  const cleanDescription = product.description 
    ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) 
    : `Mua ngay ${product.name} tại NVHome. Thiết kế sang trọng, chất lượng vượt trội.`;

  return {
    title: `${product.name} | NVHome - Nội thất cao cấp`,
    description: cleanDescription,
    keywords: [product.name, 'nội thất nvhome', 'thiết kế nội thất', product.categoryName || ''],
    openGraph: {
      title: `${product.name} - NVHome`,
      description: cleanDescription,
      url: `https://nvhomes.vn/product/${slug}`,
      siteName: 'NVHome',
      images: [
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: cleanDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://nvhomes.vn/product/${slug}`,
    }
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
