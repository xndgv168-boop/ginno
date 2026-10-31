import React, { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Tag,
  FolderTree,
  Upload,
  Globe,
  DollarSign,
  Layers,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Star,
  X,
  Check,
  Video,
  Truck,
  FileText,
  Zap,
  ArrowLeft,
  ArrowRight,
  Eye,
  Link,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Product, Category, ProductSku } from '../../../types';

// Preset Stock E-Commerce Images for Quick 1-Click Addition
const PRESET_SAMPLE_IMAGES = [
  { name: 'Smart Watch Silver', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
  { name: 'Wireless Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  { name: 'Smart Speaker', url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800' },
  { name: 'Classic Sunglasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800' },
  { name: 'Leather Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  { name: '4K Action Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800' },
  { name: 'Modern Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { name: 'Coffee Grinder', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' },
];

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    adminSaveProduct,
    adminDeleteProduct,
    adminSaveCategory,
    adminDeleteCategory,
    language,
  } = useApp();

  const [productSubTab, setProductSubTab] = useState<'list' | 'stock' | 'categories'>('list');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  // Modal Tab inside Product Form
  const [modalFormTab, setModalFormTab] = useState<'basic' | 'images' | 'skus' | 'details' | 'marketing'>('basic');

  // Modal State for Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Partial<Product>>({
    titleEn: '',
    titleZh: '',
    titleTl: '',
    subtitle: '',
    subtitleZh: '',
    subtitleTl: '',
    categoryId: 'cat_electronics',
    brand: 'Ginno Prime',
    spuCode: `SPU-${Math.floor(1000 + Math.random() * 9000)}`,
    tags: ['Hot Deal', 'Authentic'],
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    videoUrl: '',
    description: 'High-quality product with official local warranty and GCash payment support.',
    descriptionZh: '高品质智能正品，支持菲律宾本地联保与 GCash/Maya 便捷支付。',
    descriptionTl: 'Mataas na kalidad na produkto na may opisyal na warranty at suporta sa GCash.',
    skus: [
      {
        id: `sku_${Date.now()}`,
        productId: '',
        skuCode: 'SKU-STD-01',
        specs: { Color: 'Standard Black' },
        price: 1899,
        originalPrice: 2499,
        costPrice: 950,
        stock: 150,
        stockWarning: 15,
        salesCount: 0,
      },
    ],
    weightKg: 0.5,
    volumeCm3: 1200,
    shippingFee: 0,
    isFreeShipping: true,
    origin: 'Metro Manila Warehouse',
    status: 'on_sale',
    limitPerUser: 5,
    isGroupBuySupported: true,
    isAuctionSupported: false,
    seoTitle: 'Best Quality Smart Product in Philippines - Ginno Mall',
    seoKeywords: 'smart device, gcash payment, ginno store, online shopping ph',
  });

  // Image Upload States
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Category Edit
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category>>({
    nameEn: '',
    nameZh: '',
    nameTl: '',
    icon: 'Package',
    banner: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    level: 1,
    sort: 1,
  });

  // Complete Internationalization Dictionary
  const text = {
    // Top Tabs
    tabProducts: language === 'ZH' ? 'SPU 商品列表' : language === 'TL' ? 'Mga SPU Produkto' : 'SPU Product List',
    tabStock: language === 'ZH' ? '库存预警与日志' : language === 'TL' ? 'Imbentaryo at Logs' : 'Inventory & Stock Logs',
    tabCategories: language === 'ZH' ? '商品三级分类树' : language === 'TL' ? 'Tree ng Kategorya' : 'Categories Hierarchy',
    
    // Header Buttons
    addProductBtn: language === 'ZH' ? '发布/添加新商品' : language === 'TL' ? 'Magdagdag ng Produkto' : 'Add New SPU Product',
    addCategoryBtn: language === 'ZH' ? '添加新分类' : language === 'TL' ? 'Magdagdag ng Kategorya' : 'Add New Category',
    
    // Filters & Table
    searchPlaceholder: language === 'ZH' ? '搜索商品名称、SPU 编码或品牌...' : language === 'TL' ? 'Maghanap ng pamagat, SPU code o brand...' : 'Search title, SPU code or brand...',
    allCategories: language === 'ZH' ? '全部分类' : language === 'TL' ? 'Lahat ng Kategorya' : 'All Categories',
    colProduct: language === 'ZH' ? '商品信息 (SPU / 图)' : language === 'TL' ? 'Produkto (SPU / Larawan)' : 'Product (SPU / Images)',
    colCategory: language === 'ZH' ? '分类与品牌' : language === 'TL' ? 'Kategorya at Brand' : 'Category & Brand',
    colPrice: language === 'ZH' ? '售价与成本 (₱)' : language === 'TL' ? 'Presyo at Gastos (₱)' : 'Price & Cost (₱)',
    colStock: language === 'ZH' ? '库存/销量' : language === 'TL' ? 'Imbentaryo / Benta' : 'Stock / Sales',
    colStatus: language === 'ZH' ? '状态与营销标签' : language === 'TL' ? 'Estado at Mga Tag' : 'Status / Marketing Tags',
    colActions: language === 'ZH' ? '操作' : language === 'TL' ? 'Mga Aksyon' : 'Actions',
    
    // Modal Titles & Tabs
    modalAddTitle: language === 'ZH' ? '添加/发布新 SPU 商品' : language === 'TL' ? 'Gumawa ng Bagong Produkto' : 'Publish New SPU Product',
    modalEditTitle: language === 'ZH' ? '编辑 SPU 商品参数' : language === 'TL' ? 'Baguhin ang Produkto' : 'Edit SPU Product Info',
    
    modalTabBasic: language === 'ZH' ? '1. 基础与多语言标题' : language === 'TL' ? '1. Batayan at Pamagat' : '1. Basic & Multi-Lang Titles',
    modalTabImages: language === 'ZH' ? '2. 多图上传与主图管理' : language === 'TL' ? '2. Mga Larawan' : '2. Images & Multi-Upload',
    modalTabSkus: language === 'ZH' ? '3. 价格与 SKU 规格矩阵' : language === 'TL' ? '3. Presyo at SKUs' : '3. Pricing & SKU Matrix',
    modalTabDetails: language === 'ZH' ? '4. 图文详情与物流参数' : language === 'TL' ? '4. Detalye at Logistika' : '4. Details & Logistics',
    modalTabMarketing: language === 'ZH' ? '5. 拼团拍卖与 SEO 优化' : language === 'TL' ? '5. Marketing at SEO' : '5. Group Buy & SEO',
    
    // Modal Form Labels (i18n)
    titleEnLabel: language === 'ZH' ? '英文商品名称' : language === 'TL' ? 'Pamagat sa Ingles' : 'English Product Title',
    titleZhLabel: language === 'ZH' ? '中文商品名称' : language === 'TL' ? 'Pamagat sa Tsino' : 'Chinese Product Title',
    titleTlLabel: language === 'ZH' ? '菲律宾语商品名称' : language === 'TL' ? 'Pamagat sa Tagalog' : 'Tagalog Product Title',
    
    subtitleEnLabel: language === 'ZH' ? '英文副标题' : language === 'TL' ? 'Sub-pamagat sa Ingles' : 'English Subtitle',
    subtitleZhLabel: language === 'ZH' ? '中文副标题' : language === 'TL' ? 'Sub-pamagat sa Tsino' : 'Chinese Subtitle',
    subtitleTlLabel: language === 'ZH' ? '菲律宾语副标题' : language === 'TL' ? 'Sub-pamagat sa Tagalog' : 'Tagalog Subtitle',
    
    categoryLabel: language === 'ZH' ? '所属商品分类' : language === 'TL' ? 'Kategorya' : 'Product Category',
    brandLabel: language === 'ZH' ? '商品品牌' : language === 'TL' ? 'Brand' : 'Brand Name',
    spuCodeLabel: language === 'ZH' ? 'SPU 货号编码' : language === 'TL' ? 'SPU Code' : 'SPU Item Code',
    statusLabel: language === 'ZH' ? '上架状态' : language === 'TL' ? 'Estado ng Benta' : 'Listing Status',
    
    statusOnSale: language === 'ZH' ? '在售' : language === 'TL' ? 'Ipinagbibili' : 'On Sale',
    statusDraft: language === 'ZH' ? '草稿' : language === 'TL' ? 'Draft' : 'Draft',
    statusOffline: language === 'ZH' ? '已下架' : language === 'TL' ? 'Naka-off' : 'Offline',
    
    tagsLabel: language === 'ZH' ? '营销标签 (用逗号分隔)' : language === 'TL' ? 'Mga Tag ng Marketing' : 'Marketing Tags (comma separated)',
    
    // Multi Image Uploader Text
    uploadTitle: language === 'ZH' ? '商品主图与多角度展示图库' : language === 'TL' ? 'Mga Larawan ng Produkto' : 'Product Image Gallery & Multi-Upload',
    uploadDropText: language === 'ZH' ? '拖拽本地图片文件至此处，或点击选择多张图片上传' : language === 'TL' ? 'I-drag ang mga larawan dito o i-click upang mag-upload ng marami' : 'Drag & drop image files here, or click to browse multiple photos',
    uploadBtnText: language === 'ZH' ? '选择本地图片上传 (支持多选)' : language === 'TL' ? 'Mag-upload ng mga Larawan' : 'Choose Local Images (Multi-select)',
    urlInputPlaceholder: language === 'ZH' ? '输入网络图片 URL 链接 (例如 https://...)' : language === 'TL' ? 'Maglagay ng URL ng larawan...' : 'Enter image URL link (e.g. https://...)',
    addUrlBtn: language === 'ZH' ? '添加链接图片' : language === 'TL' ? 'Idagdag ang URL' : 'Add Image URL',
    presetTitle: language === 'ZH' ? '一键快速选用标准商品示例图库:' : language === 'TL' ? 'Mabilis na piliin ang mga halimbawang larawan:' : 'Quick Select Sample Product Images:',
    uploadedCount: language === 'ZH' ? '已选择/上传' : language === 'TL' ? 'Naka-upload' : 'Uploaded',
    imagesUnit: language === 'ZH' ? '张图片。悬停可设置主图或删除' : language === 'TL' ? 'larawan. I-hover para i-set ang main' : 'images. Click star to set main image.',
    setMainImgBtn: language === 'ZH' ? '设为主图' : language === 'TL' ? 'Gawing Main' : 'Set as Main Image',
    mainBadge: language === 'ZH' ? '★ 商品主图' : language === 'TL' ? '★ Main Image' : '★ Main Image',
    
    // SKU Text
    skuMatrixTitle: language === 'ZH' ? 'SKU 价格与多规格矩阵设置' : language === 'TL' ? 'Matrix ng Presyo at SKUs' : 'SKU Pricing & Specification Matrix',
    salePriceLabel: language === 'ZH' ? '促销售价 (₱)' : language === 'TL' ? 'Presyo ng Benta (₱)' : 'Selling Price (₱)',
    originalPriceLabel: language === 'ZH' ? '划线划扣原价 (₱)' : language === 'TL' ? 'Dating Presyo (₱)' : 'Original Price (₱)',
    costPriceLabel: language === 'ZH' ? '进货成本价 (₱)' : language === 'TL' ? 'Gastos / Puhunan (₱)' : 'Cost Price (₱)',
    stockLabel: language === 'ZH' ? '库存数量 (Pcs)' : language === 'TL' ? 'Dami ng Imbentaryo' : 'Stock Quantity (Pcs)',
    stockWarningLabel: language === 'ZH' ? '库存预警阈值' : language === 'TL' ? 'Warning Limit' : 'Stock Warning Level',
    skuCodeLabel: language === 'ZH' ? 'SKU 独立编码' : language === 'TL' ? 'SKU Code' : 'SKU Variant Code',
    skuSpecLabel: language === 'ZH' ? '规格属性 (如 颜色/尺寸)' : language === 'TL' ? 'Mismong Detalye' : 'Variant Spec (e.g. Color/Size)',
    
    // Descriptions & Logistics
    descEnLabel: language === 'ZH' ? '英文商品详情描述' : language === 'TL' ? 'Paglalarawan sa Ingles' : 'English Product Description',
    descZhLabel: language === 'ZH' ? '中文商品详情描述' : language === 'TL' ? 'Paglalarawan sa Tsino' : 'Chinese Product Description',
    descTlLabel: language === 'ZH' ? '菲律宾语详情描述' : language === 'TL' ? 'Paglalarawan sa Tagalog' : 'Tagalog Product Description',
    
    originLabel: language === 'ZH' ? '发货产地/仓库地址' : language === 'TL' ? 'Pinagmulan ng Bodega' : 'Warehouse / Dispatch Origin',
    weightLabel: language === 'ZH' ? '重量 (Kg)' : language === 'TL' ? 'Timbang (Kg)' : 'Weight (Kg)',
    volumeLabel: language === 'ZH' ? '体积 (cm³)' : language === 'TL' ? 'Laki (cm³)' : 'Volume (cm³)',
    videoUrlLabel: language === 'ZH' ? '商品视频 URL (支持 YouTube / TikTok)' : language === 'TL' ? 'Video URL ng Produkto' : 'Product Video URL',
    
    // Marketing Toggles
    groupBuyToggle: language === 'ZH' ? '支持多人拼团活动' : language === 'TL' ? 'Suportahan ang Group Buy' : 'Enable Group Buy Participation',
    auctionToggle: language === 'ZH' ? '支持现场拍卖会' : language === 'TL' ? 'Suportahan ang Live Auction' : 'Enable Live Auction Listing',
    freeShipToggle: language === 'ZH' ? '全境包邮' : language === 'TL' ? 'Libreng Pagpapadala' : 'Free Shipping Eligible',
    limitPerUserLabel: language === 'ZH' ? '单户限购数量' : language === 'TL' ? 'Limitasyon sa Bawat User' : 'Limit Purchase Per Customer',
    seoTitleLabel: language === 'ZH' ? 'SEO 优化标题 (Meta Title)' : language === 'TL' ? 'SEO Meta Title' : 'SEO Meta Title',
    seoKeywordsLabel: language === 'ZH' ? 'SEO 关键字 (Meta Keywords)' : language === 'TL' ? 'SEO Meta Keywords' : 'SEO Keywords',
    
    // Buttons
    cancelBtn: language === 'ZH' ? '取消关闭' : language === 'TL' ? 'Kanselahin' : 'Cancel',
    saveProductBtn: language === 'ZH' ? '保存 SPU 商品信息' : language === 'TL' ? 'I-save ang Produkto' : 'Save SPU Product',
    
    // Alerts
    saveSuccessAlert: language === 'ZH' ? '商品信息及多图库配置已成功更新！' : language === 'TL' ? 'Matagumpay na na-save ang produkto at mga larawan!' : 'Product info & multi-image gallery successfully saved!',
    needTitleAlert: language === 'ZH' ? '请至少填写英文商品名称！' : language === 'TL' ? 'Mangyaring ilagay ang pamagat sa Ingles!' : 'Please enter at least the English product title!',
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const titleMatch =
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.titleZh && p.titleZh.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.titleTl && p.titleTl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.spuCode && p.spuCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const catMatch = selectedCatId === 'all' || p.categoryId === selectedCatId;
    return titleMatch && catMatch;
  });

  const handleOpenEditProduct = (prod?: Product) => {
    if (prod) {
      const imgList = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.mainImage];
      setEditingProd({
        ...prod,
        titleZh: prod.titleZh || '',
        titleTl: prod.titleTl || '',
        subtitleZh: prod.subtitleZh || '',
        subtitleTl: prod.subtitleTl || '',
        descriptionZh: prod.descriptionZh || '',
        descriptionTl: prod.descriptionTl || '',
        mainImage: prod.mainImage || imgList[0],
        images: imgList,
      });
    } else {
      setEditingProd({
        id: undefined,
        titleEn: '',
        titleZh: '',
        titleTl: '',
        subtitle: '',
        subtitleZh: '',
        subtitleTl: '',
        categoryId: categories[0]?.id || 'cat_electronics',
        brand: 'Ginno Prime',
        spuCode: `SPU-${Math.floor(1000 + Math.random() * 9000)}`,
        tags: ['New Arrival', 'Free Shipping', 'Authentic'],
        mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        ],
        videoUrl: '',
        description: 'Authentic item shipped directly with official PH warranty.',
        descriptionZh: '菲律宾官方正品直发，享本地联保与 7 天无理由退换。',
        descriptionTl: 'Awtentikong produkto na may opisyal na warranty sa Pilipinas.',
        skus: [
          {
            id: `sku_${Date.now()}`,
            productId: '',
            skuCode: 'SKU-001',
            specs: { Variant: 'Standard' },
            price: 1299,
            originalPrice: 1999,
            costPrice: 600,
            stock: 100,
            stockWarning: 10,
            salesCount: 0,
          },
        ],
        weightKg: 0.8,
        volumeCm3: 1500,
        shippingFee: 0,
        isFreeShipping: true,
        origin: 'Metro Manila Warehouse',
        status: 'on_sale',
        limitPerUser: 10,
        isGroupBuySupported: true,
        isAuctionSupported: true,
        seoTitle: 'Buy Authentic Smart Products Online - Ginno PH',
        seoKeywords: 'shopping ph, gcash, maya, ginno store',
      });
    }
    setModalFormTab('basic');
    setShowProductModal(true);
  };

  // Multiple Local Image Files Upload Handler (base64 conversion)
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newImageUrls: string[] = [];
    const fileArray = Array.from(files);
    let processedCount = 0;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImageUrls.push(e.target.result as string);
        }
        processedCount++;
        if (processedCount === fileArray.length) {
          setEditingProd((prev) => {
            const currentImages = prev.images || [];
            const updatedImages = [...currentImages, ...newImageUrls];
            const updatedMain = prev.mainImage || updatedImages[0] || '';
            return {
              ...prev,
              images: updatedImages,
              mainImage: updatedMain,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Image URL directly
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    setEditingProd((prev) => {
      const currentImages = prev.images || [];
      const updated = [...currentImages, url];
      return {
        ...prev,
        images: updated,
        mainImage: prev.mainImage || url,
      };
    });
    setImageUrlInput('');
  };

  // Add Preset Image
  const handleAddPresetImage = (presetUrl: string) => {
    setEditingProd((prev) => {
      const currentImages = prev.images || [];
      if (currentImages.includes(presetUrl)) return prev;
      const updated = [...currentImages, presetUrl];
      return {
        ...prev,
        images: updated,
        mainImage: prev.mainImage || presetUrl,
      };
    });
  };

  // Set as Main Image
  const handleSetMainImage = (url: string) => {
    setEditingProd((prev) => ({
      ...prev,
      mainImage: url,
    }));
  };

  // Remove Image from list
  const handleRemoveImage = (index: number) => {
    setEditingProd((prev) => {
      const current = [...(prev.images || [])];
      const removedUrl = current[index];
      current.splice(index, 1);

      let newMain = prev.mainImage;
      if (newMain === removedUrl) {
        newMain = current[0] || '';
      }
      return {
        ...prev,
        images: current,
        mainImage: newMain,
      };
    });
  };

  // Move image order
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setEditingProd((prev) => {
      const current = [...(prev.images || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;

      return {
        ...prev,
        images: current,
      };
    });
  };

  // Submit product save
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd.titleEn && !editingProd.titleZh) {
      alert(text.needTitleAlert);
      return;
    }

    const finalImages = editingProd.images && editingProd.images.length > 0 
      ? editingProd.images 
      : [editingProd.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
    const finalMain = editingProd.mainImage || finalImages[0];

    const payload: Partial<Product> = {
      ...editingProd,
      titleEn: editingProd.titleEn || editingProd.titleZh || 'New SPU Item',
      titleZh: editingProd.titleZh || editingProd.titleEn,
      titleTl: editingProd.titleTl || editingProd.titleEn,
      mainImage: finalMain,
      images: finalImages,
    };

    adminSaveProduct(payload);
    setShowProductModal(false);
    alert(text.saveSuccessAlert);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Admin Sub-Tabs */}
      <div className="flex justify-between items-center bg-slate-900/80 p-2 rounded-2xl border border-white/10 overflow-x-auto">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setProductSubTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              productSubTab === 'list'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{text.tabProducts} ({products.length})</span>
          </button>
          <button
            onClick={() => setProductSubTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              productSubTab === 'stock'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{text.tabStock}</span>
          </button>
          <button
            onClick={() => setProductSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              productSubTab === 'categories'
                ? 'bg-[#FF6B35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4 text-purple-300" />
            <span>{text.tabCategories} ({categories.length})</span>
          </button>
        </div>

        {productSubTab === 'list' && (
          <button
            onClick={() => handleOpenEditProduct()}
            className="bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{text.addProductBtn}</span>
          </button>
        )}

        {productSubTab === 'categories' && (
          <button
            onClick={() => {
              setEditingCat({ nameEn: '', nameZh: '', nameTl: '', level: 1, sort: 1 });
              setShowCategoryModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{text.addCategoryBtn}</span>
          </button>
        )}
      </div>

      {/* 1. PRODUCT LIST TAB */}
      {productSubTab === 'list' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={text.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#FF6B35]"
            >
              <option value="all">{text.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ZH' ? c.nameZh : language === 'TL' ? c.nameTl : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">{text.colProduct}</th>
                  <th className="p-3">{text.colCategory}</th>
                  <th className="p-3">{text.colPrice}</th>
                  <th className="p-3">{text.colStock}</th>
                  <th className="p-3">{text.colStatus}</th>
                  <th className="p-3 text-right">{text.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.map((p) => {
                  const sku = p.skus[0] || {};
                  const title = language === 'ZH' && p.titleZh ? p.titleZh : language === 'TL' && p.titleTl ? p.titleTl : p.titleEn;
                  const cat = categories.find((c) => c.id === p.categoryId);
                  const catName = cat ? (language === 'ZH' ? cat.nameZh : language === 'TL' ? cat.nameTl : cat.nameEn) : p.categoryId;
                  const imageCount = p.images?.length || 1;

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img src={p.mainImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                            {imageCount > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900">
                                {imageCount}P
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-xs truncate max-w-[220px]">{title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">SPU: {p.spuCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="block font-semibold text-slate-200">{catName}</span>
                        <span className="text-[10px] text-purple-400">{p.brand}</span>
                      </td>
                      <td className="p-3">
                        <span className="block font-black text-[#FF8C61]">₱{sku.price?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 line-through">₱{sku.originalPrice?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 block">Cost: ₱{sku.costPrice || 0}</span>
                      </td>
                      <td className="p-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          (sku.stock || 0) < 10 ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          Stock: {sku.stock}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">Sales: {p.salesCount}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          p.status === 'on_sale' || p.status === 'online'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-400 border-white/10'
                        }`}>
                          {p.status}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.isGroupBuySupported && <span className="text-[9px] bg-[#FF6B35]/20 text-[#FF8C61] px-1.5 py-0.5 rounded">Group</span>}
                          {p.isAuctionSupported && <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Auction</span>}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete product ${p.titleEn}?`)) {
                                adminDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. INVENTORY & STOCK LOGS */}
      {productSubTab === 'stock' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 text-xs font-semibold block">Total Inventory Stock</span>
              <span className="text-2xl font-black text-white">4,820 pcs</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-amber-500/30">
              <span className="text-amber-400 text-xs font-semibold block">Low Stock Alert Items</span>
              <span className="text-2xl font-black text-amber-300">3 SKUs Warning</span>
            </div>
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10">
              <span className="text-slate-400 text-xs font-semibold block">ERP Sync Status</span>
              <span className="text-xs font-bold text-emerald-400 block mt-1">CONNECTED (Shopee/Lazada Sync)</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORIES HIERARCHY TAB */}
      {productSubTab === 'categories' && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white">
              {language === 'ZH' ? '商品三级分类树' : language === 'TL' ? 'Hirarkiya ng Kategorya' : 'Category Hierarchy'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm">
                    {language === 'ZH' ? cat.nameZh : language === 'TL' ? cat.nameTl : cat.nameEn}
                  </h4>
                  <span className="text-xs text-purple-400 font-bold">
                    {cat.nameEn} / {cat.nameZh}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'ZH' ? `${cat.level}级分类` : language === 'TL' ? `Antas ${cat.level}` : `Level ${cat.level}`}
                  {' | '}
                  {language === 'ZH' ? `排序: ${cat.sort}` : language === 'TL' ? `Ayos: ${cat.sort}` : `Sort: ${cat.sort}`}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                  <span className="text-slate-400">
                    {language === 'ZH'
                      ? `包含商品数: ${products.filter((p) => p.categoryId === cat.id).length}`
                      : language === 'TL'
                      ? `Mga Produkto: ${products.filter((p) => p.categoryId === cat.id).length}`
                      : `Products: ${products.filter((p) => p.categoryId === cat.id).length}`}
                  </span>
                  <button
                    onClick={() => {
                      const confirmMsg =
                        language === 'ZH'
                          ? `确认删除分类 ${cat.nameZh || cat.nameEn}?`
                          : language === 'TL'
                          ? `Sigurado ka bang buburahin ang kategorya na ${cat.nameTl || cat.nameEn}?`
                          : `Delete category ${cat.nameEn}?`;
                      if (confirm(confirmMsg)) {
                        adminDeleteCategory(cat.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    {language === 'ZH' ? '删除' : language === 'TL' ? 'Burahin' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT FULL MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-6 space-y-5 text-xs max-h-[92vh] overflow-y-auto border border-white/10 text-slate-100 shadow-2xl">
            {/* Modal Top Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-[#FF6B35] to-purple-600 rounded-xl text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingProd.id ? text.modalEditTitle : text.modalAddTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">SPU: {editingProd.spuCode}</p>
                </div>
              </div>

              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Sub-Tabs (i18n workflow) */}
            <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalFormTab('basic')}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  modalFormTab === 'basic' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{text.modalTabBasic}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalFormTab('images')}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  modalFormTab === 'images' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{text.modalTabImages} ({(editingProd.images || []).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setModalFormTab('skus')}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  modalFormTab === 'skus' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                <span>{text.modalTabSkus}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalFormTab('details')}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  modalFormTab === 'details' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-300" />
                <span>{text.modalTabDetails}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalFormTab('marketing')}
                className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  modalFormTab === 'marketing' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>{text.modalTabMarketing}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-5">
              {/* TAB 1: BASIC INFO & MULTI-LANG TITLES */}
              {modalFormTab === 'basic' && (
                <div className="space-y-4">
                  {/* Multilingual Titles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {text.titleEnLabel} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProd.titleEn || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, titleEn: e.target.value })}
                        placeholder="e.g. Ginno Ultra Smart Watch"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.titleZhLabel}</label>
                      <input
                        type="text"
                        value={editingProd.titleZh || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, titleZh: e.target.value })}
                        placeholder="例如: Ginno 尊享版智能运动手表"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.titleTlLabel}</label>
                      <input
                        type="text"
                        value={editingProd.titleTl || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, titleTl: e.target.value })}
                        placeholder="hal. Ginno Bagong Smart Watch"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  {/* Multilingual Subtitles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.subtitleEnLabel}</label>
                      <input
                        type="text"
                        value={editingProd.subtitle || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, subtitle: e.target.value })}
                        placeholder="e.g. 1 Year Local PH Warranty + GCash Cashbacks"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.subtitleZhLabel}</label>
                      <input
                        type="text"
                        value={editingProd.subtitleZh || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, subtitleZh: e.target.value })}
                        placeholder="例如: 享1年本地联保与免费送货"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.subtitleTlLabel}</label>
                      <input
                        type="text"
                        value={editingProd.subtitleTl || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, subtitleTl: e.target.value })}
                        placeholder="hal. May 1 Taon na Warranty at Libreng Shipping"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Category, Brand, SPU, Status */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.categoryLabel}</label>
                      <select
                        value={editingProd.categoryId || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, categoryId: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B35]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {language === 'ZH' ? c.nameZh : language === 'TL' ? c.nameTl : c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.brandLabel}</label>
                      <input
                        type="text"
                        value={editingProd.brand || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, brand: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.spuCodeLabel}</label>
                      <input
                        type="text"
                        value={editingProd.spuCode || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, spuCode: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.statusLabel}</label>
                      <select
                        value={editingProd.status || 'on_sale'}
                        onChange={(e) => setEditingProd({ ...editingProd, status: e.target.value as any })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold"
                      >
                        <option value="on_sale">{text.statusOnSale}</option>
                        <option value="draft">{text.statusDraft}</option>
                        <option value="offline">{text.statusOffline}</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.tagsLabel}</label>
                    <input
                      type="text"
                      value={(editingProd.tags || []).join(', ')}
                      onChange={(e) =>
                        setEditingProd({
                          ...editingProd,
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Hot Deal, Authentic, Free Shipping, Flash Sale"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: MULTI IMAGE UPLOAD & GALLERY MANAGEMENT */}
              {modalFormTab === 'images' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-2xl border border-white/10">
                    <div>
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>{text.uploadTitle}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {text.uploadedCount} <strong className="text-emerald-400 font-mono">{(editingProd.images || []).length}</strong> {text.imagesUnit}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{text.uploadBtnText}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDraggingOver
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-white scale-[1.01]'
                        : 'border-white/20 hover:border-emerald-400/50 bg-slate-950/40 hover:bg-slate-950/80 text-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{text.uploadDropText}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP, Base64 & Multi-file Selection</p>
                    </div>
                  </div>

                  {/* Image URL Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder={text.urlInputPlaceholder}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                    >
                      {text.addUrlBtn}
                    </button>
                  </div>

                  {/* Preset Quick Images */}
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">{text.presetTitle}</span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPresetImage(preset.url)}
                          className="relative group rounded-xl overflow-hidden border border-white/10 hover:border-emerald-400 aspect-square"
                          title={`Click to add ${preset.name}`}
                        >
                          <img src={preset.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Plus className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Uploaded Images Grid Gallery */}
                  <div>
                    <h5 className="text-xs font-bold text-white mb-2">Current Image Gallery (图片展示与主图设置):</h5>
                    {(!editingProd.images || editingProd.images.length === 0) ? (
                      <div className="bg-white/5 rounded-2xl p-6 text-center text-slate-400 text-xs">
                        No images uploaded yet. Drag files above or pick from presets!
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {editingProd.images.map((imgUrl, idx) => {
                          const isMain = editingProd.mainImage === imgUrl || (idx === 0 && !editingProd.mainImage);

                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-2xl overflow-hidden border transition-all ${
                                isMain ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/50' : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <img src={imgUrl} alt="" className="w-full h-28 object-cover bg-slate-950" />
                              
                              {/* Main Image Badge */}
                              {isMain && (
                                <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" />
                                  <span>{text.mainBadge}</span>
                                </span>
                              )}

                              {/* Index badge */}
                              <span className="absolute bottom-2 left-2 bg-slate-900/80 text-slate-300 text-[9px] font-mono px-1.5 py-0.2 rounded">
                                #{idx + 1}
                              </span>

                              {/* Overlay controls */}
                              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-1">
                                    {idx > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImage(idx, 'left')}
                                        className="p-1 bg-white/20 hover:bg-white/30 text-white rounded"
                                        title="Move Left"
                                      >
                                        <ArrowLeft className="w-3 h-3" />
                                      </button>
                                    )}
                                    {idx < (editingProd.images?.length || 0) - 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveImage(idx, 'right')}
                                        className="p-1 bg-white/20 hover:bg-white/30 text-white rounded"
                                        title="Move Right"
                                      >
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                    title="Delete Image"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {!isMain && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetMainImage(imgUrl)}
                                    className="w-full bg-[#FF6B35] hover:opacity-90 text-white font-bold text-[10px] py-1 rounded-lg flex items-center justify-center gap-1"
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>{text.setMainImgBtn}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SKUS & PRICING MATRIX */}
              {modalFormTab === 'skus' && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 space-y-3">
                    <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      <span>{text.skuMatrixTitle}</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.salePriceLabel}</label>
                        <input
                          type="number"
                          value={editingProd.skus?.[0]?.price || 0}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], price: Number(e.target.value) };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.originalPriceLabel}</label>
                        <input
                          type="number"
                          value={editingProd.skus?.[0]?.originalPrice || 0}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], originalPrice: Number(e.target.value) };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.costPriceLabel}</label>
                        <input
                          type="number"
                          value={editingProd.skus?.[0]?.costPrice || 0}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], costPrice: Number(e.target.value) };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.stockLabel}</label>
                        <input
                          type="number"
                          value={editingProd.skus?.[0]?.stock || 0}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], stock: Number(e.target.value) };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold text-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.skuCodeLabel}</label>
                        <input
                          type="text"
                          value={editingProd.skus?.[0]?.skuCode || 'SKU-STD'}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], skuCode: e.target.value };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.stockWarningLabel}</label>
                        <input
                          type="number"
                          value={editingProd.skus?.[0]?.stockWarning || 10}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], stockWarning: Number(e.target.value) };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">{text.skuSpecLabel}</label>
                        <input
                          type="text"
                          value={editingProd.skus?.[0]?.specs?.Variant || 'Standard'}
                          onChange={(e) => {
                            const skus = [...(editingProd.skus || [])];
                            skus[0] = { ...skus[0], specs: { Variant: e.target.value } };
                            setEditingProd({ ...editingProd, skus });
                          }}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DETAILS & LOGISTICS */}
              {modalFormTab === 'details' && (
                <div className="space-y-4">
                  {/* Multilingual Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.descEnLabel}</label>
                      <textarea
                        rows={4}
                        value={editingProd.description || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.descZhLabel}</label>
                      <textarea
                        rows={4}
                        value={editingProd.descriptionZh || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, descriptionZh: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.descTlLabel}</label>
                      <textarea
                        rows={4}
                        value={editingProd.descriptionTl || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, descriptionTl: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Origin, Weight, Video */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.originLabel}</label>
                      <input
                        type="text"
                        value={editingProd.origin || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, origin: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.weightLabel}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingProd.weightKg || 0.5}
                        onChange={(e) => setEditingProd({ ...editingProd, weightKg: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.volumeLabel}</label>
                      <input
                        type="number"
                        value={editingProd.volumeCm3 || 1000}
                        onChange={(e) => setEditingProd({ ...editingProd, volumeCm3: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.videoUrlLabel}</label>
                      <input
                        type="text"
                        value={editingProd.videoUrl || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MARKETING & SEO CONFIG */}
              {modalFormTab === 'marketing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{text.groupBuyToggle}</span>
                      <input
                        type="checkbox"
                        checked={editingProd.isGroupBuySupported || false}
                        onChange={(e) => setEditingProd({ ...editingProd, isGroupBuySupported: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-[#FF6B35]"
                      />
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{text.auctionToggle}</span>
                      <input
                        type="checkbox"
                        checked={editingProd.isAuctionSupported || false}
                        onChange={(e) => setEditingProd({ ...editingProd, isAuctionSupported: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{text.freeShipToggle}</span>
                      <input
                        type="checkbox"
                        checked={editingProd.isFreeShipping || false}
                        onChange={(e) => setEditingProd({ ...editingProd, isFreeShipping: e.target.checked })}
                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.limitPerUserLabel}</label>
                      <input
                        type="number"
                        value={editingProd.limitPerUser || 10}
                        onChange={(e) => setEditingProd({ ...editingProd, limitPerUser: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.seoTitleLabel}</label>
                      <input
                        type="text"
                        value={editingProd.seoTitle || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, seoTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">{text.seoKeywordsLabel}</label>
                      <input
                        type="text"
                        value={editingProd.seoKeywords || ''}
                        onChange={(e) => setEditingProd({ ...editingProd, seoKeywords: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Bottom Buttons */}
              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
                >
                  {text.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-gradient-to-r from-[#FF6B35] to-purple-600 hover:opacity-95 text-white font-black py-3 rounded-2xl text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{text.saveProductBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs border border-white/10 text-slate-100 shadow-2xl">
            <h3 className="text-base font-black text-white">
              {language === 'ZH' ? '添加商品分类' : language === 'TL' ? 'Magdagdag ng Kategorya' : 'Add New Category'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '英文分类名称' : language === 'TL' ? 'Pangalan ng Kategorya (Ingles)' : 'Category English Name'}
                </label>
                <input
                  type="text"
                  value={editingCat.nameEn || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  placeholder={language === 'ZH' ? '例如: Smart Home' : 'e.g. Smart Home'}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '中文分类名称' : language === 'TL' ? 'Pangalan ng Kategorya (Intsik)' : 'Category Chinese Name'}
                </label>
                <input
                  type="text"
                  value={editingCat.nameZh || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, nameZh: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  placeholder={language === 'ZH' ? '例如: 智能家居' : 'e.g. 智能家居'}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '菲律宾语分类名称' : language === 'TL' ? 'Pangalan ng Kategorya (Tagalog)' : 'Category Tagalog Name'}
                </label>
                <input
                  type="text"
                  value={editingCat.nameTl || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, nameTl: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  placeholder={language === 'ZH' ? '例如: Matalinong Tahanan' : 'hal. Matalinong Tahanan'}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'ZH' ? '分类层级' : language === 'TL' ? 'Antas ng Kategorya' : 'Category Level'}
                </label>
                <select
                  value={editingCat.level || 1}
                  onChange={(e) => setEditingCat({ ...editingCat, level: Number(e.target.value) as 1 | 2 | 3 })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value={1}>{language === 'ZH' ? '一级分类' : language === 'TL' ? 'Unang Antas (Level 1)' : 'Level 1 Category'}</option>
                  <option value={2}>{language === 'ZH' ? '二级分类' : language === 'TL' ? 'Ikalawang Antas (Level 2)' : 'Level 2 Category'}</option>
                  <option value={3}>{language === 'ZH' ? '三级分类' : language === 'TL' ? 'Ikatlong Antas (Level 3)' : 'Level 3 Category'}</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '取消' : language === 'TL' ? 'Kanselahin' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adminSaveCategory(editingCat);
                    setShowCategoryModal(false);
                  }}
                  className="flex-1 bg-purple-600 text-white font-black py-2.5 rounded-xl"
                >
                  {language === 'ZH' ? '保存分类' : language === 'TL' ? 'I-save ang Kategorya' : 'Save Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
