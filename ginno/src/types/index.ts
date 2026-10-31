// Ginno E-Commerce System Types & Models

export type Language = 'EN' | 'TL' | 'ZH';
export type Currency = 'PHP';

// User & Member
export type MemberLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Address {
  id: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  streetDetail: string;
  zipCode: string;
  isDefault: boolean;
}

export type UserRole = 'buyer' | 'merchant' | 'admin';

export interface UserProfile {
  id: string;
  role?: UserRole;
  merchantId?: string;
  storeName?: string;
  nickname: string;
  phone: string;
  email: string;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  memberLevel: MemberLevel;
  points: number;
  walletBalance: number;
  inviteCode: string;
  registerSource: 'phone' | 'facebook' | 'google' | 'apple';
  status: 'active' | 'banned';
  createdAt: string;
}

// Product & Inventory
export interface Category {
  id: string;
  parentId?: string;
  nameEn: string;
  nameTl: string;
  nameZh: string;
  icon: string;
  banner?: string;
  sort: number;
  status: 'active' | 'inactive';
  level: 1 | 2 | 3;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface ProductSku {
  id: string;
  productId: string;
  skuCode: string;
  specs: Record<string, string>; // e.g. { Color: 'Red', Size: 'M' }
  price: number;
  originalPrice: number;
  costPrice: number;
  stock: number;
  stockWarning: number;
  salesCount: number;
  image?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId?: string;
  brandName?: string;
  brand?: string;
  spuCode?: string;
  titleEn: string;
  titleTl: string;
  titleZh?: string;
  subtitle?: string;
  subtitleZh?: string;
  subtitleTl?: string;
  mainImage: string;
  images: string[];
  videoUrl?: string;
  description: string;
  descriptionZh?: string;
  descriptionTl?: string;
  specsParams?: Array<{ key: string; value: string }>;
  specifications?: Record<string, string>;
  skus: ProductSku[];
  salesCount: number;
  reviewCount: number;
  rating: number; // 1-5
  status: 'online' | 'offline' | 'draft' | 'on_sale';
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleStock?: number;
  flashSaleSold?: number;
  isGroupBuy?: boolean;
  isAuction?: boolean;
  isGroupBuySupported?: boolean;
  isAuctionSupported?: boolean;
  isFreeShipping?: boolean;
  weightKg?: number;
  volumeCm3?: number;
  shippingFee?: number;
  origin?: string;
  limitPerUser?: number;
  seoTitle?: string;
  seoKeywords?: string;
  tags: string[]; // e.g. ['Free Shipping', 'Authentic', 'Hot']
  createdAt: string;
}

// Review
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  skuSpecs: string;
  comment: string;
  images?: string[];
  likeCount: number;
  merchantReply?: string;
  createdAt: string;
}

// Cart Item
export interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  quantity: number;
  selected: boolean;
  product: Product;
  sku: ProductSku;
}

// Group Buy (拼团)
export interface GroupBuyTier {
  peopleCount: 2 | 3 | 5;
  price: number;
}

export interface GroupBuyActivity {
  id: string;
  productId: string;
  title: string;
  startTime: string;
  endTime: string;
  groupExpireHours: number;
  tiers: GroupBuyTier[];
  maxGroupsPerUser?: number;
  virtualBuyEnabled: boolean;
  status: 'active' | 'ended' | 'upcoming';
  salesCount: number;
}

export interface GroupBuyMember {
  userId: string;
  nickname: string;
  avatar: string;
  isLeader: boolean;
  joinedAt: string;
  orderId: string;
}

export interface GroupBuyTeam {
  id: string;
  activityId: string;
  productId: string;
  teamNo: string;
  leaderUserId: string;
  leaderName: string;
  leaderAvatar: string;
  requiredCount: number;
  currentCount: number;
  tierPrice: number;
  expireTime: string; // ISO string
  status: 'forming' | 'success' | 'failed' | 'virtual_completed';
  members: GroupBuyMember[];
  createdAt: string;
}

// Auction (拍卖)
export interface BidIncrementRule {
  minPrice: number;
  maxPrice: number;
  increment: number;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  bidAmount: number;
  isAutoBid: boolean;
  bidTime: string;
  ipAddress?: string;
}

