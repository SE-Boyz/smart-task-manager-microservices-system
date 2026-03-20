import React, { useState } from 'react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin);
    };

    return (
        <div className="bg-[#f0f2f5] min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary/20">
            <main className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                {/* Left Panel: Brand & Visuals */}
                <section className="md:w-[45%] auth-mesh p-10 md:p-16 flex flex-col justify-between relative overflow-hidden text-white m-4 rounded-[2rem]">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-12">
                            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                emergency
                            </span>
                        </div>
                        <div className="space-y-6">
                            <p className="text-sm font-semibold tracking-widest uppercase opacity-80">You can easily</p>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                Get access your personal hub for clarity and productivity
                            </h2>
                        </div>
                    </div>
                    {/* Subtle background decoration */}
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
                </section>

                {/* Right Panel: Form Area */}
                <section className="flex-1 p-10 md:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center md:text-left">
                            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-6">
                                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    emergency
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
                                {isLogin ? 'Welcome back' : 'Create an account'}
                            </h1>
                            <p className="text-secondary text-sm leading-relaxed">
                                Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            {/* Name Input - Only for Sign Up */}
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-on-surface" htmlFor="name">Full name</label>
                                    <input
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                        id="name"
                                        placeholder="John Doe"
                                        type="text"
                                    />
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-on-surface" htmlFor="email">Your email</label>
                                <input
                                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                    id="email"
                                    placeholder="farazhaidet786@gmail.com"
                                    type="email"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-on-surface" htmlFor="password">Password</label>
                                    {isLogin && (
                                        <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-3.5 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                                        id="password"
                                        type="password"
                                        placeholder="••••••••••••"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>

                            {/* Primary Action */}
                            <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 text-sm">
                                {isLogin ? 'Sign In' : 'Get Started'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-outline-variant/20"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-4 text-outline font-medium">or continue with</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex items-center justify-center py-2.5 bg-surface-container rounded-xl hover:bg-surface-variant transition-colors border border-outline-variant/10 group">
                                <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.132,0-5.682-2.55-5.682-5.682s2.55-5.682,5.682-5.682c1.359,0,2.611,0.48,3.585,1.277l2.824-2.825C17.398,3.252,15.11,2.052,12.545,2.052c-5.491,0-9.948,4.456-9.948,9.948s4.456,9.948,9.948,9.948c5.258,0,9.948-3.791,9.948-9.948c0-0.662-0.081-1.298-0.226-1.913H12.545z" fill="currentColor"></path>
                                </svg>
                            </button>
                            <button className="flex items-center justify-center py-2.5 bg-surface-container rounded-xl hover:bg-surface-variant transition-colors border border-outline-variant/10 group">
                                <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                                </svg>
                            </button>
                            <button className="flex items-center justify-center py-2.5 bg-surface-container rounded-xl hover:bg-surface-variant transition-colors border border-outline-variant/10 group">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Footer Link */}
                        <div className="mt-10 text-center">
                            <p className="text-secondary text-sm font-medium">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button className="text-primary font-bold hover:underline ml-1" onClick={toggleAuthMode}>
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Footer */}
            <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 items-center gap-6 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-white/20 shadow-sm hidden md:flex">
                <div className="flex items-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Shell</span>
                </div>
                <div className="w-[1px] h-3 bg-outline-variant/30"></div>
                <div className="flex items-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-[16px]">language</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Privacy First</span>
                </div>
                <div className="w-[1px] h-3 bg-outline-variant/30"></div>
                <div className="flex items-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
                </div>
            </footer>
        </div>
    );
};

export default Auth;
