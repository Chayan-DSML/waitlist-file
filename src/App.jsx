import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Calendar,
    Users,
    Headphones,
    ArrowRight,
    CheckCircle,
    X,
    Plane,
    FileText,
    Shield,
    Instagram,
    Twitter,
    Facebook,
    Sparkles,
    Zap,
    MessageSquare,
    Mail,
    Send,
    Loader2,
    Briefcase,
    Hammer,
    BookOpen,
    HelpCircle,
    Compass
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    serverTimestamp
} from 'firebase/firestore';
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    signInWithCustomToken
} from 'firebase/auth';

// --- n8n Configuration ---
// REPLACE THIS WITH YOUR ACTUAL N8N WEBHOOK URL
const N8N_WEBHOOK_URL = 'https://chayan-agarwal02.app.n8n.cloud/webhook-test/09ae041a-6461-4234-8ffb-fc93d8ab6959';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(window.__firebase_config || '{}');
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';

let app, auth, db;

try {
    if (firebaseConfig.apiKey) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        console.warn("Firebase configuration missing or incomplete. Some features will be disabled.");
    }
} catch (error) {
    console.error("Failed to initialize Firebase:", error);
}

// --- Updated Logo Component ---
const Logo = () => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105 bg-white shadow-sm">
                {!imgError ? (
                    <img
                        src="/file.png"
                        alt="Tour Bhook Logo"
                        className="w-full h-full object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-teal-600 flex items-center justify-center">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
                Tour <span className="text-teal-600">Bhook</span>
            </span>
        </div>
    );
};

// --- Page Components ---

const AboutPage = () => (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">About Tour Bhook</h1>
        <div className="prose prose-lg prose-slate text-slate-600">
            <p className="lead text-xl mb-6">
                We believe travel should be about the experience, not the stress of planning.
            </p>
            <p className="mb-6">
                Born from a passion for exploration and a frustration with scattered information, Tour Bhook is building the world's most intelligent travel companion. We are a team of travelers, engineers, and dreamers dedicated to solving the complexities of modern travel.
            </p>
            <p className="mb-6">
                Our mission is simple: <strong>Minimize planning time and maximize discovery.</strong> By leveraging advanced AI and community-driven insights, we turn weeks of research into seconds of clarity.
            </p>
            <div className="bg-teal-50 p-8 rounded-2xl border border-teal-100 mt-12">
                <h3 className="text-teal-900 font-bold text-xl mb-4">Our Core Values</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-teal-600" /> <span>Authenticity in every recommendation</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-teal-600" /> <span>Efficiency without compromising spontaneity</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-teal-600" /> <span>Trust through transparency</span></li>
                </ul>
            </div>
        </div>
    </div>
);

const CareersPage = () => (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center animate-fade-in">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Briefcase className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Join Our Team</h1>
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-10 md:p-16">
            <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
                New Job Openings for Freshers and Experienced Coming Soon
            </p>
            <p className="text-slate-500 mt-4">
                We are preparing to scale. Check back later for opportunities to define the future of travel.
            </p>
        </div>
    </div>
);

