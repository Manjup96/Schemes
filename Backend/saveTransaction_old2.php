
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php"; // Database connection

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->scheme) && isset($data->saving_amount)) {
    $user_id = $data->user_id;
    $scheme = $data->scheme;
    $saving_amount = $data->saving_amount;

    // ✅ Modified SQL query to exclude removed columns
    $query = "INSERT INTO transactions (user_id, scheme, saving_amount, created_at) 
              VALUES (?, ?, ?, NOW())";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("isd", $user_id, $scheme, $saving_amount);

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
