<?php
require 'vendor/autoload.php';
use Razorpay\Api\Api;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include "config.php"; // Database connection

// ✅ Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Read the incoming JSON request
$data = json_decode(file_get_contents("php://input"));

// ✅ Validate Required Data
if (!isset($data->razorpay_payment_id, $data->razorpay_order_id, $data->razorpay_signature, $data->user_id, $data->scheme)) {
    echo json_encode(["status" => "error", "message" => "Invalid payment data"]);
    exit();
}

try {
    // Live mode
    $api_key = "rzp_live_VXenWuBxkeRLy6";
    $api_secret = "Ggu6AY73axzhQ3JwksCq5cA3";


      //Test mode
    // $api_key = "rzp_test_FSa026vTg99oIr";
    // $api_secret = "LMlApmUy3HJD4v9VnokpFMZT";

    $api = new Api($api_key, $api_secret);
    $attributes = [
        'razorpay_order_id' => $data->razorpay_order_id,
        'razorpay_payment_id' => $data->razorpay_payment_id,
        'razorpay_signature' => $data->razorpay_signature
    ];

    // ✅ Verify Payment Signature
    $api->utility->verifyPaymentSignature($attributes);

    // ✅ Sanitize and Assign Variables
    $user_id = (int) $data->user_id;
    $scheme = trim($data->scheme);
    $saving_amount = isset($data->saving_amount) ? (float) $data->saving_amount : 0;
    $installment_amount = isset($data->installment_amount) ? (float) $data->installment_amount : 0;
    $payment_id = trim($data->razorpay_payment_id);
    $order_id = trim($data->razorpay_order_id);

    // ✅ Log received data for debugging
    file_put_contents("payment_log.txt", json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL, FILE_APPEND);

    // ✅ Ensure database connection is active
    if (!$conn) {
        die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]));
    }

    // ✅ Insert Data into transactions table
    $query = "INSERT INTO transactions (user_id, scheme, saving_amount, installment_amount, payment_id, order_id, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "SQL Prepare Failed: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("isddss", $user_id, $scheme, $saving_amount, $installment_amount, $payment_id, $order_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Payment verified and transaction saved"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database Insert Failed: " . $stmt->error]);
    }

    // ✅ Close Database Connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Payment verification failed", "error" => $e->getMessage()]);
}
?>
