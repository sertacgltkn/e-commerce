import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login - in a real app this would validate against a backend
        login(email, email.split('@')[0]);
        navigate('/');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border">
            <h2 className="text-3xl font-display font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full btn-primary">
                    Sign In
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
};
