<?php
require 'vendor/autoload.php';
use Razorpay\Api\Api;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include "config.php"; // Database connection

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->razorpay_payment_id, $data->razorpay_order_id, $data->razorpay_signature, $data->user_id, $data->scheme)) {
    echo json_encode(["status" => "error", "message" => "Invalid payment data"]);
    exit();
}

try {
    $api = new Api("rzp_live_VXenWuBxkeRLy6", "Ggu6AY73axzhQ3JwksCq5cA3");
    $attributes = [
        'razorpay_order_id' => $data->razorpay_order_id,
        'razorpay_payment_id' => $data->razorpay_payment_id,
        'razorpay_signature' => $data->razorpay_signature
    ];

    $api->utility->verifyPaymentSignature($attributes);

    $user_id = (int) $data->user_id;
    $scheme = trim($data->scheme);
    $saving_amount = isset($data->saving_amount) ? (float) $data->saving_amount : 0;
    $installment_amount = isset($data->installment_amount) ? (float) $data->installment_amount : 0;
    $auto_pay = isset($data->auto_pay) ? (int) $data->auto_pay : 0;
    $payment_id = trim($data->razorpay_payment_id);
    $order_id = trim($data->razorpay_order_id);

    $query = "INSERT INTO transactions (user_id, scheme, saving_amount, installment_amount, payment_id, order_id, auto_pay, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("isddssi", $user_id, $scheme, $saving_amount, $installment_amount, $payment_id, $order_id, $auto_pay);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Payment verified and transaction saved"]);

        if ($auto_pay) {
            scheduleAutoPayments($conn, $user_id, $scheme, $installment_amount);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Database Insert Failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Payment verification failed", "error" => $e->getMessage()]);
}

function scheduleAutoPayments($conn, $user_id, $scheme, $installment_amount) {
    $start_date = date("Y-m-d");
    for ($i = 1; $i <= 10; $i++) {
        $next_payment_date = date("Y-m-d", strtotime("+$i month", strtotime($start_date)));
        $query = "INSERT INTO transactions (user_id, scheme, installment_amount, auto_pay, next_payment_date, created_at) 
                  VALUES (?, ?, ?, 1, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("isds", $user_id, $scheme, $installment_amount, $next_payment_date);
        $stmt->execute();
        $stmt->close();
    }
}
?>
