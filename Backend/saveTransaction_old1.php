<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id, $data->scheme, $data->saving_amount, $data->transaction_id)) {
    $user_id = $data->user_id;
    $scheme = $data->scheme;
    $saving_amount = $data->saving_amount;
    $transaction_id = $data->transaction_id;

    $query = "INSERT INTO transactions (user_id, scheme, saving_amount, transaction_id, created_at) 
              VALUES (?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("isss", $user_id, $scheme, $saving_amount, $transaction_id);

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
