import { useState } from 'react';

const universityOptions = ['Harvard', 'MIT', 'Stanford'];
const majorOptions = ['Computer Science', 'Biology', 'Economics'];
const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

export default function RegistrationForm() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        countryCode: '+1',
        email: '',
        password: '',
        university: '',
        major: '',
        year: '',
        avatar: '',
        bio: '',
        subscription_tier: '',
        stats: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validatePhone = (phone: string) => {
        // Example: country code + digits, basic validation
        return /^\+\d{1,3}\d{7,15}$/.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        // Compose full phone number
        const fullPhone = form.countryCode + form.phone;

        if (!validatePhone(fullPhone)) {
            setError('Invalid phone format (country code + number)');
            return;
        }
        if (!form.university || !form.major || !form.year) {
            setError('University, Major, and Year are required');
            return;
        }

        // Submit to API
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                phone: fullPhone,
                stats: form.stats ? JSON.parse(form.stats) : null,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'Signup failed');
        } else {
            setSuccess('Signup successful! Please check your email to confirm.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white rounded shadow space-y-6">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <input name="name" value={form.name} onChange={handleChange} required
                className="border p-2 w-full" placeholder="Full Name" />

            <div className="flex gap-2">
                <select name="countryCode" value={form.countryCode} onChange={handleChange} required
                    className="border p-2 w-1/3">
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                    {/* Add more as needed */}
                </select>
                <input name="phone" value={form.phone} onChange={handleChange} required
                    className="border p-2 w-2/3" placeholder="Phone Number" />
            </div>

            <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="border p-2 w-full" placeholder="Email" />
            <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="border p-2 w-full" placeholder="Password" />

            <select name="university" value={form.university} onChange={handleChange} required
                className="border p-2 w-full">
                <option value="">Select University</option>
                {universityOptions.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select name="major" value={form.major} onChange={handleChange} required
                className="border p-2 w-full">
                <option value="">Select Major</option>
                {majorOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select name="year" value={form.year} onChange={handleChange} required
                className="border p-2 w-full">
                <option value="">Select Year</option>
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <input name="avatar" value={form.avatar} onChange={handleChange}
                className="border p-2 w-full" placeholder="Avatar URL (optional)" />
            <textarea name="bio" value={form.bio} onChange={handleChange}
                className="border p-2 w-full" placeholder="Bio (optional)" />
            <input name="subscription_tier" value={form.subscription_tier} onChange={handleChange}
                className="border p-2 w-full" placeholder="Subscription Tier (optional)" />
            <input name="stats" value={form.stats} onChange={handleChange}
                className="border p-2 w-full" placeholder='Stats (JSON, optional)' />

            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Sign Up</button>
        </form>
    );
}