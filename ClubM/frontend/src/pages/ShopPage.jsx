import React, { useEffect, useState } from 'react';
import SalesList from '../components/Sales/SalesList';
import RentalsList from '../components/Rentals/RentalsList';
import { fetchSalesItems, fetchRentalItems } from '../utils/api';

const ShopPage = () => {
    const [sales, setSales] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obe liste koriste svoj refresh
    const fetchAll = async () => {
        setLoading(true);
        try {
            const [salesData, rentalsData] = await Promise.all([
                fetchSalesItems(),
                fetchRentalItems()
            ]);
            setSales(salesData);
            setRentals(rentalsData);
        } catch (err) {
            setError('Failed to load shop');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-2 md:p-4">
            <h1 className="text-2xl font-bold mb-4">Prodavnica</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-green-700">Na podaju</h2>
                <SalesList sales={sales} loading={loading} refresh={fetchAll} />
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Za iznajmljivanje</h2>
                <RentalsList rentals={rentals} loading={loading} refresh={fetchAll} />
            </div>
        </div>
    );
};

export default ShopPage;