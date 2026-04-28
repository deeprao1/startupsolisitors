<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// Include PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer-FE_v4.11/src/Exception.php';
require __DIR__ . '/PHPMailer-FE_v4.11/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-FE_v4.11/src/SMTP.php';

// === SMTP CONFIGURATION ===
// Replace these with your actual SMTP settings
$smtpHost   = 'mail.startupsolicitors.com.';          // usually mail.yourdomain.com
$smtpUser   = 'info@startupsolicitors.com';       // full email address
$smtpPass   = '^lWcfq7GYDaE';           // password of that email
$smtpPort   = 465;                             // or 465 if using SSL
$smtpSecure = PHPMailer::ENCRYPTION_SMTPS;

// Email where you want to receive messages
$recipientEmail = 'info@startupsolicitors.com';
$recipientName = 'Startup Solicitors';

// === VALIDATE REQUEST METHOD ===
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit;
}

// === COLLECT AND SANITIZE FORM DATA ===
$name            = trim($_POST['name'] ?? '');
$email           = trim($_POST['email'] ?? '');
$phone           = trim($_POST['phone'] ?? '');
$message         = trim($_POST['message'] ?? '');
$countryCode     = trim($_POST['country_code'] ?? '');
$countryName     = trim($_POST['country_name'] ?? '');
$whatsappConsent = trim($_POST['whatsapp_consent'] ?? 'No');

// === VALIDATE REQUIRED FIELDS ===
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
}

if (empty($email)) {
    $errors[] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required.';
}

// Check for obvious spam patterns
if (
    preg_match('/\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i', $name . ' ' . $message) ||
    substr_count($message, 'http') > 2 ||
    strlen($message) > 2000
) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Message appears to be spam. Please contact us directly.'
    ]);
    exit;
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// === PREPARE EMAIL CONTENT ===
$subject = htmlspecialchars($name) . ' requested a consultation on Startup Solicitors LLP';

$htmlBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>New Contact Form Submission</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;'>
        <h2 style='color: #030917; border-bottom: 2px solid #030917; padding-bottom: 10px;'>
            New Contact Form Submission
        </h2>
        
        <div style='background: white; padding: 20px; border-radius: 6px; margin: 20px 0;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; font-weight: bold; width: 150px;'>Name:</td>
                    <td style='padding: 8px 0;'>" . htmlspecialchars($name) . "</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; font-weight: bold;'>Email:</td>
                    <td style='padding: 8px 0;'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></td>
                </tr>
                " . (!empty($countryName) ? "
                <tr>
                    <td style='padding: 8px 0; font-weight: bold;'>Country:</td>
                    <td style='padding: 8px 0;'>" . htmlspecialchars($countryName) . " " . (!empty($countryCode) ? "(" . htmlspecialchars($countryCode) . ")" : "") . "</td>
                </tr>
                " : "") . "
                " . (!empty($phone) ? "
                <tr>
                    <td style='padding: 8px 0; font-weight: bold;'>Phone:</td>
                    <td style='padding: 8px 0;'><a href='tel:" . htmlspecialchars($countryCode . $phone) . "'>" . htmlspecialchars($countryCode . " " . $phone) . "</a></td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; font-weight: bold;'>WhatsApp Contact:</td>
                    <td style='padding: 8px 0;'>
                        <span style='display: inline-block; padding: 4px 12px; border-radius: 4px; background: " . ($whatsappConsent === 'Yes' ? '#25D366' : '#ccc') . "; color: white; font-weight: bold;'>
                            " . htmlspecialchars($whatsappConsent) . "
                        </span>
                    </td>
                </tr>
                " : "") . "
            </table>
        </div>
        
        " . (!empty($message) ? "
        <div style='background: white; padding: 20px; border-radius: 6px;'>
            <h3 style='margin-top: 0; color: #030917;'>Message:</h3>
            <p style='white-space: pre-wrap; margin: 0;'>" . htmlspecialchars($message) . "</p>
        </div>
        " : "") . "
        
        <div style='margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 6px; font-size: 0.9em; color: #666;'>
            <strong>Submission Details:</strong><br>
            Date: " . date('Y-m-d H:i:s') . "<br>
            IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "<br>
            User Agent: " . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
        </div>
    </div>
</body>
</html>
";

$textBody = "New Contact Form Submission\n\n" .
    "Name: " . $name . "\n" .
    "Email: " . $email . "\n" .
    (!empty($countryName) ? "Country: " . $countryName . " (" . $countryCode . ")\n" : "") .
    (!empty($phone) ? "Phone: " . $countryCode . " " . $phone . "\n" : "") .
    "WhatsApp Contact: " . $whatsappConsent . "\n" .
    "\n" .
    (!empty($message) ? "Message:\n" . $message . "\n\n" : "") .
    "---\n" .
    "Submitted: " . date('Y-m-d H:i:s') . "\n" .
    "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown');

// === SEND EMAIL ===
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;
    
    // Enable verbose debug output (remove in production)
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    
    // Recipients
    $mail->setFrom($smtpUser, htmlspecialchars($name));
    $mail->addAddress($recipientEmail, $recipientName);
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = $textBody;
    
    // Send the email
    $mail->send();
    
    // Log successful submission (optional)
    error_log("Contact form submission from: $name ($email) - Country: $countryName - WhatsApp: $whatsappConsent");
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for your message! We will get back to you soon.'
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log("Contact form error: " . $mail->ErrorInfo);
    
    // Return error response (don't expose internal details)
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    ]);
}
?>