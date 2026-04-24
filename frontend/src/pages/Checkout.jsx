import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { cart, totalPrice, clearCart } = useCart();

    const api = useMemo(() => {
        return axios.create({
            baseURL: "http://localhost:3000",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }, [token]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [newIsDefault, setNewIsDefault] = useState(true);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    const [newAddress, setNewAddress] = useState({
        label: "",
        full_name: "",
        phone: "",
        email: "",
        address_line: "",
        pincode: "",
        country_id: "",
        state_id: "",
        city_id: "",
        area_id: "",
    });

    const toIdOrNull = (value) => {
        if (value === "" || value === null || value === undefined) return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const loadStates = async (countryId) => {
        if (!countryId) {
            setStates([]);
            return;
        }
        const res = await api.get(`/api/master/state/country/${countryId}`);
        setStates(res.data || []);
    };

    const loadCities = async (stateId) => {
        if (!stateId) {
            setCities([]);
            return;
        }
        const res = await api.get(`/api/master/city/state/${stateId}`);
        setCities(res.data || []);
    };

    const loadAreas = async (cityId) => {
        if (!cityId) {
            setAreas([]);
            return;
        }
        const res = await api.get(`/api/master/area/city/${cityId}`);
        setAreas(res.data || []);
    };

    const refreshAddresses = async () => {
        const res = await api.get("/api/user/addresses");
        const list = res.data || [];
        setAddresses(list);
        return list;
    };

    useEffect(() => {
        const load = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const [countriesRes, meRes] = await Promise.all([
                    api.get("/api/master/country"),
                    api.get("/api/user/me"),
                ]);

                setCountries(countriesRes.data || []);

                const me = meRes.data || {};
                const list = await refreshAddresses();
                const defaultAddress = list.find((a) => a.is_default) || list[0];

                if (defaultAddress?.id) {
                    setSelectedAddressId(String(defaultAddress.id));
                    setShowNewAddress(false);
                } else {
                    setShowNewAddress(true);
                }

                const prefill = {
                    label: "",
                    full_name: me.username || "",
                    phone: me.phone || "",
                    email: me.email || "",
                    address_line: "",
                    pincode: "",
                    country_id: me.country_id ? String(me.country_id) : "",
                    state_id: me.state_id ? String(me.state_id) : "",
                    city_id: me.city_id ? String(me.city_id) : "",
                    area_id: me.area_id ? String(me.area_id) : "",
                };
                setNewAddress(prefill);
                setNewIsDefault(list.length === 0);

                if (prefill.country_id) await loadStates(prefill.country_id);
                if (prefill.state_id) await loadCities(prefill.state_id);
                if (prefill.city_id) await loadAreas(prefill.city_id);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedAddress = addresses.find((a) => String(a.id) === String(selectedAddressId));

    const handleNewChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = async (e) => {
        const country_id = e.target.value;
        setNewAddress((prev) => ({
            ...prev,
            country_id,
            state_id: "",
            city_id: "",
            area_id: "",
        }));
        setCities([]);
        setAreas([]);
        await loadStates(country_id);
    };

    const handleStateChange = async (e) => {
        const state_id = e.target.value;
        setNewAddress((prev) => ({
            ...prev,
            state_id,
            city_id: "",
            area_id: "",
        }));
        setAreas([]);
        await loadCities(state_id);
    };

    const handleCityChange = async (e) => {
        const city_id = e.target.value;
        setNewAddress((prev) => ({
            ...prev,
            city_id,
            area_id: "",
        }));
        await loadAreas(city_id);
    };

    const createAddressIfNeeded = async () => {
        if (!showNewAddress) return null;
        setSaving(true);
        try {
            const created = await api.post("/api/user/addresses", {
                label: newAddress.label,
                full_name: newAddress.full_name,
                phone: newAddress.phone,
                email: newAddress.email,
                address_line: newAddress.address_line,
                pincode: newAddress.pincode,
                country_id: toIdOrNull(newAddress.country_id),
                state_id: toIdOrNull(newAddress.state_id),
                city_id: toIdOrNull(newAddress.city_id),
                area_id: toIdOrNull(newAddress.area_id),
                is_default: newIsDefault,
            });

            const createdId = created.data?.id ? String(created.data.id) : null;
            await refreshAddresses();
            if (createdId) setSelectedAddressId(createdId);
            setShowNewAddress(false);
            return createdId;
        } finally {
            setSaving(false);
        }
    };

    const placeOrder = async (finalAddressId) => {
        await api.post("/api/orders/place", {
            address_id: Number(finalAddressId),
            total_amount: totalPrice,
            items: cart.map((c) => ({
                product_id: c.id,
                product_name: c.product_name,
                price: c.price,
                quantity: c.qty,
                image: c.image,
            })),
        });
    };

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow p-6 py-12 flex items-center justify-center">
                <div className="bg-white max-w-lg w-full rounded-3xl shadow-lg p-10">
                    <h1 className="text-2xl font-bold mb-6 text-textmain text-center">Secure Checkout</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Select Address</label>
                            <div className="flex gap-3">
                                <select
                                    value={selectedAddressId}
                                    onChange={(e) => {
                                        setSelectedAddressId(e.target.value);
                                        setShowNewAddress(false);
                                    }}
                                    disabled={loading || addresses.length === 0}
                                    className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                >
                                    {addresses.length === 0 ? (
                                        <option value="">No saved addresses</option>
                                    ) : (
                                        addresses.map((a) => (
                                            <option key={a.id} value={String(a.id)}>
                                                {(a.label ? `${a.label} - ` : "")}{a.address_line}
                                            </option>
                                        ))
                                    )}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setShowNewAddress((v) => !v)}
                                    disabled={loading}
                                    className="px-4 py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 disabled:bg-gray-50"
                                >
                                    {showNewAddress ? "Cancel" : "Add New"}
                                </button>
                            </div>

                            {!showNewAddress && selectedAddress && (
                                <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                                    <div className="font-medium text-gray-800">
                                        {selectedAddress.full_name || "Shipping Address"}{" "}
                                        {selectedAddress.is_default ? "(Default)" : ""}
                                    </div>
                                    <div>{selectedAddress.address_line}</div>
                                    <div>
                                        {[selectedAddress.area_name, selectedAddress.city_name, selectedAddress.state_name, selectedAddress.country_name]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </div>
                                    <div>{selectedAddress.pincode}</div>
                                </div>
                            )}
                        </div>

                        {showNewAddress && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Label (optional)</label>
                                    <input
                                        name="label"
                                        value={newAddress.label}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="Home / Office"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                                    <input
                                        name="full_name"
                                        value={newAddress.full_name}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Phone number</label>
                                    <input
                                        name="phone"
                                        value={newAddress.phone}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="10 digit number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">E-mail Id</label>
                                    <input
                                        name="email"
                                        value={newAddress.email}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="Enter your email id"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Shipping Address</label>
                                    <input
                                        name="address_line"
                                        value={newAddress.address_line}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="123 Main St, City, Country"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Country</label>
                                        <select
                                            name="country_id"
                                            value={newAddress.country_id}
                                            onChange={handleCountryChange}
                                            disabled={loading}
                                            className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        >
                                            <option value="">Select country</option>
                                            {countries.map((c) => (
                                                <option key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">State</label>
                                        <select
                                            name="state_id"
                                            value={newAddress.state_id}
                                            onChange={handleStateChange}
                                            disabled={loading || !newAddress.country_id}
                                            className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        >
                                            <option value="">Select state</option>
                                            {states.map((s) => (
                                                <option key={s.id} value={String(s.id)}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">City</label>
                                        <select
                                            name="city_id"
                                            value={newAddress.city_id}
                                            onChange={handleCityChange}
                                            disabled={loading || !newAddress.state_id}
                                            className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        >
                                            <option value="">Select city</option>
                                            {cities.map((c) => (
                                                <option key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Area</label>
                                        <select
                                            name="area_id"
                                            value={newAddress.area_id}
                                            onChange={handleNewChange}
                                            disabled={loading || !newAddress.city_id}
                                            className="border border-gray-200 rounded-xl px-4 py-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        >
                                            <option value="">Select area</option>
                                            {areas.map((a) => (
                                                <option key={a.id} value={String(a.id)}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Pincode</label>
                                    <input
                                        name="pincode"
                                        value={newAddress.pincode}
                                        onChange={handleNewChange}
                                        disabled={loading}
                                        className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                        placeholder="Enter your pincode number"
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={newIsDefault}
                                        onChange={(e) => setNewIsDefault(e.target.checked)}
                                        disabled={loading}
                                    />
                                    Make this my default address
                                </label>
                            </>
                        )}

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                            <input
                                disabled={loading}
                                className="border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:bg-gray-50"
                                placeholder="XXXX XXXX XXXX XXXX"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={async () => {
                                try {
                                    if (!cart || cart.length === 0) {
                                        alert("Your cart is empty.");
                                        return;
                                    }
                                    const createdId = await createAddressIfNeeded();
                                    const finalAddressId = createdId || selectedAddressId;
                                    if (!finalAddressId) {
                                        alert("Please add/select an address.");
                                        return;
                                    }

                                    setSaving(true);
                                    await placeOrder(finalAddressId);
                                    clearCart();
                                    alert("Order placed successfully!");
                                    navigate("/orders");
                                } catch (e) {
                                    console.error(e);
                                    alert(e.response?.data?.message || "Failed to place order");
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={loading || saving}
                            className="w-full bg-accent text-white py-4 rounded-xl font-medium shadow-md hover:opacity-90 hover:scale-[1.02] transition disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {saving ? "Processing..." : "Complete Order"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
