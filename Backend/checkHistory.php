<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php"; // Database connection

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id)) {
    $user_id = $data->user_id;

    // ✅ Fetch latest installment amount if exists
    $query = "SELECT installment_amount FROM transactions 
              WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $last_installment = null;
    if ($row = $result->fetch_assoc()) {
        $last_installment = $row['installment_amount'];
    }

    echo json_encode([
        "status" => "success",
        "hasTransactions" => $last_installment !== null,
        "last_installment_amount" => $last_installment
    ]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid user ID"]);
}
?>
