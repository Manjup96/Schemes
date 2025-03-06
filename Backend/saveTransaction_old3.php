<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php"; // Database connection

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->scheme)) {
    $user_id = $data->user_id;
    $scheme = $data->scheme;
    $saving_amount = isset($data->saving_amount) ? $data->saving_amount : null;
    $installment_amount = isset($data->installment_amount) ? $data->installment_amount : null;

    // ✅ Updated SQL query to include installment_amount
    $query = "INSERT INTO transactions (user_id, scheme, saving_amount, installment_amount, created_at) 
              VALUES (?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("isdd", $user_id, $scheme, $saving_amount, $installment_amount);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Transaction saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save transaction"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
?>
