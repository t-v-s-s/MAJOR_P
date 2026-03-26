import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        country_id: "",
        state_id: "",
        city_id: "",
        area_id: ""
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);

    // Fetch countries
    useEffect(() => {
        fetch("http://localhost:3000/api/master/country")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setFormData({ ...formData, country_id: selectedCountry, state_id: "", city_id: "", area_id: "" });
        setCities([]);
        setAreas([]);
        if (selectedCountry) {
            fetch(`http://localhost:3000/api/master/state/country/${selectedCountry}`)
                .then(res => res.json())
                .then(data => setStates(data))
                .catch(err => console.error(err));
        } else {
            setStates([]);
        }
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, state_id: selectedState, city_id: "", area_id: "" });
        setAreas([]);
        if (selectedState) {
            fetch(`http://localhost:3000/api/master/city/state/${selectedState}`)
                .then(res => res.json())
                .then(data => setCities(data))
                .catch(err => console.error(err));
        } else {
            setCities([]);
        }
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData({ ...formData, city_id: selectedCity, area_id: "" });
        if (selectedCity) {
            fetch(`http://localhost:3000/api/master/area/city/${selectedCity}`)
                .then(res => res.json())
                .then(data => setAreas(data))
                .catch(err => console.error(err));
        } else {
            setAreas([]);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/login");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Register Error:", error);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Register</h2>
                <input name="username" placeholder="Username" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="phone" type="tel" placeholder="Phone" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

                {/* Country Dropdown */}
                <select name="country_id" onChange={handleCountryChange} value={formData.country_id} required>
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {/* State Dropdown */}
                <select name="state_id" onChange={handleStateChange} value={formData.state_id} required>
                    <option value="">Select State</option>
                    {states.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                {/* City Dropdown */}
                <select name="city_id" onChange={handleCityChange} value={formData.city_id} required>
                    <option value="">Select City</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {/* Area Dropdown */}
                <select name="area_id" onChange={handleChange} value={formData.area_id} required>
                    <option value="">Select Area</option>
                    {areas.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>

                <button className="btn" onClick={handleRegister}>Register</button>

                <p>
                    Already have an account?
                    <span onClick={() => navigate("/login")}>
                        {" "}Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;