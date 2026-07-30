export type Campus = 'banjarmasin' | 'banjarbaru'
export type Theme = 'aesthetic' | 'modern'
export type Role = 'buyer' | 'seller' | 'driver' | 'admin'
export type Category = 'makanan' | 'minuman' | 'fashion' | 'atk' | 'buku' | 'jasa' | 'kerajinan' | 'almamater'
export type PaymentMethod = 'qris' | 'dana' | 'gopay' | 'cod'
export type OrderStatus = 'menunggu' | 'dikemas' | 'diambil' | 'dikirim' | 'sampai' | 'selesai' | 'dibatalkan'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: Category
  campus: Campus | 'both'
  seller: string
  sellerType: 'koperasi' | 'mahasiswa'
  stock: number
  sold: number
  rating: number
  reviews: number
  description: string
  location: string
  tags?: string[]
}

export interface CartItem {
  product: Product
  qty: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryFee: number
  status: OrderStatus
  payment: PaymentMethod
  date: string
  deliveryMethod: 'kurir' | 'ambil-sendiri'
  location: string
  buyer: string
}

export interface Message {
  id: string
  from: 'buyer' | 'seller'
  text: string
  time: string
  read: boolean
}

export interface ChatThread {
  id: string
  seller: string
  sellerAvatar: string
  product: string
  messages: Message[]
}

export const CAMPUS_LABELS: Record<Campus, string> = {
  banjarmasin: 'Kampus 1 — Banjarmasin',
  banjarbaru: 'Kampus 2 — Banjarbaru',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  makanan: 'Makanan',
  minuman: 'Minuman',
  fashion: 'Fashion',
  atk: 'ATK',
  buku: 'Buku',
  jasa: 'Jasa',
  kerajinan: 'Kerajinan',
  almamater: 'Almamater',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  makanan: '🍱',
  minuman: '🧋',
  fashion: '👗',
  atk: '✏️',
  buku: '📚',
  jasa: '🎨',
  kerajinan: '🌸',
  almamater: '🎓',
}

export const PRODUCTS: Product[] = [
  {
    id: 'myammiy-01',
    name: 'Buket Thumbelina Custom (S, M, L, XL)',
    price: 65000,
    image: '/thumbelina.jpg',
    category: 'kerajinan',
    campus: 'both',
    seller: 'handmade by myammiy',
    sellerType: 'mahasiswa',
    stock: 20,
    sold: 142,
    rating: 5.0,
    reviews: 48,
    description: 'Buket bunga Thumbelina cantik buatan tangan. Tersedia pilihan ukuran S, M, L, dan XL. Bebas request warna bunga dan wrapping sesuai selera!',
    location: 'Bisa Request & Kirim Area Kampus',
    tags: ['buket', 'thumbelina', 'custom', 'handmade'],
  },
  {
    id: 'myammiy-02',
    name: 'Buket Mini Daisy Kawat Bulu (Isi 15 Tangkai)',
    price: 35000,
    image: '/daisy.jpg',
    category: 'kerajinan',
    campus: 'both',
    seller: 'handmade by myammiy',
    sellerType: 'mahasiswa',
    stock: 35,
    sold: 210,
    rating: 4.9,
    reviews: 64,
    description: 'Buket kawat bulu mini daisy isi 15 tangkai yang awet dan tidak akan layu. Sangat imut untuk hadiah ulang tahun, ujian, atau sidang! Bisa custom warna & jumlah tangkai.',
    location: 'Bisa Request & Kirim Area Kampus',
    tags: ['kawat bulu', 'daisy', 'buket mini', 'awet'],
  },
  {
    id: 'myammiy-03',
    name: 'Gantungan Kunci Kawat Bulu (Chicken Cute)',
    price: 25000,
    image: '/chiken.jpg',
    category: 'kerajinan',
    campus: 'both',
    seller: 'handmade by myammiy',
    sellerType: 'mahasiswa',
    stock: 50,
    sold: 315,
    rating: 5.0,
    reviews: 89,
    description: 'Gantungan kunci kawat bulu karakter Chicken Cute yang sangat gemas! Harap chat seller dahulu sebelum order jika ingin custom karakter/warna lain.',
    location: 'Bisa Request & Kirim Area Kampus',
    tags: ['ganci', 'kawat bulu', 'chicken cute', 'lucu'],
  },
  {
    id: 'myammiy-04',
    name: 'Gantungan Kunci Kain Flanel Custom Karakter',
    price: 45000,
    image: '/kain-flanel.jpg',
    category: 'kerajinan',
    campus: 'both',
    seller: 'handmade by myammiy',
    sellerType: 'mahasiswa',
    stock: 25,
    sold: 178,
    rating: 4.9,
    reviews: 52,
    description: 'Ganci unik buatan tangan dari kain flanel berkualitas. Bebas custom karakter apapun yang kamu mau!',
    location: 'Bisa Request & Kirim Area Kampus',
    tags: ['ganci', 'flanel', 'custom karakter', 'handmade'],
  },
  {
    id: 'myammiy-05',
    name: 'Aesthetic Cotton Bag Handmade + Free Special Bagcharm',
    price: 95000,
    image: '/cottonbag.jpg',
    category: 'kerajinan',
    campus: 'both',
    seller: 'handmade by myammiy',
    sellerType: 'mahasiswa',
    stock: 15,
    sold: 95,
    rating: 5.0,
    reviews: 38,
    description: 'Tas katun jahit tangan super estetik dan manis. Sudah termasuk Free Special Handmade Bagcharm unik untuk setiap pembeliannya!',
    location: 'Bisa Request & Kirim Area Kampus',
    tags: ['cotton bag', 'tas katun', 'aesthetic', 'free bagcharm'],
  }
]

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'c1',
    seller: 'handmade by myammiy',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    product: 'Gantungan Kunci Kawat Bulu',
    messages: [
      { id: 'm1', from: 'buyer', text: 'Kak, bisa custom ganci kawat bulu warna pink?', time: '10:23', read: true },
      { id: 'm2', from: 'seller', text: 'Bisa banget kak! Mau tambah pita kecil juga?', time: '10:25', read: true },
    ],
  },
]

export const SAMPLE_ORDERS: Order[] = []

export function formatRupiah(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID')
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}