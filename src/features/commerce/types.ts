export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  images: string[];
  category: string;
  creatorId: string;
  type: 'digital' | 'physical';
  stock: number;
  status: 'active' | 'sold_out' | 'draft';
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  shippingAddress?: ShippingDetails;
  transactionHash?: string;
}

export interface ShippingDetails {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}