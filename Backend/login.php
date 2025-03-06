<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data)) {
    $identifier = $data['identifier']; // Can be email or phone

    // ✅ Check if user exists with email OR phone
    $sql = "SELECT * FROM scheme_user WHERE email = '$identifier' OR phone = '$identifier'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // ✅ Login Successful (No Password Needed)
        echo json_encode(["status" => "success", "message" => "Login successful", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>
