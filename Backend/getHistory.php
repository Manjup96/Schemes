<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['user_id'])) {
    $user_id = intval($data['user_id']);

    $query = "SELECT id, scheme, order_id, payment_id, saving_amount, installment_amount, created_at FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    if (count($transactions) > 0) {
        echo json_encode(["status" => "success", "transactions" => $transactions]);
    } else {
        echo json_encode(["status" => "success", "transactions" => []]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}

$conn->close();
?>
