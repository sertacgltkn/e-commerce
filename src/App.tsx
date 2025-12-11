// src/App.tsx
import { useEffect, useState } from 'react';
import { getProducts } from './services/api';
import type { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        {/* DaisyUI Loading Spinner */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      
      {/* --- NAVBAR (DaisyUI) --- */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-40 px-4">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-primary font-bold">
            🛍️ DaisyUI Mağaza
          </a>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost btn-circle" onClick={() => setIsDrawerOpen(true)}>
            <div className="indicator">
              <span className="text-2xl">🛒</span> {/* Sepet Emojisi */}
              {cart.length > 0 && (
                <span className="badge badge-sm badge-secondary indicator-item">
                  {cart.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* --- ANA İÇERİK --- */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Filtreleme Alanı */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Arama Inputu (DaisyUI) */}
          <div className="form-control flex-1">
            <div className="relative">
              <span className="absolute left-3 top-3 opacity-70">🔍</span>
              <input 
                type="text" 
                placeholder="Ürün ara..." 
                className="input input-bordered w-full pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Kategori Select (DaisyUI) */}
          <select 
            className="select select-bordered w-full md:w-xs"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Ürün Listesi Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            // DaisyUI Card
            <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
              <figure className="px-4 pt-4 h-48 bg-white">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="h-full object-contain"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-base truncate" title={product.title}>
                  {product.title}
                </h2>
                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                
                <div className="card-actions justify-between items-center mt-4">
                  <span className="text-lg font-bold text-primary">{product.price} ₺</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn btn-primary btn-sm"
                  >
                    ➕ Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 opacity-60">
            <p className="text-xl">Aradığınız kriterlere uygun ürün bulunamadı 😔</p>
          </div>
        )}
      </main>

      {/* --- SEPET DRAWER (SIDEBAR) --- */}
      {/* Arka plan karartma (Overlay) */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Sağ Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Sepet Başlığı */}
          <div className="p-4 bg-base-200 flex justify-between items-center">
            <h2 className="text-lg font-bold">Sepetim ({cart.length})</h2>
            <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setIsDrawerOpen(false)}>
              ✕
            </button>
          </div>

          {/* Sepet Listesi */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center mt-10 opacity-50">Sepetiniz boş 🛒</div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex gap-3 items-center bg-base-200 p-2 rounded-lg">
                  <img src={item.image} alt="" className="w-12 h-12 object-contain bg-white rounded p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.title}</p>
                    <p className="text-xs text-primary">{item.price} ₺</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)} 
                    className="btn btn-ghost btn-xs text-error text-lg"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Alt Kısım (Toplam & Ödeme) */}
          {cart.length > 0 && (
            <div className="p-4 border-t bg-base-200">
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>Toplam:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} ₺</span>
              </div>
              <button className="btn btn-success btn-block text-white shadow-lg">
                Siparişi Tamamla ✅
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;