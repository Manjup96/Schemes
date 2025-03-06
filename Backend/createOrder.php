<?php
require 'vendor/autoload.php';
use Razorpay\Api\Api;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include "config.php"; // Database connection

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['scheme'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit();
}

$saving_amount = isset($data['saving_amount']) ? (float) $data['saving_amount'] : 0;
$installment_amount = isset($data['installment_amount']) ? (float) $data['installment_amount'] : 0;
$auto_pay = isset($data['auto_pay']) ? (int) $data['auto_pay'] : 0;

$amount = ($saving_amount > 0) ? $saving_amount : $installment_amount;

if ($amount <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid amount."]);
    exit();
}

try {
    $api = new Api("rzp_live_VXenWuBxkeRLy6", "Ggu6AY73axzhQ3JwksCq5cA3");

    $orderData = [
        'amount' => $amount * 100, // Convert to paise
        'currency' => "INR",
        'payment_capture' => 1
    ];

    $razorpayOrder = $api->order->create($orderData);

    echo json_encode([
        "status" => "success",
        "order_id" => $razorpayOrder['id'],
        "amount" => $amount,
        "auto_pay" => $auto_pay
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Order creation failed.", "error" => $e->getMessage()]);
}
?>
