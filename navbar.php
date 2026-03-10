<?php
$currentUser = getCurrentUser();
?>

<header>
    <div class="logo">
        <img src="M7shooping.png" alt="M7 Shopping Logo" class="logo-img">
        <span class="logo-text">M7 Marketplace</span>
    </div>
    <nav>
        <ul>
            <li><a href="home.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'home.php' ? 'active' : ''; ?>">🏠 Home</a></li>
            <li><a href="products.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'products.php' ? 'active' : ''; ?>">🛍️ Products</a></li>
            <li><a href="cart.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'cart.php' ? 'active' : ''; ?>">🛒 Cart</a></li>
            <li><a href="about.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'about.php' ? 'active' : ''; ?>">📖 About</a></li>
            <li><a href="contact.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'contact.php' ? 'active' : ''; ?>">📞 Contact</a></li>
            
            <?php if ($currentUser): ?>
                <?php if ($currentUser['role'] === 'seller'): ?>
                    <li><a href="seller-dashboard.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'seller-dashboard.php' ? 'active' : ''; ?>">📊 Dashboard</a></li>
                <?php endif; ?>
                <?php if ($currentUser['role'] === 'admin'): ?>
                    <li><a href="admin-panel.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'admin-panel.php' ? 'active' : ''; ?>">⚙️ Admin</a></li>
                <?php endif; ?>
                <li><a href="auth.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'auth.php' ? 'active' : ''; ?>">👤 <?php echo htmlspecialchars(explode(' ', $currentUser['full_name'])[0]); ?></a></li>
                <li><a href="logout.php">🚪</a></li>
            <?php else: ?>
                <li><a href="login.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'login.php' ? 'active' : ''; ?>">🔐 Login</a></li>
                <li><a href="register.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'register.php' ? 'active' : ''; ?>">📝 Register</a></li>
            <?php endif; ?>
        </ul>
    </nav>
</header>
