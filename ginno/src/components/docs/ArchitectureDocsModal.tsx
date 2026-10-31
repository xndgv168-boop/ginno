import React, { useState } from 'react';
import { X, Server, Database, GitBranch, Layers, Globe, Shield, Terminal, BookOpen } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [docTab, setDocTab] = useState<'arch' | 'er' | 'flow' | 'routes' | 'api' | 'deploy'>('arch');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#1B2845] text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FF6B35] rounded-2xl text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">Ginno Technical Specification & System Architecture</h2>
              <p className="text-xs text-gray-300">
                Detailed Specifications: Microservices, ER Database, Business Flows, API Spec & Cloud Run Deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-100 p-3 flex overflow-x-auto gap-2 border-b border-gray-200 text-xs font-bold shrink-0">
          {[
            { id: 'arch', label: '1. System Architecture' },
            { id: 'er', label: '2. Database ER Models' },
            { id: 'flow', label: '3. Core Business Processes' },
            { id: 'routes', label: '4. Frontend Route Map' },
            { id: 'api', label: '5. API & WebSocket Spec' },
            { id: 'deploy', label: '6. Cloud Run Deployment' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                docTab === tab.id
                  ? 'bg-[#FF6B35] text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-800 leading-relaxed">
          {docTab === 'arch' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">1. Microservices System Architecture Diagram</h3>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto leading-tight shadow-inner">
{`+-----------------------------------------------------------------------------------+
|                            CLIENT LAYERS (PWA / H5 / Native)                       |
|   React 18 + Tailwind CSS + PWA Service Worker + WebSocket Auction Ticker           |
+-----------------------------------------------------------------------------------+
                                          | HTTPS / WSS
                                          v
+-----------------------------------------------------------------------------------+
|                             API GATEWAY LAYER (Kong / Nginx)                       |
|  JWT Auth Validation | Rate Limiting (100 req/s) | SSL Termination | TLS 1.3        |
+-----------------------------------------------------------------------------------+
                                          |
     +-------------------+----------------+--------------------+--------------------+
     |                   |                |                    |                    |
     v                   v                v                    v                    v
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
| User      |      | Product   |    | Order     |        | Group-Buy |        | Auction   |
| Service   |      | Service   |    | Service   |        | Service   |        | Service   |
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
     |                   |                |                    |                    |
     v                   v                v                    v                    v
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
| Payment   |      | Logistics |    | Marketing |        | Search    |        | CMS       |
| Service   |      | Service   |    | Service   |        | Service   |        | Service   |
+-----------+      +-----------+    +-----------+        +-----------+        +-----------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                  DATA PERSISTENCE                                 |
|  - PostgreSQL 15: Users, Orders, Products, Group Deals, Auctions (Transactional)   |
|  - Redis Cluster: Session, Caching, Live Bids, Inventory Locks, Anti-Snipe Timers  |
|  - MongoDB: User Action Audit Logs, Product Reviews, Merchant Logs                |
|  - Elasticsearch: Full-text Product & Category Search Engine                      |
+-----------------------------------------------------------------------------------+`}
              </pre>
            </div>
          )}

          {docTab === 'er' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">2. Database ER Relationship Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Core Tables & Foreign Keys</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li><strong>users</strong> (id PK, phone, member_level, wallet_balance)</li>
                    <li><strong>products</strong> (id PK, category_id FK, title_en, status)</li>
                    <li><strong>product_skus</strong> (id PK, product_id FK, price, stock)</li>
                    <li><strong>orders</strong> (id PK, user_id FK, pay_amount, status)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Group Buy & Auction Tables</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li><strong>group_buy_teams</strong> (id PK, leader_id FK, status)</li>
                    <li><strong>auction_items</strong> (id PK, starting_bid, current_highest_bid)</li>
                    <li><strong>auction_bids</strong> (id PK, auction_id FK, bid_amount)</li>
                    <li><strong>auction_pool</strong> (id PK, last_highest_bid, no_sale_reason)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {docTab === 'flow' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">3. Core Business Process Flowcharts</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-1">🔥 Group Buy Process Flow</h4>
                  <p className="text-gray-600">
                    Select Product → Choose 2/3/5 Person Tier → Checkout & Pay → Receive Team Invite Link → Share on Messenger/Viber → Members Join → Threshold Met → Automatic Order Dispatch (or Virtual Fill Fallback).
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-1">🔨 Live Auction & Anti-Snipe Flow</h4>
                  <p className="text-gray-600">
                    Live Room Join → Place Bid / Auto-Bid Proxy → WebSocket Broadcasts Price → If bid in last 5 min, Extend Timer by 5 min → Auction Ends → Highest Bidder Wins → 24h Payment Timer → Unpaid items move to Auction Pool (流拍池).
                  </p>
                </div>
              </div>
            </div>
          )}

          {docTab === 'routes' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">4. Frontend Page Route Map</h3>
              <ul className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <li>/ (Home Page)</li>
                <li>/categories (Category Tree)</li>
                <li>/products (Product Listing)</li>
                <li>/product/:id (Product Detail)</li>
                <li>/cart (Shopping Cart)</li>
                <li>/checkout (Checkout & Payment)</li>
                <li>/orders (Order Management)</li>
                <li>/group-buy (Group Buy Hub)</li>
                <li>/group-buy/team/:id (Waiting Room)</li>
                <li>/auctions (Auction Hall)</li>
                <li>/auction/:id (Live Auction Room)</li>
                <li>/user (User Center & Profile)</li>
                <li>/admin (Operations Dashboard)</li>
              </ul>
            </div>
          )}

          {docTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">5. RESTful API & WebSocket Spec</h3>
              <pre className="bg-slate-900 text-amber-300 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto leading-tight shadow-inner">
{`POST /api/v1/auth/login                  -> Login with mobile OTP
GET  /api/v1/products/list               -> Fetch products with filters
POST /api/v1/orders/create               -> Create new order (GCash/COD)
POST /api/v1/group-buy/teams/create      -> Start group buy team
POST /api/v1/auctions/:id/bid            -> Place auction bid
WSS  /ws/auction/:id                     -> WebSocket live bid updates stream`}
              </pre>
            </div>
          )}

          {docTab === 'deploy' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-gray-900">6. High-Availability Cloud Run Deployment</h3>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <p><strong>Cloud Region:</strong> asia-east1 (Taiwan / Hong Kong latency &lt; 30ms to Manila)</p>
                <p><strong>Container Setup:</strong> Express + Vite bundle, Node 20 runtime, Port 3000 ingress routing</p>
                <p><strong>Auto-scaling:</strong> 2 to 20 instances based on CPU threshold &gt; 70% during Flash Sales</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
