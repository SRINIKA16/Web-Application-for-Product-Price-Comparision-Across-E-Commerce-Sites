import React, { createContext, useContext, useState, useEffect } from 'react';
import { Wishlist } from '../types';
import { wishlistService } from '../services/api';

interface WishlistContextType {
  wishlist: Wishlist[];
  loading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.product === productId || item.product_details?.id === productId);
  };

  const toggleWishlist = async (productId: number) => {
    const existing = wishlist.find((item) => item.product === productId || item.product_details?.id === productId);
    if (existing) {
      await wishlistService.removeFromWishlist(existing.id);
    } else {
      await wishlistService.addToWishlist(productId);
    }
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist, refreshWishlist: fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
