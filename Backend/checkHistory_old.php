<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['user_id'])) {
    $user_id = intval($data['user_id']);

    $query = "SELECT COUNT(*) as count FROM transactions WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result['count'] > 0) {
        echo json_encode(["status" => "success", "hasTransactions" => true]);
    } else {
        echo json_encode(["status" => "success", "hasTransactions" => false]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}

$conn->close();
?>
