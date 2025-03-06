<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data)) {
    $name = $data['username'];
    $email = $data['email'];
    $phone = $data['phone'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash password for security
    $address = $data['address'] ?? ''; // Default empty if not provided
    $scheme_id = isset($data['scheme_id']) ? intval($data['scheme_id']) : null;

    if (!$scheme_id) {
        echo json_encode(["status" => "error", "message" => "Scheme ID is required"]);
        exit;
    }

    // Fetch scheme details from scheme_master
    $schemeQuery = "SELECT scheme_name, discount_percentage, discount_applicable_on, 
                    scheme_start_date, scheme_end_date, scheme_min_amount 
                    FROM scheme_master WHERE scheme_id = ?";
    $stmt = $conn->prepare($schemeQuery);
    $stmt->bind_param("i", $scheme_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $schemeData = $result->fetch_assoc();
        $scheme_name = $schemeData['scheme_name'];
        $discount_percentage = $schemeData['discount_percentage'];
        $discount_applicable_on = $schemeData['discount_applicable_on'];
        $start_date = $schemeData['scheme_start_date'];
        $end_date = $schemeData['scheme_end_date'];
        $amount = $schemeData['scheme_min_amount'];

        // Insert into scheme_user table
        $sql = "INSERT INTO scheme_user (name, email, phone, password, address, scheme_id, scheme_name, 
                discount_percentage, discount_applicable_on, start_date, end_date, amount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "sssssisissss",
            $name, $email, $phone, $password, $address,
            $scheme_id, $scheme_name, $discount_percentage,
            $discount_applicable_on, $start_date, $end_date, $amount
        );

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User registered successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid Scheme ID"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}

$conn->close();
?>
