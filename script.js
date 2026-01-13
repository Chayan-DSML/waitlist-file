// Initialize Lucide Icons
lucide.createIcons();

// Configuration
const N8N_WEBHOOK_URL = 'https://chayan-agarwal02.app.n8n.cloud/webhook-test/09ae041a-6461-4234-8ffb-fc93d8ab6959';

// Navigation Logic
function navigateTo(pageId, sectionId = null) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Scroll to top or section
    if (pageId === 'home' && sectionId) {
        // Use timeout to ensure page is visible before scrolling
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 10);
    } else {
        window.scrollTo(0, 0);
    }

    // Update nav emphasis
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add('text-slate-900', 'font-semibold');
        } else {
            link.classList.remove('text-slate-900', 'font-semibold');
        }
    });
}

// Terms Modal Logic
function showTermsModal() {
    document.getElementById('terms-modal').classList.remove('hidden');
}

function hideTermsModal() {
    document.getElementById('terms-modal').classList.add('hidden');
}

// Form Submission Helper
async function submitToWebhook(data) {
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('YOUR_N8N_')) {
        console.warn("Webhook URL not set");
        // Throw error to trigger UI error state if URL is missing
        throw new Error("Webhook URL not configured");
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
                source: 'tourbuk-waitlist-html'
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

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const errorDiv = document.getElementById('contact-error');
        const successDiv = document.getElementById('contact-success');

        // Reset state
        errorDiv.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        const data = {
            type: 'contact_message',
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            await submitToWebhook(data);
            // Success
            contactForm.classList.add('hidden');
            successDiv.classList.remove('hidden');
        } catch (err) {
            // Error
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Send Message';
        }
    });
}

// Waitlist Form Handler
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = waitlistForm.querySelector('button[type="submit"]');
        const errorDiv = document.getElementById('waitlist-error');
        const successDiv = document.getElementById('waitlist-success');

        // Reset state
        errorDiv.classList.add('hidden');
        btn.disabled = true;
        btn.textContent = 'Joining...';

        const formData = new FormData(waitlistForm);
        const data = {
            type: 'waitlist_signup',
            email: formData.get('email')
        };

        try {
            await submitToWebhook(data);
            // Success
            waitlistForm.classList.add('hidden');
            successDiv.classList.remove('hidden');
        } catch (err) {
            // Error
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Join Now';
        }
    });
}
