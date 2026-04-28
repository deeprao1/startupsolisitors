<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__.'/PHPMailer-FE_v4.11/src/PHPMailer.php';
require __DIR__.'/PHPMailer-FE_v4.11/src/SMTP.php';
require __DIR__.'/PHPMailer-FE_v4.11/src/Exception.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'server68.hostingraja.org'; // your hosting SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@startupsolicitors.com'; // your webmail
    $mail->Password   = '^lWcfq7GYDaE';     // mailbox password
    $mail->SMTPSecure =  PHPMailer::ENCRYPTION_SMTPS; // TLS encryption
    $mail->Port       = 465;                           // TLS port

    $mail->setFrom('info@startupsolicitors.com', 'Startup Solicitors'); // sender
    $mail->addAddress('recipient@example.com'); // replace with your receiving email

    $mail->Subject = 'Contact Form Submission';
    $mail->Body    = 'This is a test email from PHPMailer using info@startupsolicitors.com';

    $mail->send();
    echo 'Mail sent successfully';
} catch (Exception $e) {
    echo "Mailer Error: " . $mail->ErrorInfo;
}
