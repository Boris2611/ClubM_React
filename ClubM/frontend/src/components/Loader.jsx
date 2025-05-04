import React from 'react';

const SalesSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow flex flex-col overflow-hidden">
    <div className="bg-gray-200 h-40 w-full" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
    </div>
  </div>
);

const SalesList = ({ sales = [], loading }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6 text-gray-800">Sales</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SalesSkeleton key={i} />)
        : sales.map(sale => (
            <div key={sale._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              {sale.image && (
                <img src={sale.image} alt={sale.name} className="h-40 w-full object-cover" />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-1">{sale.name}</h3>
                <p className="text-gray-600 flex-1">{sale.description}</p>
                <div className="mt-2 text-lg font-bold text-green-600">${sale.price}</div>
              </div>
            </div>
          ))}
    </div>
  </div>
);

export default SalesList;