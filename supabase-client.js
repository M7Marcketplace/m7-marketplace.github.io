// supabase-client.js
// M7 Marketplace - Supabase Client Configuration

// Your Supabase credentials
const SUPABASE_URL = 'https://grqgypzdghmpzznzqjhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWd5cHpkZ2htcHp6bnpxamhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTIyNDAsImV4cCI6MjA4ODMyODI0MH0.erUqVwXwFiu0PHc_Gda9hcMjuIh7X1oy1REBKv-p2vs';

// Initialize Supabase client
let supabase;

// Function to initialize Supabase
function initSupabase() {
    if (!window.supabase) {
        console.error('❌ Supabase library not loaded!');
        return null;
    }
    
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });
    
    console.log('✅ Supabase client initialized successfully');
    return supabase;
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase
    window.supabaseClient = initSupabase();
    
    // Check current user on page load
    checkUser();
});

// Check current user and update UI
async function checkUser() {
    if (!supabase) return;
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
            // Get user profile from profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!profileError && profile) {
                // Store in localStorage for backward compatibility
                localStorage.setItem('currentUser', JSON.stringify(profile));
                console.log('👤 Logged in as:', profile.full_name);
            }
        } else {
            localStorage.removeItem('currentUser');
            console.log('👤 Not logged in');
        }
        
        // Update navbar
        if (typeof updateNavbarForUser === 'function') {
            updateNavbarForUser();
        }
        
    } catch (error) {
        console.error('Error checking user:', error);
    }
}

// Logout function
async function logout() {
    if (!supabase) return;
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        localStorage.removeItem('currentUser');
        showNotification('👋 Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('❌ Error logging out', 'error');
    }
}

// Show notification (reuse your existing function or create this one)
function showNotification(message, type = 'info') {
    // Use your existing showNotification function if it exists
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    alert(message);
}

// Make functions globally available
window.checkUser = checkUser;
window.logout = logout;
