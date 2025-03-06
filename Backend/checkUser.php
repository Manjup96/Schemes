<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';


// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['mobile'])) {
    $mobile = $data['mobile'];

    // Check if mobile number exists
    $sql = "SELECT name, email FROM scheme_user WHERE phone = '$mobile'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(["status" => "success", "name" => $user['name'], "email" => $user['email']]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>