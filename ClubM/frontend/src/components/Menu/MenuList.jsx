import React from 'react';

const MenuSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow flex flex-col overflow-hidden">
    <div className="bg-gray-200 h-40 w-full" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
    </div>
  </div>
);

const MenuList = ({ items, loading }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-gray-900">Menu</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <MenuSkeleton key={i} />)
        : items.map(item => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {item.image && (
                <img src={item.image} alt={item.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                <p className="text-gray-500 flex-1">{item.description}</p>
                <div className="mt-2 text-base font-bold text-gray-800">${item.price}</div>
              </div>
            </div>
          ))}
    </div>
  </div>
);

export default MenuList;