import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ReturnPolicyModal } from './components/common/ReturnPolicyModal';
import { AddToCartSuccessModal } from './components/cart/AddToCartSuccessModal';
import { QuickSpecModal } from './components/cart/QuickSpecModal';
import { ToastNotification } from './components/common/ToastNotification';

import { HomePage } from './components/home/HomePage';
import { CategoryPage } from './components/products/CategoryPage';
import { ProductListPage } from './components/products/ProductListPage';
import { ProductDetailPage } from './components/products/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/cart/CheckoutPage';
import { OrdersPage } from './components/orders/OrdersPage';

import { GroupBuyHub } from './components/groupbuy/GroupBuyHub';
import { GroupBuyWaitingRoom } from './components/groupbuy/GroupBuyWaitingRoom';

import { AuctionHall } from './components/auction/AuctionHall';
import { AuctionDetailPage } from './components/auction/AuctionDetailPage';

import { UserCenter } from './components/user/UserCenter';
import { BlindBoxPage } from './components/blindbox/BlindBoxPage';
import { BlindBoxCheckoutModal } from './components/blindbox/BlindBoxCheckoutModal';
import { DirectGroupBuyModal } from './components/groupbuy/DirectGroupBuyModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { ArchitectureDocsModal } from './components/docs/ArchitectureDocsModal';

import { Product, GroupBuyTeam, AuctionItem } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isAdminView,
    isAdminAuthenticated,
    products,
    groupTeams,
    auctions,
    checkoutBlindBox,
    closeBlindBoxCheckout,
    checkoutGroupTeam,
    closeDirectGroupBuyModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected State
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedTeam, setSelectedTeam] = useState<GroupBuyTeam>(groupTeams[0]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem>(auctions[0]);

  // System Documentation Modal
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans antialiased selection:bg-[#FF6B35] selection:text-white relative overflow-x-hidden">
      {/* Ambient Frosted Background Orbs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-purple-600/25 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-1/3 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-2/3 left-10 w-80 h-80 bg-orange-500/15 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Header Navigation */}
      <div className="relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenDocs={() => setShowDocsModal(true)}
        />
      </div>

      {/* Main Body Router */}
      <main className="flex-1 relative z-10">
        {isAdminView ? (
          isAdminAuthenticated ? (
            <AdminDashboard />
          ) : (
            <AdminLogin />
          )
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
                setSelectedAuction={setSelectedAuction}
              />
            )}

            {activeTab === 'categories' && (
              <CategoryPage
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
              />
            )}

            {activeTab === 'products' && (
              <ProductListPage
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'product-detail' && (
              <ProductDetailPage
                product={selectedProduct}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'cart' && <CartPage setActiveTab={setActiveTab} />}

            {activeTab === 'checkout' && <CheckoutPage setActiveTab={setActiveTab} />}

            {activeTab === 'orders' && <OrdersPage />}

            {activeTab === 'group-buy' && (
              <GroupBuyHub
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
                setSelectedTeam={setSelectedTeam}
              />
            )}

            {activeTab === 'group-waiting' && (
              <GroupBuyWaitingRoom
                team={selectedTeam}
                product={selectedProduct}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'auctions' && (
              <AuctionHall
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
                setSelectedAuction={setSelectedAuction}
              />
            )}

            {activeTab === 'auction-detail' && (
              <AuctionDetailPage
                auction={selectedAuction}
                product={selectedProduct}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'blind-box' && <BlindBoxPage />}

            {activeTab === 'user' && <UserCenter setActiveTab={setActiveTab} />}
          </>
        )}
      </main>

      {/* Footer & Mobile Navigation */}
      {!isAdminView && <Footer />}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Modals & Notifications */}
      <AuthModal />
      <ReturnPolicyModal />
      <AddToCartSuccessModal />
      <QuickSpecModal />
      <BlindBoxCheckoutModal
        box={checkoutBlindBox}
        onClose={closeBlindBoxCheckout}
      />
      <DirectGroupBuyModal
        team={checkoutGroupTeam?.team || null}
        product={checkoutGroupTeam?.product || null}
        onClose={closeDirectGroupBuyModal}
        onSuccess={(team, prod) => {
          setSelectedTeam(team);
          setSelectedProduct(prod);
          setActiveTab('group-waiting');
        }}
      />
      <ToastNotification />
      <ArchitectureDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
