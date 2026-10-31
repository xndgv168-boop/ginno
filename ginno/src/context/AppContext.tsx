import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Address,
  Category,
  Product,
  CartItem,
  Order,
  GroupBuyActivity,
  GroupBuyTeam,
  AuctionItem,
  AuctionPoolItem,
  AuctionBid,
  Coupon,
  UserCoupon,
  AppNotification,
  Banner,
  Language,
  PaymentMethod,
  ProductReview,
  ProductSku,
  InvoiceInfo,
  BlindBox,
  BlindBoxItem,
  UnboxingRecord,
  Merchant,
  MerchantType,
  MerchantRatingTier,
  MerchantViolationRecord,
} from '../types';
import {
  INITIAL_USER,
  DEMO_BUYER_USER,
  DEMO_MERCHANT_USER,
  INITIAL_ADDRESSES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_GROUP_BUY_ACTIVITIES,
  INITIAL_GROUP_BUY_TEAMS,
  INITIAL_AUCTIONS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_BLINDBOXES,
  INITIAL_UNBOXING_RECORDS,
  INITIAL_MERCHANTS,
  INITIAL_MERCHANT_VIOLATIONS,
} from '../data/mockData';
import { getTranslation, TranslationKey } from '../i18n/translations';
import { getProductTitle } from '../utils/i18nHelpers';

