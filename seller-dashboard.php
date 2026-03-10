<?php
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Seller Dashboard - M7 Marketplace</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="M7shooping.css">
    <link rel="icon" type="image/x-icon" href="M7shooping.png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        .dashboard-wrapper {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .welcome-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px;
            border-radius: 40px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .welcome-section::before {
            content: '📦';
            position: absolute;
            font-size: 150px;
            opacity: 0.1;
            bottom: -30px;
            right: -30px;
            transform: rotate(-15deg);
        }
        
        .welcome-text h1 {
            font-size: 42px;
            margin-bottom: 10px;
            color: white;
        }
        
        .welcome-text p {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        
        .logout-btn:hover {
            background: white;
            color: #764ba2;
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            margin-bottom: 50px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 30px;
            border-radius: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #d96565 0%, #4CAF50 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stat-card:hover::before {
            transform: scaleX(1);
        }
        
        .stat-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .stat-label {
            font-size: 16px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        
        .stat-value {
            font-size: 42px;
            font-weight: 800;
            background: linear-gradient(135deg, #fff 0%, #d96565 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2;
        }
        
        .section-title {
            font-size: 32px;
            margin: 50px 0 30px;
            position: relative;
            display: inline-block;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100px;
            height: 4px;
            background: linear-gradient(135deg, #d96565 0%, #4CAF50 100%);
            border-radius: 2px;
        }
        
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-bottom: 50px;
        }
        
        .action-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 35px 25px;
            text-align: center;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .action-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #d96565 0%, #4CAF50 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .action-card:hover {
            transform: translateY(-15px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }
        
        .action-card:hover::before {
            transform: scaleX(1);
        }
        
        .action-icon {
            font-size: 64px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        }
        
        .action-card:hover .action-icon {
            transform: scale(1.1) rotate(5deg);
        }
        
        .action-card h3 {
            color: #d96565;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .action-card p {
            opacity: 0.8;
            font-size: 14px;
            margin: 0;
        }
        
        .recent-products {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            padding: 30px;
            margin-top: 30px;
        }
        
        .recent-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .recent-header h3 {
            color: #d96565;
            font-size: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .view-all {
            color: #d96565;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .view-all:hover {
            color: white;
            text-decoration: underline;
        }
        
        .product-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
        }
        
        .product-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(10px);
            border-color: #d96565;
        }
        
        .product-thumb {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            object-fit: cover;
            border: 2px solid rgba(217, 101, 101, 0.3);
        }
        
        .product-info {
            flex: 1;
        }
        
        .product-info h4 {
            font-size: 18px;
            margin-bottom: 5px;
            color: #d96565;
        }
        
        .product-info p {
            font-size: 14px;
            opacity: 0.8;
        }
        
        .product-price {
            font-weight: 600;
            color: #4CAF50;
            font-size: 16px;
        }
        
        .product-actions {
            display: flex;
            gap: 10px;
        }
        
        .product-btn {
            padding: 8px 15px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }
        
        .product-btn.edit {
            background: #4CAF50;
            color: white;
        }
        
        .product-btn.edit:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        
        .product-btn.delete {
            background: #d96565;
            color: white;
        }
        
        .product-btn.delete:hover {
            background: #b84343;
            transform: translateY(-2px);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 30px;
        }
        
        .empty-icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .empty-state h3 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #d96565;
        }
        
        .empty-state p {
            font-size: 16px;
            opacity: 0.8;
            margin-bottom: 25px;
        }
        
        .empty-btn {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .empty-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(76, 175, 80, 0.4);
        }
        
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .welcome-section {
                flex-direction: column;
                text-align: center;
                gap: 20px;
                padding: 30px;
            }
            
            .quick-actions {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .product-item {
                flex-direction: column;
                text-align: center;
            }
            
            .product-actions {
                justify-content: center;
            }
        }
    </style>
</head>
<body>

<?php
require_once 'config.php';

// Check if user is logged in and is a seller
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$currentUser = getCurrentUser();
if ($currentUser['role'] !== 'seller') {
    header('Location: auth.php');
    exit;
}

// Get seller's store info
$stmt = $pdo->prepare("SELECT * FROM seller_stores WHERE seller_id = ?");
$stmt->execute([$currentUser['id']]);
$store = $stmt->fetch();

// Get seller's products
$stmt = $pdo->prepare("
    SELECT p.*, c.name as category_name, c.icon as category_icon
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
");
$stmt->execute([$currentUser['id']]);
$products = $stmt->fetchAll();

// Calculate stats
$totalProducts = count($products);
$totalStock = 0;
$totalSold = 0;
$totalRevenue = 0;

foreach ($products as $product) {
    $totalStock += $product['quantity'];
    $totalSold += $product['sold'];
    $totalRevenue += $product['sold'] * $product['price'];
}

$commission = round($totalRevenue * 0.1); // 10% commission
$netEarnings = $totalRevenue - $commission;
?>

<?php include 'navbar.php'; ?>

<main>
    <div class="dashboard-wrapper">
        <div id="dashboard-content">
            <div class="welcome-section">
                <div class="welcome-text">
                    <h1>📦 Welcome back, <?php echo htmlspecialchars($store['store_name'] ?? $currentUser['full_name']); ?>!</h1>
                    <p>Manage your products, track sales, and grow your business.</p>
                </div>
                <a href="logout.php" class="logout-btn">🚪 Logout</a>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-label">Total Products</div>
                    <div class="stat-value"><?php echo $totalProducts; ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-label">In Stock</div>
                    <div class="stat-value"><?php echo $totalStock; ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-label">Revenue</div>
                    <div class="stat-value"><?php echo number_format($totalRevenue); ?> DZD</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-label">Items Sold</div>
                    <div class="stat-value"><?php echo $totalSold; ?></div>
                </div>
            </div>
            
            <h2 class="section-title">⚡ Quick Actions</h2>
            
            <div class="quick-actions">
                <a href="seller-add-product.php" class="action-card">
                    <div class="action-icon">➕</div>
                    <h3>Add Product</h3>
                    <p>List a new item for sale</p>
                </a>
                <a href="my-products.php" class="action-card">
                    <div class="action-icon">📋</div>
                    <h3>My Products</h3>
                    <p>View and manage listings</p>
                </a>
                <a href="orders.php" class="action-card">
                    <div class="action-icon">📦</div>
                    <h3>My Orders</h3>
                    <p>View customer orders</p>
                </a>
            </div>
            
            <?php if (count($products) > 0): ?>
            <div class="recent-products">
                <div class="recent-header">
                    <h3>🆕 Recent Products</h3>
                    <a href="my-products.php" class="view-all">View All →</a>
                </div>
                
                <?php 
                $recentProducts = array_slice($products, 0, 5);
                foreach ($recentProducts as $product): 
                ?>
                <div class="product-item">
                    <img src="<?php echo $product['image_url'] ?? 'https://via.placeholder.com/60'; ?>" class="product-thumb" onerror="this.src='https://via.placeholder.com/60'">
                    <div class="product-info">
                        <h4><?php echo htmlspecialchars($product['name']); ?></h4>
                        <p>Stock: <?php echo $product['quantity']; ?> units | Price: <?php echo number_format($product['price']); ?> DZD</p>
                    </div>
                    <div class="product-price"><?php echo number_format($product['price']); ?> DZD</div>
                    <div class="product-actions">
                        <a href="seller-add-product.php?edit=<?php echo $product['id']; ?>" class="product-btn edit">✏️ Edit</a>
                        <a href="delete-product.php?id=<?php echo $product['id']; ?>" class="product-btn delete" onclick="return confirm('Are you sure?')">🗑️</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php else: ?>
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No Products Yet</h3>
                <p>Start selling by adding your first product!</p>
                <a href="seller-add-product.php" class="empty-btn">Add Your First Product</a>
            </div>
            <?php endif; ?>
            
            <!-- Payment Section -->
            <div style="margin-top: 40px; background: rgba(217, 101, 101, 0.1); padding: 30px; border-radius: 20px;">
                <h3 style="color: #d96565; margin-bottom: 20px;">🏦 Payment to M7 Marketplace</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <div>
                        <p><strong>Total Revenue:</strong> <span id="totalRevenue"><?php echo number_format($totalRevenue); ?> DZD</span></p>
                        <p><strong>Commission (10%):</strong> <span id="commissionDue"><?php echo number_format($commission); ?> DZD</span></p>
                        <p><strong>Net Earnings:</strong> <span id="netEarnings"><?php echo number_format($netEarnings); ?> DZD</span></p>
                        <p><strong>Status:</strong> <span style="color: #FF9800;">Pending</span></p>
                    </div>
                    <div style="text-align: right;">
                        <h4 style="color: #4CAF50;">🏦 CCP Account Details</h4>
                        <p><strong>Account:</strong> 88 0042745945</p>
                        <p><strong>Name:</strong> M7 Marketplace</p>
                        <p><strong>Reference:</strong> <span id="sellerRef">M7-<?php echo $currentUser['id']; ?></span></p>
                        <button onclick="showPaymentInstructions()" class="btn btn-sm">View Instructions</button>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button onclick="showCCPPayment()" class="btn" style="background: #4CAF50; padding: 15px 30px;">
                    💳 Pay via CCP Mobile
                </button>
            </div>
            
            <div style="background: rgba(76, 175, 80, 0.1); padding: 30px; border-radius: 20px; margin-top: 30px;">
                <h3 style="color: #4CAF50;">💰 Pay via CCP</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div>
                        <p><strong>Our CCP Account:</strong></p>
                        <p style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; font-family: monospace; font-size: 18px;">
                            0042745945
                        </p>
                        <p><strong>Key:</strong> 88</p>
                    </div>
                    
                    <div>
                        <p><strong>Amount Due:</strong> <span id="commissionAmount"><?php echo number_format($commission); ?> DZD</span></p>
                        <p><strong>Reference:</strong> <span id="paymentRef">M7-<?php echo $currentUser['id']; ?></span></p>
                        
                        <button onclick="calculateAndCopy()" class="btn btn-sm" style="margin-top: 10px;">
                            📋 Copy Payment Details
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
                <a href="https://play.google.com/store/apps/details?id=ru.bpc.mobilebank.bpc" target="_blank" class="btn" style="background: #4CAF50;">
                    📲 Download BaridiMob on Google Play
                </a>
                <a href="https://apps.apple.com/fr/app/baridimob/id1481839638" target="_blank" class="btn" style="background: #4CAF50;">
                    📲 Download BaridiMob on App Store
                </a>
            </div>
        </div>
    </div>
</main>

<footer>
    <p>© 2026 M7 Marketplace. All rights reserved. | <a href="about.php">About</a> | <a href="contact.php">Contact</a> | <a href="#">Terms</a> | <a href="#">Privacy</a></p>
</footer>

<script src="script.js"></script>
</body>
</html>
