<?php
require_once 'config.php';

// Check if user is logged in and is admin
if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$currentUser = getCurrentUser();
// Simple admin check
$isAdmin = ($currentUser['email'] === 'admin@m7marketplace.com' || $currentUser['id'] == 1);

if (!$isAdmin) {
    header('Location: home.php');
    exit;
}

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['seller_id'])) {
    $sellerId = intval($_POST['seller_id']);
    
    // Mark as paid in session (you can create a payments table later)
    $_SESSION['paid_' . $sellerId] = 'paid';
    
    // You can also insert into a payments table here
    /*
    $stmt = $pdo->prepare("
        INSERT INTO seller_payments (seller_id, amount, status, paid_at)
        VALUES (?, ?, 'paid', NOW())
    ");
    $stmt->execute([$sellerId, $commissionAmount]);
    */
    
    $_SESSION['success'] = 'Payment marked as paid';
}

// Redirect back to payment tracker
header('Location: payment-tracker.php');
exit;
?>
