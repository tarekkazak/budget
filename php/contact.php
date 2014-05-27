<?php
require_once('../PHPMailer/class.phpmailer.php');
$data = json_decode(file_get_contents("php://input"));
$email = "";
$body = $data->report;

$mail = new PHPMailer(); // defaults to using php "mail()"

$mail->SetFrom($email, "Budget App");
$mail->IsHTML(true);
$mail->AddAddress("ikram.oulmi@gmail.com", "Budget Report");
$mail->AddAddress("tarek.kazak@gmail.com", "Budget Report");

$mail->Subject = $subject;
$mail->Body = $body;


if(!$mail->Send()) {
  echo "Your message was not sent successfully. Please try again later.";

} else {
  echo "Your message was sent successfully.";
}

?>
