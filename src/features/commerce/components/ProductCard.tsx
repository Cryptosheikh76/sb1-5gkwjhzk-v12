import { Product } from '../types';
import { useOrders } from '../hooks/useOrders';
import { Button } from '../../../components/ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { createOrder, loading } = useOrders();

  const handlePurchase = async () => {
    try {
      await createOrder(product.id, 1);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg overflow-hidden">
      <img 
        src={product.images[0]} 
        alt={product.title}
        className="w-full aspect-square object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-gray-400">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium">
            {product.price} {product.currency}
          </span>
          <Button
            onClick={handlePurchase}
            disabled={loading || product.stock === 0}
            loading={loading}
          >
            {product.stock === 0 ? 'Sold Out' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}