interface AppContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userCenterActiveNode: string;
  setUserCenterActiveNode: (node: string) => void;

  // Config & State
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (authenticated: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  showReturnPolicyModal: boolean;
  setShowReturnPolicyModal: (show: boolean) => void;
  openReturnPolicyModal: () => void;
  loginUser: (userData: {
    phone: string;
    nickname?: string;
    email?: string;
    avatar?: string;
    role?: 'buyer' | 'merchant';
    merchantId?: string;
    storeName?: string;
  }) => void;
  loginDemoUser: (role: 'buyer' | 'merchant') => void;
  registerUser: (userData: { phone: string; nickname: string; email?: string; password?: string }) => void;
  logoutUser: () => void;
  user: UserProfile;
  addresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Catalog
  categories: Category[];
  products: Product[];
  banners: Banner[];
  
  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[]; // product IDs
  addToCart: (product: Product, skuId: string, quantity?: number, openModal?: boolean) => void;
  updateCartQty: (cartItemId: string, delta: number) => void;
  toggleCartSelect: (cartItemId: string) => void;
  toggleSelectAllCart: (selected: boolean) => void;
  removeCartItem: (cartItemId: string) => void;
  clearSelectedCart: () => void;
  toggleWishlist: (productId: string) => void;
  showCartSuccessDrawer: boolean;
  setShowCartSuccessDrawer: (show: boolean) => void;
  lastAddedCartItem: { product: Product; sku: ProductSku; quantity: number } | null;
  showQuickSpecModal: boolean;
  setShowQuickSpecModal: (show: boolean) => void;
  quickSpecProduct: Product | null;
  openQuickSpecModal: (product: Product) => void;
  toastNotice: { message: string; submessage?: string; type?: 'success' | 'info' } | null;
  setToastNotice: (notice: { message: string; submessage?: string; type?: 'success' | 'info' } | null) => void;

  // Blind Box & Group Buy Checkout Modals
  checkoutBlindBox: BlindBox | null;
  openBlindBoxCheckout: (box: BlindBox) => void;
  closeBlindBoxCheckout: () => void;
  checkoutGroupTeam: { team: GroupBuyTeam; product: Product } | null;
  openDirectGroupBuyModal: (team: GroupBuyTeam, product: Product) => void;
  closeDirectGroupBuyModal: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    type: 'normal' | 'group_buy' | 'auction';
    items: Array<{ product: Product; skuId: string; quantity: number }>;
    address: Address;
    paymentMethod: PaymentMethod;
    couponId?: string;
    shippingFee: number;
    discountAmount: number;
    groupTeamId?: string;
    auctionId?: string;
  }) => Order;
  cancelOrder: (orderId: string) => void;
  confirmOrderReceipt: (orderId: string) => void;
  requestRefund: (orderId: string, reason: string) => void;
  submitProductReview: (productId: string, rating: number, comment: string, orderId?: string) => void;
  requestOrderInvoice: (orderId: string, invoiceData: { type: 'personal' | 'company'; title: string; taxId?: string; email: string }) => void;
  addNewAddress: (address: Omit<Address, 'id'>) => Address;

  // Group Buy
  groupActivities: GroupBuyActivity[];
  groupTeams: GroupBuyTeam[];
  startGroupBuy: (activityId: string, tierCount: 2 | 3 | 5, skuId: string, address: Address, paymentMethod: PaymentMethod) => { order: Order; team: GroupBuyTeam };
  joinGroupBuy: (teamId: string, skuId: string, address: Address, paymentMethod: PaymentMethod) => { order: Order; team: GroupBuyTeam };
  triggerVirtualGroupCompletion: (teamId: string) => void;

  // Auction
  auctions: AuctionItem[];
  auctionPool: AuctionPoolItem[];
  auctionBids: Record<string, AuctionBid[]>; // auctionId -> Bids
  placeAuctionBid: (auctionId: string, amount: number) => { success: boolean; message: string };
  setAutoBid: (auctionId: string, maxAmount: number) => void;
  watchAuctionPool: (poolId: string) => void;

  // Coupons
  coupons: Coupon[];
  userCoupons: UserCoupon[];
  claimCoupon: (couponId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationsRead: () => void;

  // Daily Check-in & Points
  checkInToday: () => { success: boolean; pointsEarned: number };
  lastCheckInDate: string | null;
  exchangeCouponWithPoints: (couponData: {
    id: string;
    title: string;
    type: 'flat' | 'percent' | 'free_shipping';
    value: number;
    minOrderAmount: number;
    pointsCost: number;
  }) => { success: boolean; message: string };

  // Blind Box (盲盒寻宝)
  blindBoxes: BlindBox[];
  unboxingRecords: UnboxingRecord[];
  openBlindBox: (boxId: string) => { success: boolean; prize?: BlindBoxItem; record?: UnboxingRecord; message?: string };
  recycleUnboxedItem: (recordId: string) => { success: boolean; pointsEarned: number; walletEarned: number };
  adminSaveBlindBox: (boxData: Partial<BlindBox>) => void;
  adminDeleteBlindBox: (boxId: string) => void;

  // Admin Actions
  adminSaveProduct: (product: Partial<Product>) => void;
  adminDeleteProduct: (productId: string) => void;
  adminShipOrder: (orderId: string, carrier: any, trackingNo: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: Order['status'], refundApproved?: boolean) => void;
  adminPublishAuction: (auctionData: Partial<AuctionItem>) => void;
  adminReAuctionPoolItem: (poolId: string, newStartingBid: number) => void;
  adminConvertPoolToSale: (poolId: string) => void;
  adminCreateGroupActivity: (actData: Partial<GroupBuyActivity>) => void;
  adminSaveCategory: (category: Partial<Category>) => void;
  adminDeleteCategory: (catId: string) => void;
  adminSaveCoupon: (coupon: Partial<Coupon>) => void;
  adminDeleteCoupon: (couponId: string) => void;
  adminUpdateUser: (userData: Partial<UserProfile>) => void;
  adminSaveBanner: (banner: Partial<Banner>) => void;
  adminDeleteBanner: (bannerId: string) => void;
  adminAuditLogs: Array<{ id: string; operator: string; action: string; module: string; timestamp: string }>;
  addAuditLog: (module: string, action: string) => void;

  // Enterprise Partnership & Merchants (企业合作与店家管理)
  merchants: Merchant[];
  merchantViolations: MerchantViolationRecord[];
  registerMerchant: (payload: {
    username?: string;
    storeName: string;
    type?: MerchantType;
    ownerName?: string;
    phone: string;
    email: string;
    idCardNumber?: string;
    businessLicenseNumber?: string;
    taxNumber?: string;
    category?: string;
    description?: string;
    password?: string;
    licenseImage?: string;
    idCardImage?: string;
    idCardBackImage?: string;
    bannerImage?: string;
    address?: string;
  }) => { success: boolean; message: string; merchantId: string };
  adminApproveMerchant: (merchantId: string, notes?: string, customTier?: MerchantRatingTier, commissionRate?: number) => void;
  adminRejectMerchant: (merchantId: string, reason: string) => void;
  adminToggleMerchantStatus: (merchantId: string) => void;
  adminResetMerchantPassword: (merchantId: string, newPassword?: string) => { newPassword: string };
  adminUpdateMerchantTier: (merchantId: string, tier: MerchantRatingTier, commissionRate?: number, badges?: string[]) => void;
  adminAddMerchantViolation: (violation: Omit<MerchantViolationRecord, 'id' | 'occurredAt' | 'operator'>) => void;
  adminUpdateMerchantDetails: (merchantId: string, updates: Partial<Merchant>) => void;

  // Merchant Operations (店家专属经营工作台功能)
  merchantShipOrder: (orderId: string, carrier: string, trackingNo: string) => void;
  merchantHandleRefund: (orderId: string, action: 'approve' | 'reject', remark?: string) => void;
  merchantWithdraw: (amount: number, channel: string, accountNo: string) => { success: boolean; message: string };
  merchantToggleProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userCenterActiveNode, setUserCenterActiveNode] = useState<string>('overview');

  // Local storage loaded or defaults - strictly defaults to English ('EN')
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('ginno_language_v3');
    return (savedLang as Language) || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('ginno_language_v3', language);
    localStorage.setItem('ginno_language', language);
  }, [language]);

  const t = (key: TranslationKey) => getTranslation(key, language);

  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticatedState] = useState<boolean>(false);

  const setIsAdminAuthenticated = (authenticated: boolean) => {
    setIsAdminAuthenticatedState(authenticated);
    if (authenticated) {
      sessionStorage.setItem('ginno_admin_authenticated', 'true');
    } else {
      sessionStorage.removeItem('ginno_admin_authenticated');
    }
  };
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState<boolean>(false);
  const openReturnPolicyModal = () => {
    setShowReturnPolicyModal(true);
  };

  const [showCartSuccessDrawer, setShowCartSuccessDrawer] = useState<boolean>(false);
  const [lastAddedCartItem, setLastAddedCartItem] = useState<{ product: Product; sku: ProductSku; quantity: number } | null>(null);
  const [showQuickSpecModal, setShowQuickSpecModal] = useState<boolean>(false);
  const [quickSpecProduct, setQuickSpecProduct] = useState<Product | null>(null);
  const [toastNotice, setToastNotice] = useState<{ message: string; submessage?: string; type?: 'success' | 'info' } | null>(null);

  const openQuickSpecModal = (product: Product) => {
    setQuickSpecProduct(product);
    setShowQuickSpecModal(true);
  };

  // Blind Box & Direct Group Buy Checkout Modals
  const [checkoutBlindBox, setCheckoutBlindBox] = useState<BlindBox | null>(null);
  const openBlindBoxCheckout = (box: BlindBox) => setCheckoutBlindBox(box);
  const closeBlindBoxCheckout = () => setCheckoutBlindBox(null);

  const [checkoutGroupTeam, setCheckoutGroupTeam] = useState<{ team: GroupBuyTeam; product: Product } | null>(null);
  const openDirectGroupBuyModal = (team: GroupBuyTeam, product: Product) => setCheckoutGroupTeam({ team, product });
  const closeDirectGroupBuyModal = () => setCheckoutGroupTeam(null);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ginno_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('ginno_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ginno_products');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        if (parsed.length < INITIAL_PRODUCTS.length) {
          localStorage.removeItem('ginno_products');
          return INITIAL_PRODUCTS;
        }
        const existingIds = new Set(parsed.map((p) => p.id));
        const mergedSaved = parsed.map((p: Product) => {
          const fresh = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          if (fresh) {
            return {
              ...p,
              ...fresh,
              salesCount: p.salesCount ?? fresh.salesCount,
            };
          }
          return p;
        });
        const missingNew = INITIAL_PRODUCTS.filter((ip) => !existingIds.has(ip.id));
        return [...mergedSaved, ...missingNew];
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ginno_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ginno_wishlist');
    return saved ? JSON.parse(saved) : ['prod_01'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ginno_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [groupActivities, setGroupActivities] = useState<GroupBuyActivity[]>(INITIAL_GROUP_BUY_ACTIVITIES);
  const [groupTeams, setGroupTeams] = useState<GroupBuyTeam[]>(() => {
    const saved = localStorage.getItem('ginno_group_teams');
    if (saved) {
      try {
        const parsed: GroupBuyTeam[] = JSON.parse(saved);
        if (parsed.length < INITIAL_GROUP_BUY_TEAMS.length) {
          const existingIds = new Set(parsed.map((t) => t.id));
          const missing = INITIAL_GROUP_BUY_TEAMS.filter((t) => !existingIds.has(t.id));
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_GROUP_BUY_TEAMS;
      }
    }
    return INITIAL_GROUP_BUY_TEAMS;
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    const saved = localStorage.getItem('ginno_auctions');
    if (saved) {
      try {
        const parsed: AuctionItem[] = JSON.parse(saved);
        if (parsed.length < INITIAL_AUCTIONS.length) {
          const existingIds = new Set(parsed.map((a) => a.id));
          const missing = INITIAL_AUCTIONS.filter((a) => !existingIds.has(a.id));
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_AUCTIONS;
      }
    }
    return INITIAL_AUCTIONS;
  });

  const [auctionPool, setAuctionPool] = useState<AuctionPoolItem[]>([]);

  const [auctionBids, setAuctionBids] = useState<Record<string, AuctionBid[]>>({
    auc_01: [
      {
        id: 'b_18',
        auctionId: 'auc_01',
        userId: 'usr_bidder_88',
        userNickname: 'Dexter C.',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bidAmount: 12500,
        isAutoBid: false,
        bidTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: 'b_17',
        auctionId: 'auc_01',
        userId: 'usr_bidder_77',
        userNickname: 'Maria V.',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bidAmount: 12300,
        isAutoBid: true,
        bidTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
    ],
  });

  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Blind Box States
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>(() => {
    const saved = localStorage.getItem('ginno_blindboxes');
    return saved ? JSON.parse(saved) : INITIAL_BLINDBOXES;
  });

  const [unboxingRecords, setUnboxingRecords] = useState<UnboxingRecord[]>(() => {
    const saved = localStorage.getItem('ginno_unboxing_records');
    return saved ? JSON.parse(saved) : INITIAL_UNBOXING_RECORDS;
  });
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([
    {
      id: 'uc_1',
      couponId: 'c_welcome500',
      userId: INITIAL_USER.id,
      title: '₱500 Off New Customer Voucher',
      type: 'flat',
      value: 500,
      minOrderAmount: 2500,
      status: 'unused',
      claimedAt: '2024-02-01T00:00:00Z',
    },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      userId: INITIAL_USER.id,
      type: 'system',
      title: 'Mabuhay! Welcome to Ginno Philippines!',
      content: 'Claim your ₱500 welcome voucher and start shopping, group buying or bidding now.',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => {
    return localStorage.getItem('ginno_last_checkin');
  });

  const [merchants, setMerchants] = useState<Merchant[]>(() => {
    const saved = localStorage.getItem('ginno_merchants');
    if (saved) {
      try {
        const parsed: Merchant[] = JSON.parse(saved);
        if (parsed.length < INITIAL_MERCHANTS.length) {
          const existingIds = new Set(parsed.map((m) => m.id));
          const missing = INITIAL_MERCHANTS.filter((m) => !existingIds.has(m.id));
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_MERCHANTS;
      }
    }
    return INITIAL_MERCHANTS;
  });

  const [merchantViolations, setMerchantViolations] = useState<MerchantViolationRecord[]>(() => {
    const saved = localStorage.getItem('ginno_merchant_violations');
    return saved ? JSON.parse(saved) : INITIAL_MERCHANT_VIOLATIONS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ginno_merchants', JSON.stringify(merchants));
  }, [merchants]);

  useEffect(() => {
    localStorage.setItem('ginno_merchant_violations', JSON.stringify(merchantViolations));
  }, [merchantViolations]);

  useEffect(() => {
    localStorage.setItem('ginno_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ginno_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ginno_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ginno_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ginno_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ginno_group_teams', JSON.stringify(groupTeams));
  }, [groupTeams]);

  useEffect(() => {
    localStorage.setItem('ginno_auctions', JSON.stringify(auctions));
  }, [auctions]);

  useEffect(() => {
    localStorage.setItem('ginno_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ginno_blindboxes', JSON.stringify(blindBoxes));
  }, [blindBoxes]);

  useEffect(() => {
    localStorage.setItem('ginno_unboxing_records', JSON.stringify(unboxingRecords));
  }, [unboxingRecords]);

  // Real-time background simulation (auctions countdown, random bidder simulation for live auctions)
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Update auction timers
      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.status !== 'live') return auc;
          const endMs = new Date(auc.endTime).getTime();
          const nowMs = Date.now();

          if (nowMs >= endMs) {
            // Auction Ended!
            if (auc.currentHighestBid >= (auc.reservePrice || 0) && auc.currentHighestBidderId) {
              // Trigger winning notification if user won
              if (auc.currentHighestBidderId === user.id) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }
              return { ...auc, status: 'ended' };
            } else {
              // No sale -> Push to pool
              setAuctionPool((pool) => [
                ...pool,
                {
                  id: `pool_${Date.now()}`,
                  auctionId: auc.id,
                  productId: auc.productId,
                  originalStartingBid: auc.startingBid,
                  lastHighestBid: auc.currentHighestBid,
                  noSaleReason: 'Reserve price not met / No bids',
                  poolCount: auc.poolCount + 1,
                  watchCount: 3,
                  status: 'pending',
                },
              ]);
              return { ...auc, status: 'no_sale' };
            }
          }
          return auc;
        })
      );

      // 2. Random simulated opponent bid on live auctions (once in a while for dynamic feel)
      if (Math.random() < 0.25) {
        setAuctions((prev) =>
          prev.map((auc) => {
            if (auc.status !== 'live') return auc;
            // Don't auto-bid if current highest bidder is already an opponent
            if (Math.random() > 0.5) return auc;

            const nextBid = auc.currentHighestBid + auc.bidIncrement;
            const simulatedUsers = [
              { name: 'Ramon M. (***412)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
              { name: 'Sofia L. (***901)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
              { name: 'Eduardo P. (***188)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
              { name: 'Grace C. (***553)', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
              { name: 'Dexter C. (***882)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
            ];
            const chosenUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];

            const newBid: AuctionBid = {
              id: `bid_sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              auctionId: auc.id,
              userId: `sim_usr_${Math.floor(Math.random() * 1000)}`,
              userNickname: chosenUser.name,
              userAvatar: chosenUser.avatar,
              bidAmount: nextBid,
              isAutoBid: false,
              bidTime: new Date().toISOString(),
            };

            setAuctionBids((bids) => ({
              ...bids,
              [auc.id]: [newBid, ...(bids[auc.id] || [])],
            }));

            // Check if anti-snipe logic applies (if < 5 mins remain, extend time by 5 mins)
            let newEndTime = auc.endTime;
            let extCount = auc.currentExtensions;
            const msRemaining = new Date(auc.endTime).getTime() - Date.now();
            if (msRemaining < auc.antiSnipeMinutes * 60 * 1000 && extCount < auc.maxExtensions) {
              newEndTime = new Date(Date.now() + (msRemaining + auc.antiSnipeExtendMinutes * 60 * 1000)).toISOString();
              extCount += 1;
            }

            return {
              ...auc,
              currentHighestBid: nextBid,
              currentHighestBidderId: newBid.userId,
              currentHighestBidderName: newBid.userNickname,
              currentHighestBidderAvatar: newBid.userAvatar,
              totalBids: auc.totalBids + 1,
              endTime: newEndTime,
              currentExtensions: extCount,
            };
          })
        );
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [user.id]);

  // Address Actions
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr_${Date.now()}` };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
  };

  const updateAddress = (id: string, addr: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...addr } : addr.isDefault ? { ...a, isDefault: false } : a))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  // Cart & Wishlist Actions
  const addToCart = (product: Product, skuId: string, quantity = 1, openModal = true) => {
    const baseSku = product.skus.find((s) => s.id === skuId) || product.skus[0];
    const sku = (product.isFlashSale && product.flashSalePrice)
      ? { ...baseSku, price: product.flashSalePrice }
      : baseSku;
    const existingIndex = cart.findIndex((item) => item.productId === product.id && item.skuId === sku.id);

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart_${Date.now()}`,
        productId: product.id,
        skuId: sku.id,
        quantity,
        selected: true,
        product,
        sku,
      };
      setCart((prev) => [...prev, newItem]);
    }

    setLastAddedCartItem({ product, sku, quantity });
    if (openModal) {
      setShowCartSuccessDrawer(true);
    } else {
      setShowCartSuccessDrawer(false);
    }
    const pTitle = getProductTitle(product, language);
    setToastNotice({
      message: language === 'ZH' ? '已成功加入购物车！' : language === 'TL' ? 'Naidagdag na sa cart!' : 'Added to shopping cart!',
      submessage: `${pTitle} x${quantity}`,
      type: 'success',
    });
  };

  const updateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleCartSelect = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAllCart = (selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const removeCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearSelectedCart = () => {
    setCart((prev) => prev.filter((item) => !item.selected));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Orders Actions
  const createOrder = ({
    type,
    items,
    address,
    paymentMethod,
    couponId,
    shippingFee,
    discountAmount,
    groupTeamId,
    auctionId,
  }: {
    type: 'normal' | 'group_buy' | 'auction';
    items: Array<{ product: Product; skuId: string; quantity: number }>;
    address: Address;
    paymentMethod: PaymentMethod;
    couponId?: string;
    shippingFee: number;
    discountAmount: number;
    groupTeamId?: string;
    auctionId?: string;
  }): Order => {
    const orderItems = items.map((i) => {
      const sku = i.product.skus.find((s) => s.id === i.skuId) || i.product.skus[0];
      const specStr = Object.entries(sku.specs || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      return {
        id: `oi_${Date.now()}_${Math.random()}`,
        productId: i.product.id,
        skuId: sku.id,
        productName: i.product.titleEn,
        skuSpecs: specStr,
        image: i.product.mainImage,
        price: sku.price,
        quantity: i.quantity,
        total: sku.price * i.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, curr) => acc + curr.total, 0);
    const payAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNo: `GINNO-${Date.now().toString().slice(-8)}`,
      userId: user.id,
      orderType: type,
      groupTeamId,
      auctionId,
      items: orderItems,
      totalAmount: subtotal,
      discountAmount,
      shippingFee,
      payAmount,
      couponId,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'unpaid' : 'paid',
      paymentTime: paymentMethod === 'COD' ? undefined : new Date().toISOString(),
      paymentNo: paymentMethod === 'COD' ? undefined : `PAY-${Date.now()}`,
      shippingCarrier: 'J&T Express',
      receiverAddress: address,
      status: paymentMethod === 'COD' ? 'to_ship' : 'to_ship',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingHistory: [
        { time: new Date().toISOString(), status: 'Order Created', location: 'Ginno Fulfillment Hub - Manila' },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reward points for order
    const pointsEarned = Math.floor(payAmount / 10);
    setUser((u) => ({
      ...u,
      points: u.points + pointsEarned,
      walletBalance: paymentMethod === 'Wallet' ? u.walletBalance - payAmount : u.walletBalance,
    }));

    // Mark coupon as used
    if (couponId) {
      setUserCoupons((prev) =>
        prev.map((uc) => (uc.couponId === couponId ? { ...uc, status: 'used', usedAt: new Date().toISOString() } : uc))
      );
    }

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        type: 'order',
        title: 'Order Confirmed!',
        content: `Your order ${newOrder.orderNo} for ₱${payAmount.toLocaleString()} has been placed successfully.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 80, spread: 60 });
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o))
    );
  };

  const confirmOrderReceipt = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed', updatedAt: new Date().toISOString() } : o))
    );
  };

  const requestRefund = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'refunding', remark: `Refund Requested: ${reason}`, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const submitProductReview = (productId: string, rating: number, comment: string, orderId?: string) => {
    const newRev: ProductReview = {
      id: `rev_${Date.now()}`,
      productId,
      userId: user.id,
      userName: user.nickname,
      userAvatar: user.avatar,
      rating,
      skuSpecs: 'Standard SKU',
      comment,
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };
    INITIAL_REVIEWS.unshift(newRev);

    if (orderId) {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              items: ord.items.map((item) =>
                item.productId === productId ? { ...item, isReviewed: true } : item
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return ord;
        })
      );
    }

    setUser((u) => ({ ...u, points: u.points + 50 }));
    setToastNotice({
      message: language === 'ZH' ? '评价成功！获50积分' : 'Review submitted! +50 Points awarded.',
      type: 'success',
    });
  };

  const requestOrderInvoice = (
    orderId: string,
    invoiceData: { type: 'personal' | 'company'; title: string; taxId?: string; email: string }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const inv: InvoiceInfo = {
            id: `inv_${Date.now()}`,
            orderId,
            type: invoiceData.type,
            title: invoiceData.title,
            taxId: invoiceData.taxId,
            email: invoiceData.email,
            amount: ord.payAmount,
            status: 'issued',
            issuedAt: new Date().toISOString(),
            invoiceNo: `EIN-PH-${Math.floor(10000000 + Math.random() * 90000000)}`,
          };
          return { ...ord, invoiceInfo: inv, updatedAt: new Date().toISOString() };
        }
        return ord;
      })
    );
    setToastNotice({
      message: language === 'ZH' ? '电子发票开具成功！' : 'E-Invoice issued successfully!',
      type: 'success',
    });
  };

  const addNewAddress = (addrData: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...addrData,
      id: `addr_${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
    }
    setAddresses((prev) => [newAddr, ...prev]);
    localStorage.setItem('ginno_addresses', JSON.stringify([newAddr, ...addresses]));
    setToastNotice({
      message: language === 'ZH' ? '收货地址添加成功！' : 'Shipping address added successfully!',
      type: 'success',
    });
    return newAddr;
  };

  // Group Buy Actions
  const startGroupBuy = (
    activityId: string,
    tierCount: 2 | 3 | 5,
    skuId: string,
    address: Address,
    paymentMethod: PaymentMethod
  ) => {
    const act = groupActivities.find((a) => a.id === activityId) || groupActivities[0];
    const prod = products.find((p) => p.id === act.productId) || products[0];
    const tier = act.tiers.find((t) => t.peopleCount === tierCount) || act.tiers[0];

    const newTeam: GroupBuyTeam = {
      id: `team_${Date.now()}`,
      activityId,
      productId: prod.id,
      teamNo: `GB-${Date.now().toString().slice(-8)}`,
      leaderUserId: user.id,
      leaderName: user.nickname,
      leaderAvatar: user.avatar,
      requiredCount: tierCount,
      currentCount: 1,
      tierPrice: tier.price,
      expireTime: new Date(Date.now() + act.groupExpireHours * 3600 * 1000).toISOString(),
      status: 'forming',
      members: [
        {
          userId: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
          isLeader: true,
          joinedAt: new Date().toISOString(),
          orderId: `ord_gb_${Date.now()}`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setGroupTeams((prev) => [newTeam, ...prev]);

    // Create order for leader
    const order = createOrder({
      type: 'group_buy',
      items: [{ product: prod, skuId, quantity: 1 }],
      address,
      paymentMethod,
      shippingFee: 0,
      discountAmount: Math.max(0, prod.skus[0].price - tier.price),
      groupTeamId: newTeam.id,
    });

    return { order, team: newTeam };
  };

  const joinGroupBuy = (
    teamId: string,
    skuId: string,
    address: Address,
    paymentMethod: PaymentMethod
  ) => {
    const team = groupTeams.find((t) => t.id === teamId)!;
    const prod = products.find((p) => p.id === team.productId)!;

    const newCount = team.currentCount + 1;
    const isSuccess = newCount >= team.requiredCount;

    const updatedMembers = [
      ...team.members,
      {
        userId: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        isLeader: false,
        joinedAt: new Date().toISOString(),
        orderId: `ord_gb_${Date.now()}`,
      },
    ];

    const updatedTeam: GroupBuyTeam = {
      ...team,
      currentCount: newCount,
      status: isSuccess ? 'success' : 'forming',
      members: updatedMembers,
    };

    setGroupTeams((prev) => prev.map((t) => (t.id === teamId ? updatedTeam : t)));

    const order = createOrder({
      type: 'group_buy',
      items: [{ product: prod, skuId, quantity: 1 }],
      address,
      paymentMethod,
      shippingFee: 0,
      discountAmount: Math.max(0, prod.skus[0].price - team.tierPrice),
      groupTeamId: team.id,
    });

    if (isSuccess) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: user.id,
          type: 'group_buy',
          title: '🔥 Group Buy Successful!',
          content: `Your group team ${team.teamNo} for ${prod.titleEn} is complete! Preparing for immediate dispatch.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      confetti({ particleCount: 120, spread: 80 });
    }

    return { order, team: updatedTeam };
  };

  const triggerVirtualGroupCompletion = (teamId: string) => {
    setGroupTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const needed = t.requiredCount - t.currentCount;
          const dummyBots = Array.from({ length: needed }).map((_, i) => ({
            userId: `bot_${Date.now()}_${i}`,
            nickname: ['Ana Santos', 'Bong G.', 'Cristina D.'][i % 3],
            avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 5000}?w=150`,
            isLeader: false,
            joinedAt: new Date().toISOString(),
            orderId: `bot_ord_${i}`,
          }));
          return {
            ...t,
            currentCount: t.requiredCount,
            status: 'virtual_completed',
            members: [...t.members, ...dummyBots],
          };
        }
        return t;
      })
    );
  };

  // Auction Actions
  const placeAuctionBid = (auctionId: string, amount: number) => {
    const auc = auctions.find((a) => a.id === auctionId);
    if (!auc || auc.status !== 'live') return { success: false, message: 'Auction is not currently live' };

    const minRequired = auc.currentHighestBid + auc.bidIncrement;
    if (amount < minRequired) {
      return { success: false, message: `Bid must be at least ₱${minRequired.toLocaleString()}` };
    }

    const newBid: AuctionBid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      auctionId,
      userId: user.id,
      userNickname: user.nickname,
      userAvatar: user.avatar,
      bidAmount: amount,
      isAutoBid: false,
      bidTime: new Date().toISOString(),
    };

    setAuctionBids((prev) => ({
      ...prev,
      [auctionId]: [newBid, ...(prev[auctionId] || [])],
    }));

    // Anti-snipe logic check
    const msRemaining = new Date(auc.endTime).getTime() - Date.now();
    let newEndTime = auc.endTime;
    let extCount = auc.currentExtensions;
    if (msRemaining < auc.antiSnipeMinutes * 60 * 1000 && extCount < auc.maxExtensions) {
      newEndTime = new Date(Date.now() + (msRemaining + auc.antiSnipeExtendMinutes * 60 * 1000)).toISOString();
      extCount += 1;
    }

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentHighestBid: amount,
              currentHighestBidderId: user.id,
              currentHighestBidderName: user.nickname,
              currentHighestBidderAvatar: user.avatar,
              totalBids: a.totalBids + 1,
              endTime: newEndTime,
              currentExtensions: extCount,
            }
          : a
      )
    );

    return { success: true, message: 'Bid placed successfully!' };
  };

  const setAutoBid = (auctionId: string, maxAmount: number) => {
    alert(`Auto-bid set for up to ₱${maxAmount.toLocaleString()}. Ginno AI proxy will bid on your behalf!`);
  };

  const watchAuctionPool = (poolId: string) => {
    setAuctionPool((prev) =>
      prev.map((item) => (item.id === poolId ? { ...item, watchCount: item.watchCount + 1 } : item))
    );
    alert('Added to your Auction Pool Watchlist! We will notify you when re-auctioned.');
  };

  // Coupons Actions
  const claimCoupon = (couponId: string) => {
    const cp = coupons.find((c) => c.id === couponId);
    if (!cp) return;

    const already = userCoupons.some((uc) => uc.couponId === couponId && uc.status === 'unused');
    if (already) {
      alert('You have already claimed this coupon!');
      return;
    }

    const newUserCoupon: UserCoupon = {
      id: `uc_${Date.now()}`,
      couponId,
      userId: user.id,
      title: cp.title,
      type: cp.type,
      value: cp.value,
      minOrderAmount: cp.minOrderAmount,
      status: 'unused',
      claimedAt: new Date().toISOString(),
    };

    setUserCoupons((prev) => [...prev, newUserCoupon]);
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, claimedCount: c.claimedCount + 1 } : c))
    );
    alert(`Successfully claimed: ${cp.title}`);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Daily Check-in
  const checkInToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (lastCheckInDate === todayStr) {
      return { success: false, pointsEarned: 0 };
    }

    const earned = 100;
    setUser((u) => ({ ...u, points: u.points + earned }));
    setLastCheckInDate(todayStr);
    localStorage.setItem('ginno_last_checkin', todayStr);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: 'Daily Check-in Reward!',
        content: `You received +${earned} Ginno Points! Keep your daily streak going.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 60, spread: 50 });
    return { success: true, pointsEarned: earned };
  };

  const exchangeCouponWithPoints = (couponData: {
    id: string;
    title: string;
    type: 'flat' | 'percent' | 'free_shipping';
    value: number;
    minOrderAmount: number;
    pointsCost: number;
  }): { success: boolean; message: string } => {
    if (user.points < couponData.pointsCost) {
      return {
        success: false,
        message:
          language === 'ZH'
            ? `积分不足！所需 ${couponData.pointsCost} 积分，当前拥有 ${user.points} 积分`
            : language === 'TL'
            ? `Kulang sa puntos! Kailangan ng ${couponData.pointsCost} puntos`
            : `Insufficient points! Required ${couponData.pointsCost} points, you have ${user.points} points`,
      };
    }

    const updatedUser = { ...user, points: user.points - couponData.pointsCost };
    setUser(updatedUser);
    localStorage.setItem('ginno_user', JSON.stringify(updatedUser));

    const newUserCoupon: UserCoupon = {
      id: `uc_pts_${Date.now()}`,
      couponId: couponData.id,
      userId: user.id,
      title: couponData.title,
      type: couponData.type,
      value: couponData.value,
      minOrderAmount: couponData.minOrderAmount,
      status: 'unused',
      claimedAt: new Date().toISOString(),
    };

    setUserCoupons((prev) => [newUserCoupon, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        type: 'promo',
        title: language === 'ZH' ? '积分兑换优惠券成功' : 'Voucher Exchanged',
        content:
          language === 'ZH'
            ? `成功消耗 ${couponData.pointsCost} 积分兑换「${couponData.title}」！`
            : `Spent ${couponData.pointsCost} points to exchange 「${couponData.title}」!`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 80, spread: 70 });

    return {
      success: true,
      message:
        language === 'ZH'
          ? `🎉 兑换成功！已扣除 ${couponData.pointsCost} 积分，优惠券划入您的卡券包。`
          : `🎉 Successfully exchanged! Voucher added to your account.`,
    };
  };

  // Admin CRUD Functions
  const adminSaveProduct = (prodData: Partial<Product>) => {
    if (prodData.id) {
      setProducts((prev) => prev.map((p) => (p.id === prodData.id ? ({ ...p, ...prodData } as Product) : p)));
    } else {
      const newP: Product = {
        id: `prod_${Date.now()}`,
        categoryId: prodData.categoryId || 'cat_electronics',
        titleEn: prodData.titleEn || 'New Ginno Item',
        titleTl: prodData.titleTl || 'Bagong Produkto',
        subtitle: prodData.subtitle || '',
        mainImage: prodData.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        images: prodData.images || ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        description: prodData.description || 'Quality product from Ginno',
        specsParams: prodData.specsParams || [],
        skus: prodData.skus || [
          {
            id: `sku_${Date.now()}`,
            productId: `prod_${Date.now()}`,
            skuCode: 'SKU-001',
            specs: { Variant: 'Standard' },
            price: 1000,
            originalPrice: 1500,
            costPrice: 600,
            stock: 100,
            stockWarning: 10,
            salesCount: 0,
          },
        ],
        salesCount: 0,
        reviewCount: 0,
        rating: 5.0,
        status: 'online',
        tags: ['New Arrival'],
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newP, ...prev]);
    }
  };

  const adminDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const adminShipOrder = (orderId: string, carrier: any, trackingNo: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'to_receive',
              shippingCarrier: carrier,
              shippingNo: trackingNo,
              shippingTime: new Date().toISOString(),
              trackingHistory: [
                { time: new Date().toISOString(), status: `Dispatched via ${carrier}`, location: 'Sort Facility - Manila' },
                ...(o.trackingHistory || []),
              ],
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
  };

  const adminPublishAuction = (auctionData: Partial<AuctionItem>) => {
    const newAuc: AuctionItem = {
      id: `auc_${Date.now()}`,
      productId: auctionData.productId || 'prod_03',
      skuId: auctionData.skuId || 'sku_watch6_silver',
      title: auctionData.title || 'Special Admin Auction Item',
      mainImage: auctionData.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      images: [auctionData.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      description: auctionData.description || 'Auction item published by admin',
      startingBid: auctionData.startingBid || 1000,
      reservePrice: auctionData.reservePrice || 3000,
      currentHighestBid: auctionData.startingBid || 1000,
      bidIncrement: auctionData.bidIncrement || 100,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      originalEndTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      antiSnipeMinutes: 5,
      antiSnipeExtendMinutes: 5,
      currentExtensions: 0,
      maxExtensions: 10,
      status: 'live',
      totalBids: 0,
      uniqueBidders: 0,
      paymentDeadlineHours: 24,
      depositRequired: false,
      depositAmount: 0,
      poolCount: 0,
      createdAt: new Date().toISOString(),
    };
    setAuctions((prev) => [newAuc, ...prev]);
  };

  const adminReAuctionPoolItem = (poolId: string, newStartingBid: number) => {
    const poolItem = auctionPool.find((p) => p.id === poolId);
    if (!poolItem) return;

    setAuctionPool((prev) =>
      prev.map((p) => (p.id === poolId ? { ...p, status: 're_auctioned', processedAt: new Date().toISOString() } : p))
    );

    const prod = products.find((p) => p.id === poolItem.productId) || products[0];

    adminPublishAuction({
      productId: prod.id,
      title: `🔄 Re-Auctioned: ${prod.titleEn}`,
      mainImage: prod.mainImage,
      startingBid: newStartingBid,
      description: 'Re-auctioned item from Auction Pool at discounted starting bid!',
    });
  };

  const adminConvertPoolToSale = (poolId: string) => {
    setAuctionPool((prev) =>
      prev.map((p) => (p.id === poolId ? { ...p, status: 'converted', processedAt: new Date().toISOString() } : p))
    );
    alert('Item converted back to Regular Product Sale!');
  };

  const adminCreateGroupActivity = (actData: Partial<GroupBuyActivity>) => {
    const newAct: GroupBuyActivity = {
      id: `gba_${Date.now()}`,
      productId: actData.productId || 'prod_01',
      title: actData.title || 'New Group Buy Activity',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      groupExpireHours: actData.groupExpireHours || 24,
      tiers: actData.tiers || [
        { peopleCount: 2, price: 900 },
        { peopleCount: 3, price: 800 },
      ],
      virtualBuyEnabled: true,
      status: 'active',
      salesCount: 0,
    };
    setGroupActivities((prev) => [newAct, ...prev]);
  };

  // Auth Functions (Login, Register, Logout)
  const loginUser = ({
    phone,
    nickname,
    email,
    avatar,
    role = 'buyer',
    merchantId,
    storeName,
  }: {
    phone: string;
    nickname?: string;
    email?: string;
    avatar?: string;
    role?: 'buyer' | 'merchant';
    merchantId?: string;
    storeName?: string;
  }) => {
    const cleanPhone = phone.trim();
    const formattedPhone = cleanPhone.startsWith('+63') ? cleanPhone : `+63 ${cleanPhone.replace(/^0/, '')}`;
    const defaultName =
      nickname ||
      (role === 'merchant'
        ? 'Alexander Vance Sy (旗舰店家)'
        : cleanPhone.includes('9178889999') || cleanPhone.includes('09178889999')
        ? 'Elena Cruz (购买用户)'
        : cleanPhone.includes('9187776666')
        ? 'Maria Santos'
        : `User_${cleanPhone.slice(-4) || '8888'}`);

    const userAvatar =
      avatar ||
      (role === 'merchant'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

    const updatedUser: UserProfile = {
      ...user,
      id: user.phone === formattedPhone ? user.id : `usr_${Date.now()}`,
      role: role,
      merchantId: merchantId || (role === 'merchant' ? 'mch_001' : undefined),
      storeName: storeName || (role === 'merchant' ? 'TechVanguard Digital Flagship' : undefined),
      nickname: defaultName,
      phone: formattedPhone,
      email: email || `${defaultName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      avatar: userAvatar,
      memberLevel: role === 'merchant' ? 'Diamond' : (user.memberLevel || 'Gold'),
      points: role === 'merchant' ? 6800 : (user.points || 1280),
      walletBalance: role === 'merchant' ? 185600 : (user.walletBalance || 2500),
      status: 'active',
    };

    setUser(updatedUser);
    localStorage.setItem('ginno_user', JSON.stringify(updatedUser));
    if (role === 'merchant') {
      setUserCenterActiveNode('merchant_overview');
    } else {
      setUserCenterActiveNode('overview');
    }
    setShowAuthModal(false);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: updatedUser.id,
        type: 'system',
        title: role === 'merchant' ? '🏢 店家工作台登录成功' : '🔑 买家登录成功',
        content: `Mabuhay ${updatedUser.nickname}! Welcome back to Ginno Philippines.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 80, spread: 70 });
  };

  const loginDemoUser = (targetRole: 'buyer' | 'merchant') => {
    if (targetRole === 'buyer') {
      setUser(DEMO_BUYER_USER);
      localStorage.setItem('ginno_user', JSON.stringify(DEMO_BUYER_USER));
      setUserCenterActiveNode('overview');
      setToastNotice({
        message: language === 'ZH' ? '已一键登录模拟购买用户 (Elena Cruz)！' : 'Logged in as Demo Buyer (Elena Cruz)!',
        type: 'success',
      });
    } else {
      setUser(DEMO_MERCHANT_USER);
      localStorage.setItem('ginno_user', JSON.stringify(DEMO_MERCHANT_USER));
      setUserCenterActiveNode('merchant_overview');
      setToastNotice({
        message: language === 'ZH' ? '已一键登录模拟店家商户 (Alexander Vance Sy · 科技先锋数码超级旗舰店)！' : 'Logged in as Demo Merchant (Alexander Vance Sy)!',
        type: 'success',
      });
    }
    setShowAuthModal(false);
    confetti({ particleCount: 80, spread: 70 });
  };

  const registerUser = ({ phone, nickname, email }: { phone: string; nickname: string; email?: string }) => {
    const cleanPhone = phone.trim();
    const formattedPhone = cleanPhone.startsWith('+63') ? cleanPhone : `+63 ${cleanPhone.replace(/^0/, '')}`;
    const name = nickname.trim() || `New_Member_${cleanPhone.slice(-4) || '9999'}`;

    const newUserProfile: UserProfile = {
      id: `usr_reg_${Date.now()}`,
      nickname: name,
      phone: formattedPhone,
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      gender: 'other',
      memberLevel: 'Bronze',
      points: 500, // 500 reward points bonus for new registration
      walletBalance: 1000, // 1000 PHP bonus
      inviteCode: `GINNO${Math.floor(100 + Math.random() * 900)}`,
      registerSource: 'phone',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setUser(newUserProfile);
    localStorage.setItem('ginno_user', JSON.stringify(newUserProfile));
    setShowAuthModal(false);

    // Auto add ₱500 voucher
    const welcomeUserCoupon: UserCoupon = {
      id: `uc_welcome_${Date.now()}`,
      couponId: 'c_welcome500',
      userId: newUserProfile.id,
      title: '🎁 ₱500 New Member Voucher',
      type: 'flat',
      value: 500,
      minOrderAmount: 2000,
      status: 'unused',
      claimedAt: new Date().toISOString(),
    };
    setUserCoupons((prev) => [welcomeUserCoupon, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: newUserProfile.id,
        type: 'system',
        title: '🎉 Welcome to Ginno Family! (注册成功)',
        content: `Account created for ${name}! Enjoy +500 points bonus, ₱1,000 wallet balance & ₱500 welcome voucher.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 120, spread: 80 });
  };

  const logoutUser = () => {
    const guestUser: UserProfile = {
      id: 'usr_guest',
      nickname: 'Guest Visitor',
      phone: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      memberLevel: 'Bronze',
      points: 0,
      walletBalance: 0,
      inviteCode: 'GUEST',
      registerSource: 'phone',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    setIsAdminView(false);
    localStorage.removeItem('ginno_user');
  };

  const [adminAuditLogs, setAdminAuditLogs] = useState<Array<{ id: string; operator: string; action: string; module: string; timestamp: string }>>([
    { id: 'log_01', operator: 'SuperAdmin (Juan)', action: 'Updated System Logistics Freight Rate', module: 'Logistics Settings', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'log_02', operator: 'OpsManager (Maria)', action: 'Triggered Virtual Group Completion #GT8801', module: 'Group Buy', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'log_03', operator: 'SuperAdmin (Juan)', action: 'Published Collector Auction #AUC-2026-09', module: 'Auctions', timestamp: new Date(Date.now() - 14400000).toISOString() },
  ]);

  const addAuditLog = (moduleName: string, actionDetail: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      operator: 'SuperAdmin (Juan)',
      action: actionDetail,
      module: moduleName,
      timestamp: new Date().toISOString(),
    };
    setAdminAuditLogs((prev) => [newLog, ...prev]);
  };

  const adminUpdateOrderStatus = (orderId: string, status: Order['status'], refundApproved?: boolean) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    addAuditLog('Order Management', `Updated status of Order ${orderId} to ${status}${refundApproved ? ' (Refund Approved)' : ''}`);
  };

  const adminSaveCategory = (catData: Partial<Category>) => {
    if (catData.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === catData.id ? ({ ...c, ...catData } as Category) : c))
      );
      addAuditLog('Category Management', `Updated category ${catData.nameEn || catData.id}`);
    } else {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        nameEn: catData.nameEn || 'New Category',
        nameTl: catData.nameTl || 'Bagong Kategorya',
        nameZh: catData.nameZh || '新分类',
        icon: catData.icon || 'Package',
        banner: catData.banner || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        parentId: catData.parentId,
        level: catData.level || 1,
        sort: catData.sort || 1,
        status: 'active',
      };
      setCategories((prev) => [...prev, newCat]);
      addAuditLog('Category Management', `Created new category ${newCat.nameEn}`);
    }
  };

  const adminDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    addAuditLog('Category Management', `Deleted category ${catId}`);
  };

  const adminSaveCoupon = (cpnData: Partial<Coupon>) => {
    if (cpnData.id) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === cpnData.id ? ({ ...c, ...cpnData } as Coupon) : c))
      );
      addAuditLog('Marketing', `Updated coupon ${cpnData.title || cpnData.id}`);
    } else {
      const newCpn: Coupon = {
        id: `cpn_${Date.now()}`,
        code: cpnData.code || `GINNO${Math.floor(100 + Math.random() * 900)}`,
        title: cpnData.title || 'Special Promotion Voucher',
        type: cpnData.type || 'flat',
        value: cpnData.value || 100,
        minOrderAmount: cpnData.minOrderAmount || 1000,
        totalCount: cpnData.totalCount || 500,
        claimedCount: 0,
        usedCount: 0,
        perUserLimit: 1,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        status: 'active',
      };
      setCoupons((prev) => [newCpn, ...prev]);
      addAuditLog('Marketing', `Created coupon ${newCpn.title}`);
    }
  };

  const adminDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    addAuditLog('Marketing', `Deleted coupon ${couponId}`);
  };

  const adminUpdateUser = (userData: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...userData }));
    addAuditLog('User Management', `Updated user profile/status for ${userData.id || user.id}`);
  };

  const adminSaveBanner = (bnData: Partial<Banner>) => {
    if (bnData.id) {
      setBanners((prev) =>
        prev.map((b) => (b.id === bnData.id ? ({ ...b, ...bnData } as Banner) : b))
      );
      addAuditLog('CMS', `Updated banner ${bnData.title || bnData.id}`);
    } else {
      const newBn: Banner = {
        id: `bn_${Date.now()}`,
        title: bnData.title || 'Promo Banner',
        imageUrl: bnData.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
        linkTarget: bnData.linkTarget || '/category/cat_electronics',
        sort: bnData.sort || 1,
        status: 'active',
      };
      setBanners((prev) => [newBn, ...prev]);
      addAuditLog('CMS', `Added new banner ${newBn.title}`);
    }
  };

  const adminDeleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    addAuditLog('CMS', `Deleted banner ${bannerId}`);
  };

  // Blind Box Logic
  const openBlindBox = (boxId: string) => {
    const box = blindBoxes.find((b) => b.id === boxId);
    if (!box) return { success: false, message: 'Blind box not found' };
    if (box.stock <= 0) return { success: false, message: 'Blind box sold out' };

    const items = box.items;
    if (!items || items.length === 0) return { success: false, message: 'No prizes configured in this blind box' };

    // Probability Weighted Selection
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedItem = items[items.length - 1];

    for (const item of items) {
      cumulative += item.probability;
      if (rand <= cumulative) {
        selectedItem = item;
        break;
      }
    }

    // Deduct wallet balance / points reward
    setUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - box.price),
      points: prev.points + Math.floor(box.price / 10),
    }));

    // Update Blind Box Stock & Sales
    setBlindBoxes((prev) =>
      prev.map((b) =>
        b.id === boxId
          ? { ...b, stock: Math.max(0, b.stock - 1), salesCount: b.salesCount + 1 }
          : b
      )
    );

    // Create Unboxing Record
    const newRecord: UnboxingRecord = {
      id: `ubr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.nickname,
      userAvatar: user.avatar,
      blindBoxId: box.id,
      blindBoxTitle: box.titleZh || box.titleEn,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemImage: selectedItem.image,
      itemValue: selectedItem.value,
      itemRarity: selectedItem.rarity,
      status: 'delivered',
      createdAt: new Date().toISOString(),
    };

    setUnboxingRecords((prev) => [newRecord, ...prev]);

    // Create Order Record
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0] || {
      id: 'default_addr',
      receiverName: user.nickname,
      phone: user.phone,
      province: 'Metro Manila',
      city: 'Quezon City',
      barangay: 'Central',
      streetDetail: 'Ginno Express Logistics Station',
      zipCode: '1100',
      isDefault: true,
    };

    const blindBoxOrder: Order = {
      id: `ord_bb_${Date.now()}`,
      orderNo: `GINNO-BB-${Date.now().toString().slice(-8)}`,
      userId: user.id,
      orderType: 'normal',
      status: 'to_ship',
      items: [
        {
          id: `oi_bb_${Date.now()}`,
          productId: box.id,
          skuId: selectedItem.id,
          productName: `[盲盒寻宝] ${selectedItem.name}`,
          skuSpecs: `盲盒款式 [${selectedItem.rarity}] 专柜价值 ₱${selectedItem.value.toLocaleString()}`,
          image: selectedItem.image,
          price: box.price,
          quantity: 1,
          total: box.price,
        },
      ],
      receiverAddress: defaultAddr,
      paymentMethod: 'Wallet',
      paymentStatus: 'paid',
      totalAmount: box.price,
      shippingFee: 0,
      discountAmount: 0,
      payAmount: box.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [blindBoxOrder, ...prev]);

    if (selectedItem.rarity === 'SSR' || selectedItem.rarity === 'SR') {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (e) {
        // ignore if confetti unavailable
      }
    }

    return { success: true, prize: selectedItem, record: newRecord };
  };

  const recycleUnboxedItem = (recordId: string) => {
    const rec = unboxingRecords.find((r) => r.id === recordId);
    if (!rec || rec.status === 'recycled') return { success: false, pointsEarned: 0, walletEarned: 0 };

    const walletRefund = Math.floor(rec.itemValue * 0.8);
    const pointsBonus = Math.floor(rec.itemValue * 0.1);

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + walletRefund,
      points: prev.points + pointsBonus,
    }));

    setUnboxingRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'recycled' } : r))
    );

    addAuditLog('盲盒营销管理', `用户转卖盲盒抽中商品: ${rec.itemName} (退还 ₱${walletRefund})`);

    return { success: true, pointsEarned: pointsBonus, walletEarned: walletRefund };
  };

  const adminSaveBlindBox = (boxData: Partial<BlindBox>) => {
    if (boxData.id) {
      setBlindBoxes((prev) =>
        prev.map((b) => (b.id === boxData.id ? ({ ...b, ...boxData } as BlindBox) : b))
      );
      addAuditLog('盲盒营销管理', `修改盲盒活动: ${boxData.titleZh || boxData.titleEn}`);
    } else {
      const newBox: BlindBox = {
        id: `box_${Date.now()}`,
        titleEn: boxData.titleEn || 'New Mystery Box',
        titleTl: boxData.titleTl || 'Bagong Misteryo Box',
        titleZh: boxData.titleZh || '新盲盒寻宝',
        descriptionEn: boxData.descriptionEn || '',
        descriptionTl: boxData.descriptionTl || '',
        descriptionZh: boxData.descriptionZh || '',
        categoryId: boxData.categoryId || 'cat_electronics',
        coverImage: boxData.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        price: boxData.price || 199,
        originalValue: boxData.originalValue || 500,
        stock: boxData.stock || 100,
        salesCount: 0,
        rating: 5.0,
        status: boxData.status || 'active',
        items: boxData.items || [],
        tags: boxData.tags || ['新爆款', '正品推荐'],
        createdAt: new Date().toISOString(),
      };
      setBlindBoxes((prev) => [newBox, ...prev]);
      addAuditLog('盲盒营销管理', `新建盲盒活动: ${newBox.titleZh}`);
    }
  };

  const adminDeleteBlindBox = (boxId: string) => {
    setBlindBoxes((prev) => prev.filter((b) => b.id !== boxId));
    addAuditLog('盲盒营销管理', `删除盲盒活动 ID: ${boxId}`);
  };

  // Enterprise Partnership & Merchants (企业合作与店家管理)
  const registerMerchant = (payload: {
    username?: string;
    storeName: string;
    type?: MerchantType;
    ownerName?: string;
    phone: string;
    email: string;
    idCardNumber?: string;
    businessLicenseNumber?: string;
    taxNumber?: string;
    category?: string;
    description?: string;
    password?: string;
    licenseImage?: string;
    idCardImage?: string;
    idCardBackImage?: string;
    bannerImage?: string;
    address?: string;
  }) => {
    const merchantId = `mch_${Date.now()}`;
    const chosenType = payload.type || 'enterprise';
    const storeDisplayName = payload.storeName || payload.username || '我的优选店铺';
    const ownerDisplayName = payload.ownerName || payload.username || storeDisplayName;

    const newMerchant: Merchant = {
      id: merchantId,
      storeName: storeDisplayName,
      type: chosenType,
      ownerName: ownerDisplayName,
      phone: payload.phone,
      email: payload.email,
      idCardNumber: payload.idCardNumber || '待在【店家设置】中补充',
      businessLicenseNumber: payload.businessLicenseNumber || '',
      taxNumber: payload.taxNumber || '',
      category: payload.category || '数码家电 (Electronics & Gadgets)',
      description: payload.description || '店铺基本资料已建立，资质正在补充中。',
      logo:
        chosenType === 'enterprise'
          ? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80',
      licenseImage: payload.licenseImage || '',
      idCardImage: payload.idCardImage || '',
      idCardBackImage: payload.idCardBackImage || '',
      bannerImage: payload.bannerImage || '',
      address: payload.address || 'Metro Manila, Philippines',
      status: 'pending_review',
      registeredAt: new Date().toISOString(),
      ratingTier: 'C',
      compositeScore: 4.0,
      qualityScore: 4.0,
      serviceScore: 4.0,
      logisticsScore: 4.0,
      positiveRate: 100,
      totalSalesAmount: 0,
      totalOrdersCount: 0,
      activeProductsCount: 0,
      marginDeposit: chosenType === 'enterprise' ? 50000 : 20000,
      commissionRate: 5.0,
      violationPoints: 0,
      violationRecordsCount: 0,
      accountPasswordHash: payload.password || '123456',
      notes: `${chosenType === 'enterprise' ? '企业合作入驻' : '个人店家入驻'}，极速注册成功。资质待店家在【店家设置】中完善补充并审核。`,
    };

    setMerchants((prev) => [newMerchant, ...prev]);
    addAuditLog('店家审核机制', `收到新入驻申请: ${newMerchant.storeName} (${newMerchant.type === 'enterprise' ? '企业店家' : '个人店家'})`);

    setToastNotice({
      message: language === 'ZH' ? '店家入驻申请已成功提交，待平台审核！' : 'Store onboarding application submitted for review!',
      type: 'success',
    });

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: language === 'ZH' ? '🏢 店家入驻申请已受理' : '🏢 Merchant Application Received',
        content:
          language === 'ZH'
            ? `您的店铺「${newMerchant.storeName}」入驻材料已提交平台审核机制，请关注后续状态。`
            : `Your store "${newMerchant.storeName}" has been submitted for platform review.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 70, spread: 60 });
    return { success: true, message: 'Application submitted successfully', merchantId };
  };

  const adminApproveMerchant = (
    merchantId: string,
    notes?: string,
    customTier?: MerchantRatingTier,
    commissionRate?: number
  ) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: 'active',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'SuperAdmin (Juan)',
              ratingTier: customTier || m.ratingTier || 'C',
              commissionRate: commissionRate !== undefined ? commissionRate : m.commissionRate,
              notes: notes ? `${m.notes || ''} [审核通过: ${notes}]` : m.notes,
            }
          : m
      )
    );
    addAuditLog('店家审核机制', `审核通过店家入驻申请: ${merchantId}`);
    setToastNotice({
      message: language === 'ZH' ? '店家审核已通过，账号已激活！' : 'Store approved and account activated!',
      type: 'success',
    });
  };

  const adminRejectMerchant = (merchantId: string, reason: string) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'SuperAdmin (Juan)',
              rejectReason: reason,
            }
          : m
      )
    );
    addAuditLog('店家审核机制', `驳回店家入驻申请 ${merchantId}，原因: ${reason}`);
    setToastNotice({
      message: language === 'ZH' ? '已驳回该店家入驻申请' : 'Store onboarding application rejected',
      type: 'info',
    });
  };

  const adminToggleMerchantStatus = (merchantId: string) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          const nextStatus = m.status === 'active' ? 'suspended' : 'active';
          addAuditLog('店家管理', `变更店家状态 ${m.storeName} -> ${nextStatus}`);
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
    setToastNotice({
      message: language === 'ZH' ? '店家账号状态已更新！' : 'Merchant account status updated!',
      type: 'success',
    });
  };

  const adminResetMerchantPassword = (merchantId: string, newPassword?: string) => {
    const generated = newPassword || `GinnoShop@${Math.floor(1000 + Math.random() * 9000)}`;
    setMerchants((prev) =>
      prev.map((m) => (m.id === merchantId ? { ...m, accountPasswordHash: generated } : m))
    );
    addAuditLog('店家管理', `重置店家登录密码 ${merchantId}`);
    return { newPassword: generated };
  };

  const adminUpdateMerchantTier = (
    merchantId: string,
    tier: MerchantRatingTier,
    commissionRate?: number,
    badges?: string[]
  ) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              ratingTier: tier,
              commissionRate: commissionRate !== undefined ? commissionRate : m.commissionRate,
              badges: badges !== undefined ? badges : m.badges,
            }
          : m
      )
    );
    addAuditLog('店家评级管理', `调整店家评级等级 ${tier} (${merchantId})`);
    setToastNotice({
      message: language === 'ZH' ? '店家评级与费率已成功更新！' : 'Merchant rating tier updated successfully!',
      type: 'success',
    });
  };

  const adminAddMerchantViolation = (
    violationData: Omit<MerchantViolationRecord, 'id' | 'occurredAt' | 'operator'>
  ) => {
    const newViolation: MerchantViolationRecord = {
      ...violationData,
      id: `viol_${Date.now()}`,
      occurredAt: new Date().toISOString(),
      operator: 'SuperAdmin (Juan)',
      appealStatus: 'none',
    };

    setMerchantViolations((prev) => [newViolation, ...prev]);

    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === violationData.merchantId) {
          const updatedPoints = m.violationPoints + violationData.pointsDeducted;
          const shouldSuspend =
            updatedPoints >= 12 ||
            violationData.actionTaken === 'permanent_ban' ||
            violationData.actionTaken === 'freeze_7_days';
          const nextStatus = shouldSuspend ? 'suspended' : m.status;
          return {
            ...m,
            violationPoints: updatedPoints,
            violationRecordsCount: m.violationRecordsCount + 1,
            status: nextStatus,
          };
        }
        return m;
      })
    );

    addAuditLog(
      '店家违规管理',
      `登记店家违规: ${violationData.merchantName} 扣除${violationData.pointsDeducted}分 (${violationData.type})`
    );
    setToastNotice({
      message: language === 'ZH' ? '店家违规处理记录已登记！' : 'Merchant violation penalty recorded!',
      type: 'info',
    });
  };

  const adminHandleViolationAppeal = (recordId: string, accepted: boolean, reviewNote?: string) => {
    const record = merchantViolations.find((v) => v.id === recordId);
    if (!record) return;

    setMerchantViolations((prev) =>
      prev.map((v) =>
        v.id === recordId
          ? {
              ...v,
              appealStatus: accepted ? 'accepted' : 'rejected',
              appealReason: reviewNote || v.appealReason,
            }
          : v
      )
    );

    if (accepted) {
      // Revert deducted points
      setMerchants((prev) =>
        prev.map((m) => {
          if (m.id === record.merchantId) {
            const restoredPoints = Math.max(0, m.violationPoints - record.pointsDeducted);
            const canReactivate = restoredPoints < 12 && m.status === 'suspended';
            return {
              ...m,
              violationPoints: restoredPoints,
              status: canReactivate ? 'active' : m.status,
            };
          }
          return m;
        })
      );
    }

    addAuditLog(
      '店家违规管理',
      `处理违规申诉 ${recordId}: ${accepted ? '申诉成立已撤销扣分' : '申诉驳回维持原判'}`
    );
    setToastNotice({
      message: accepted
        ? language === 'ZH'
          ? '申诉已通过，扣分已撤销返还！'
          : 'Appeal accepted! Violation points restored.'
        : language === 'ZH'
        ? '申诉已驳回'
        : 'Appeal rejected.',
      type: 'info',
    });
  };

  const adminUpdateMerchantDetails = (merchantId: string, updates: Partial<Merchant>) => {
    setMerchants((prev) => prev.map((m) => (m.id === merchantId ? { ...m, ...updates } : m)));
    addAuditLog('店家管理', `更新店家资料 ${merchantId}`);
    setToastNotice({
      message: language === 'ZH' ? '店家资料修改成功！' : 'Merchant information updated!',
      type: 'success',
    });
  };

  // Merchant Operational Methods (店家专属工作台功能)
  const merchantShipOrder = (orderId: string, carrier: string, trackingNo: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'to_receive',
              shippingCarrier: carrier,
              trackingNumber: trackingNo,
              updatedAt: new Date().toISOString(),
              trackingHistory: [
                {
                  time: new Date().toISOString(),
                  status: 'Shipped',
                  description: `店家已打包发货，承运商【${carrier}】，运单号: ${trackingNo}`,
                  location: 'Metro Manila Hub',
                },
                ...(o.trackingHistory || []),
              ],
            }
          : o
      )
    );
    setToastNotice({
      message: language === 'ZH' ? `订单 ${orderId} 已发货！运单号: ${trackingNo}` : `Order ${orderId} marked as shipped`,
      type: 'success',
    });
  };

  const merchantHandleRefund = (orderId: string, action: 'approve' | 'reject', remark?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: action === 'approve' ? 'cancelled' : 'to_receive',
              remark: action === 'approve' ? `店家同意退款: ${remark || '原路返还买家'}` : `店家驳回退款: ${remark || '商品已正常履约'}`,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    setToastNotice({
      message: action === 'approve'
        ? (language === 'ZH' ? `已同意订单 ${orderId} 退款申请并原路返还` : `Refund approved`)
        : (language === 'ZH' ? `已驳回订单 ${orderId} 退款申请` : `Refund rejected`),
      type: action === 'approve' ? 'success' : 'info',
    });
  };

  const merchantWithdraw = (amount: number, channel: string, accountNo: string) => {
    if (amount <= 0 || amount > user.walletBalance) {
      return {
        success: false,
        message: language === 'ZH' ? '提现金额无效或超出可用余额！' : 'Withdrawal amount exceeds balance',
      };
    }
    const updatedBalance = user.walletBalance - amount;
    const updatedUser = { ...user, walletBalance: updatedBalance };
    setUser(updatedUser);
    localStorage.setItem('ginno_user', JSON.stringify(updatedUser));

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: user.id,
        type: 'system',
        title: language === 'ZH' ? '💰 店家提现申请已受理' : '💰 Store Withdrawal Submitted',
        content: language === 'ZH'
          ? `已提交 ₱${amount.toLocaleString()} 提现至 ${channel} (${accountNo})，预计2小时内结算到账。`
          : `Withdrawal of ₱${amount.toLocaleString()} to ${channel} submitted.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({ particleCount: 60, spread: 50 });
    return {
      success: true,
      message: language === 'ZH' ? `🎉 成功申请提现 ₱${amount.toLocaleString()} 至 ${channel}！` : `Withdrawal submitted successfully`,
    };
  };

  const merchantToggleProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: p.status === 'online' ? 'offline' : 'online' } : p
      )
    );
    setToastNotice({
      message: language === 'ZH' ? '商品在售状态已更新！' : 'Product status updated!',
      type: 'info',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userCenterActiveNode,
        setUserCenterActiveNode,
        language,
        setLanguage,
        t,
        isAdminView,
        setIsAdminView,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        loginUser,
        registerUser,
        logoutUser,
        user,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        categories,
        products,
        banners,
        cart,
        wishlist,
        addToCart,
        updateCartQty,
        toggleCartSelect,
        toggleSelectAllCart,
        removeCartItem,
        clearSelectedCart,
        toggleWishlist,
        showCartSuccessDrawer,
        setShowCartSuccessDrawer,
        lastAddedCartItem,
        showQuickSpecModal,
        setShowQuickSpecModal,
        quickSpecProduct,
        openQuickSpecModal,
        toastNotice,
        setToastNotice,
        orders,
        createOrder,
        cancelOrder,
        confirmOrderReceipt,
        requestRefund,
        submitProductReview,
        requestOrderInvoice,
        addNewAddress,
        groupActivities,
        groupTeams,
        startGroupBuy,
        joinGroupBuy,
        triggerVirtualGroupCompletion,
        auctions,
        auctionPool,
        auctionBids,
        placeAuctionBid,
        setAutoBid,
        watchAuctionPool,
        coupons,
        userCoupons,
        claimCoupon,
        notifications,
        markNotificationsRead,
        checkInToday,
        lastCheckInDate,
        exchangeCouponWithPoints,
        blindBoxes,
        unboxingRecords,
        openBlindBox,
        recycleUnboxedItem,
        adminSaveBlindBox,
        adminDeleteBlindBox,
        adminSaveProduct,
        adminDeleteProduct,
        adminShipOrder,
        adminUpdateOrderStatus,
        adminPublishAuction,
        adminReAuctionPoolItem,
        adminConvertPoolToSale,
        adminCreateGroupActivity,
        adminSaveCategory,
        adminDeleteCategory,
        adminSaveCoupon,
        adminDeleteCoupon,
        adminUpdateUser,
        adminSaveBanner,
        adminDeleteBanner,
        adminAuditLogs,
        addAuditLog,
        showReturnPolicyModal,
        setShowReturnPolicyModal,
        openReturnPolicyModal,
        checkoutBlindBox,
        openBlindBoxCheckout,
        closeBlindBoxCheckout,
        checkoutGroupTeam,
        openDirectGroupBuyModal,
        closeDirectGroupBuyModal,
        merchants,
        merchantViolations,
        registerMerchant,
        adminApproveMerchant,
        adminRejectMerchant,
        adminToggleMerchantStatus,
        adminResetMerchantPassword,
        adminUpdateMerchantTier,
        adminAddMerchantViolation,
        adminHandleViolationAppeal,
        adminUpdateMerchantDetails,
        loginDemoUser,
        merchantShipOrder,
        merchantHandleRefund,
        merchantWithdraw,
        merchantToggleProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