export interface AutoBidSetting {
  id: string;
  auctionId: string;
  userId: string;
  maxAmount: number;
  isActive: boolean;
}

export type AuctionStatus = 'upcoming' | 'live' | 'ended' | 'no_sale' | 'cancelled';

export interface AuctionItem {
  id: string;
  productId: string;
  skuId: string;
  title: string;
  mainImage: string;
  images: string[];
  description: string;
  startingBid: number;
  reservePrice?: number; // Minimum price for valid sale
  currentHighestBid: number;
  currentHighestBidderId?: string;
  currentHighestBidderName?: string;
  currentHighestBidderAvatar?: string;
  bidIncrement: number; // default min increment
  incrementRules?: BidIncrementRule[];
  startTime: string;
  endTime: string;
  originalEndTime: string;
  antiSnipeMinutes: number; // e.g. 5 min
  antiSnipeExtendMinutes: number; // e.g. 5 min
  currentExtensions: number;
  maxExtensions: number;
  status: AuctionStatus;
  totalBids: number;
  uniqueBidders: number;
  paymentDeadlineHours: number; // default 24h
  depositRequired: boolean;
  depositAmount: number;
  poolCount: number; // How many times it went to auction pool
  noSaleReason?: string;
  createdAt: string;
}

export interface AuctionPoolItem {
  id: string;
  auctionId: string;
  productId: string;
  originalStartingBid: number;
  lastHighestBid: number;
  noSaleTimes: number;
  lastEndedTime: string;
  suggestedDiscountPercent: number; // e.g. 10 means reduce starting bid by 10%
  status: 'pending_review' | 'relisted' | 'archived';
}

// Blind Box (盲盒寻宝)
export interface BlindBoxItem {
  id: string;
  name: string;
  image: string;
  value: number; // estimated market price in PHP
  rarity: 'SSR' | 'SR' | 'R' | 'N';
  probability: number; // percentage e.g. 5 = 5%
}

export interface BlindBox {
  id: string;
  titleEn: string;
  titleTl: string;
  titleZh: string;
  descriptionEn: string;
  descriptionTl: string;
  descriptionZh: string;
  categoryId: string; // references Category.id
  coverImage: string;
  price: number;
  originalValue: number;
  stock: number;
  salesCount: number;
  rating: number;
  status: 'active' | 'inactive' | 'sold_out';
  items: BlindBoxItem[];
  tags?: string[];
  createdAt: string;
}

export interface UnboxingRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  blindBoxId: string;
  blindBoxTitle: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  itemValue: number;
  itemRarity: 'SSR' | 'SR' | 'R' | 'N';
  status: 'delivered' | 'recycled';
  createdAt: string;
}

// Orders & Payment
export type OrderType = 'normal' | 'group_buy' | 'auction';
export type OrderStatus =
  | 'to_pay'
  | 'to_ship'
  | 'to_receive'
  | 'completed'
  | 'cancelled'
  | 'refunding'
  | 'refunded';

export type PaymentMethod =
  | 'GCash'
  | 'Maya'
  | 'DragonPay'
  | 'Card'
  | 'COD'
  | 'BDO_Online'
  | 'Wallet';

export interface LogisticsTracking {
  time: string;
  status: string;
  location: string;
}

export interface InvoiceInfo {
  id: string;
  orderId: string;
  type: 'personal' | 'company';
  title: string;
  taxId?: string;
  email: string;
  amount: number;
  status: 'pending' | 'issued' | 'rejected';
  issuedAt?: string;
  invoiceNo?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  skuId: string;
  productName: string;
  skuSpecs: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  isReviewed?: boolean;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  orderType: OrderType;
  groupTeamId?: string;
  auctionId?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  payAmount: number;
  couponId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentTime?: string;
  paymentNo?: string;
  shippingCarrier?: 'J&T Express' | 'LBC Express' | 'Ninja Van' | 'Flash Express' | 'Lalamove';
  shippingNo?: string;
  shippingTime?: string;
  receiverAddress: Address;
  status: OrderStatus;
  remark?: string;
  trackingHistory?: LogisticsTracking[];
  invoiceInfo?: InvoiceInfo;
  createdAt: string;
  updatedAt: string;
}