const ConstructionPage = ({ title, icon: Icon }) => (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center animate-fade-in">
        <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
            {Icon ? <Icon className="w-10 h-10" /> : <Hammer className="w-10 h-10" />}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{title}</h1>
        <div className="inline-block bg-orange-100 text-orange-800 px-6 py-3 rounded-full font-bold text-sm tracking-wide uppercase">
            Under Construction
        </div>
        <p className="text-slate-500 mt-6 max-w-lg mx-auto">
            We're working hard to bring you this resource. Please check back soon for updates.
        </p>
    </div>
);

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [showTerms, setShowTerms] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');

    // Navigation Handler
    const navigateTo = (page, hashId = null) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);

        if (page === 'home' && hashId) {
            setTimeout(() => {
                const element = document.getElementById(hashId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    // Authentication Setup
    useEffect(() => {
        const initAuth = async () => {
            if (!auth) return;
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Auth error:", error);
            }
        };
        initAuth();
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, setUser);
            return () => unsubscribe();
        }
    }, []);

    return (
        <div className="font-['Lexend'] text-slate-800 bg-gray-50 min-h-screen flex flex-col">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

            {/* Navigation */}
            <nav className="w-full py-4 px-4 md:px-12 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-gray-50/90 backdrop-blur-md z-40 border-b border-slate-100/50">
                <button onClick={() => navigateTo('home')} className="hover:opacity-90 transition-opacity">
                    <Logo />
                </button>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
                    <button onClick={() => navigateTo('home')} className={`hover:text-slate-900 transition-colors ${currentPage === 'home' ? 'text-slate-900 font-semibold' : ''}`}>Home</button>
                    <button onClick={() => navigateTo('about')} className={`hover:text-slate-900 transition-colors ${currentPage === 'about' ? 'text-slate-900 font-semibold' : ''}`}>About us</button>
                    <button onClick={() => navigateTo('home', 'services')} className="hover:text-slate-900 transition-colors">Our services</button>
                    <button onClick={() => navigateTo('home', 'contact')} className="hover:text-slate-900 transition-colors">Contact</button>
                    <button onClick={() => navigateTo('home', 'waitlist')} className="px-5 py-2 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/10">Join Waitlist</button>
                </div>
                <button className="md:hidden text-slate-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </nav>

            <main className="flex-grow">
                {currentPage === 'home' && (
                    <>
                        {/* Hero Section */}
                        <div className="px-4 md:px-8 max-w-7xl mx-auto mb-20 pt-6">
                            <div className="relative rounded-[2.5rem] overflow-hidden h-[500px] md:h-[600px] shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2838&auto=format&fit=crop"
                                    alt="Bali Temple"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl text-white">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 w-fit border border-white/20">
                                        <Sparkles className="w-3 h-3 text-teal-300" /> AI-Optimized Travel
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                        Tour Bhook: The Smart Way to <span className="text-teal-300">Explore the World</span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                                        Minimize planning time and maximize discovery. We use intelligent routing to build your perfect journey.
                                    </p>
                                    <div>
                                        <button
                                            onClick={() => navigateTo('home', 'waitlist')}
                                            className="bg-white text-slate-900 hover:bg-teal-50 px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 group"
                                        >
                                            Start Planning
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="max-w-4xl mx-auto px-6 mb-24 text-center">
                            <div className="text-teal-600 font-semibold tracking-wide uppercase text-sm mb-2">The Tour Bhook Promise</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">Travel Smarter, Not Harder</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6">
                                    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">~30%</div>
                                    <div className="text-slate-500">Travel Time Saved</div>
                                </div>
                                <div className="p-6 border-y md:border-y-0 md:border-x border-slate-200">
                                    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Zero</div>
                                    <div className="text-slate-500">Information Noise</div>
                                </div>
                                <div className="p-6">
                                    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">100%</div>
                                    <div className="text-slate-500">Personalized for You</div>
                                </div>
                            </div>
                        </div>

                        <div id="services" className="bg-white py-20">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Intelligent Travel Planning</h2>
                                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                                        We've solved the biggest travel headaches—inefficient routes and unreliable info.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    <div className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Route Optimization</h3>
                                        <p className="text-slate-500 leading-relaxed px-4">
                                            Our engine calculates the most time-efficient path for your trip, saving you hours.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Review Summaries</h3>
                                        <p className="text-slate-500 leading-relaxed px-4">
                                            We provide a single, concise AI summary of what matters most about every location.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <Shield className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted Content Only</h3>
                                        <p className="text-slate-500 leading-relaxed px-4">
                                            Our strict zero-tolerance moderation ensures you only see authentic recommendations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
                            <WaitlistForm user={user} />
                        </div>

                        <ContactSection user={user} />
                    </>
                )}

                {currentPage === 'about' && <AboutPage />}
                {currentPage === 'careers' && <CareersPage />}
                {currentPage === 'blog' && <ConstructionPage title="Blog" icon={FileText} />}
                {currentPage === 'guides' && <ConstructionPage title="Travel Guides" icon={BookOpen} />}
                {currentPage === 'help' && <ConstructionPage title="Help Center" icon={HelpCircle} />}
            </main>

            <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <button onClick={() => navigateTo('home')} className="mb-4 hover:opacity-90 transition-opacity">
                                <Logo />
                            </button>
                            <p className="text-slate-500 text-sm">
                                Revolutionizing travel with AI-driven efficiency.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><button onClick={() => navigateTo('about')} className="hover:text-teal-600">About Us</button></li>
                                <li><button onClick={() => navigateTo('careers')} className="hover:text-teal-600">Careers</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><button onClick={() => navigateTo('blog')} className="hover:text-teal-600">Blog</button></li>
                                <li><button onClick={() => navigateTo('help')} className="hover:text-teal-600">Help Center</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Follow Us</h4>
                            <div className="flex justify-center md:justify-start space-x-4">
                                <a href="#" className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors"><Instagram size={16} /></a>
                                <a href="#" className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors"><Twitter size={16} /></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <p>© 2026 Tour Bhook Inc.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <button onClick={() => setShowTerms(true)} className="hover:text-slate-900">Terms</button>
                            <button className="hover:text-slate-900">Privacy</button>
                        </div>
                    </div>
                </div>
            </footer>

            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Terms and Conditions</h3>
                            <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="prose prose-sm prose-slate">
                                <p>By using Tour Bhook, you agree to our terms of service regarding travel planning and data usage.</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 text-right">
                            <button onClick={() => setShowTerms(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Helper: Submit to Webhook ---
async function submitToWebhook(data) {
    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL') {
        console.warn("n8n Webhook URL is not set. Submitting to console:", data);
        return; // Simulate success for demo purposes
    }

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'tourbuk-waitlist'
            }),
        });

        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Submission error:", error);
        throw error;
    }
}

function ContactSection({ user }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) return;

        setStatus('loading');
        try {
            await submitToWebhook({
                type: 'contact_message',
                ...formData
            });
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-20 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16">
                    <div className="md:w-5/12 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Get in touch</h2>
                        <p className="text-slate-500 mb-8">Have questions? We'd love to hear from you.</p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <Mail className="text-teal-600" />
                            <span className="text-slate-700">hello.tourbhook@gmail.com</span>
                        </div>
                    </div>
                    <div className="md:w-7/12">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-slate-100">
                            {status === 'success' ? (
                                <div className="text-center py-12"><h3 className="text-xl font-bold">Message Sent!</h3></div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg border" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <textarea placeholder="Message" rows="4" className="w-full px-4 py-3 rounded-lg border" required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">Send Message</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function WaitlistForm({ user }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            await submitToWebhook({
                type: 'waitlist_signup',
                email
            });
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div id="waitlist" className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Join the Waitlist</h2>
                <p className="text-slate-500 mb-8">Be the first to experience the future of travel.</p>
                {status === 'success' ? (
                    <p className="text-teal-600 font-bold text-xl">You're on the list!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                        <input type="email" placeholder="Email address" className="flex-grow px-6 py-4 rounded-xl bg-gray-50 border" required value={email} onChange={e => setEmail(e.target.value)} />
                        <button type="submit" className="bg-teal-600 text-white font-bold px-8 py-4 rounded-xl">Join Now</button>
                    </form>
                )}
            </div>
        </div>
    );
}