// Marketing & Coupons
export interface Coupon {
  id: string;
  title: string;
  type: 'flat' | 'percent' | 'free_shipping';
  value: number; // Amount off or percent off
  minOrderAmount: number;
  code?: string;
  totalCount: number;
  claimedCount: number;
  usedCount: number;
  perUserLimit: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'expired';
}

export interface UserCoupon {
  id: string;
  couponId: string;
  userId: string;
  title: string;
  type: 'flat' | 'percent' | 'free_shipping';
  value: number;
  minOrderAmount: number;
  status: 'unused' | 'used' | 'expired';
  claimedAt: string;
  usedAt?: string;
}

// Notifications
export interface AppNotification {
  id: string;
  userId: string;
  type: 'system' | 'order' | 'group_buy' | 'auction' | 'logistics';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// CMS Banners & Quick Entries
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkTarget: string;
  sort: number;
  status: 'active' | 'inactive';
}

export interface QuickEntry {
  id: string;
  titleEn: string;
  titleTl: string;
  titleZh?: string;
  iconName: string;
  bgColor: string;
  badge?: string;
  linkTarget: string;
  sort: number;
}

// Enterprise Partnership & Merchant Center (企业合作与店家开店平台)
export type MerchantType = 'enterprise' | 'individual'; // 企业入驻 | 个人入驻
export type MerchantStatus = 'pending_review' | 'active' | 'suspended' | 'rejected'; // 待审核 | 正常营业 | 已停用冻结 | 审核驳回
export type MerchantRatingTier = 'S' | 'A' | 'B' | 'C' | 'D'; // S级超级旗舰 | A级金牌店家 | B级优选店家 | C级普通店家 | D级风险预警

export interface Merchant {
  id: string;
  storeName: string;
  storeNameZh?: string;
  type: MerchantType;
  ownerName: string; // 联系人/法人
  phone: string;
  email: string;
  idCardNumber: string; // 身份证/护照
  businessLicenseNumber?: string; // 营业执照号 / DTI / SEC
  taxNumber?: string; // 税号 TIN
  category: string; // 主营类目
  description: string;
  logo?: string;
  licenseImage?: string; // 资质材料照片
  idCardImage?: string; // 身份证正面照片
  idCardBackImage?: string; // 身份证反面/国徽面/护照页照片
  bannerImage?: string; // 店铺招牌/横幅
  address?: string; // 经营与退货地址
  status: MerchantStatus;
  registeredAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
  
  // 评级与运营指标
  ratingTier: MerchantRatingTier;
  compositeScore: number; // 综合评分 0 - 5.0 (如 4.9)
  qualityScore: number; // 商品质量分
  serviceScore: number; // 服务态度分
  logisticsScore: number; // 物流履约分
  positiveRate: number; // 好评率百分比 (如 98.6)
  totalSalesAmount: number; // 累计销售额 (₱)
  totalOrdersCount: number; // 累计成交单量
  activeProductsCount: number; // 在售商品数量
  marginDeposit: number; // 保证金 (₱)
  commissionRate: number; // 平台抽佣比例 (%)
  badges?: string[]; // 荣耀勋章 (如 '官方认证', '金牌口碑', '极速履约')

  // 违规与风控扣分体系
  violationPoints: number; // 违规扣分 0 - 12 (达到12分强制停店)
  violationRecordsCount: number; // 违规记录次数
  accountPasswordHash?: string; // 账户密码展示/重置
  notes?: string;
}

export interface MerchantViolationRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  type:
    | 'counterfeit'
    | 'delayed_shipping'
    | 'harassment'
    | 'brushing'
    | 'false_advertising'
    | 'prohibited_goods'
    | 'other';
  title: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  pointsDeducted: number; // 扣分 1 - 12
  actionTaken: 'warning' | 'product_delisting' | 'fine' | 'freeze_7_days' | 'permanent_ban';
  fineAmount?: number;
  description: string;
  evidence?: string;
  occurredAt: string;
  operator: string;
  appealStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
  appealReason?: string;
}
