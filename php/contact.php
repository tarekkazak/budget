<?php
require_once('../PHPMailer/class.phpmailer.php');
$data = json_decode(file_get_contents("php://input"));
$email = "budgetapp@gmail.com";
$body = $data->report;

$mail = new PHPMailer(); // defaults to using php "mail()"
$mail->IsSMTP();
$mail->SMTPDebug = 1;
$mail->SMTPAuth = true;
$mail->SMTPsecure = 'ssl';
$mail->Host = "smtp.gmail.com";
$mail->Port = 465;
$mail->Username = "tarek.kazak@gmail.com";
$mail->Password = "0510trickitty1005";
$mail->SetFrom($email, "Budget App");
$mail->IsHTML(true);
$mail->AddAddress("ikram.oulmi@gmail.com", "Budget Report");
$mail->AddAddress("tarek.kazak@gmail.com", "Budget Report");

$mail->Subject = "Your budget report";
$mail->Body = $body;


if(!$mail->Send()) {
  echo $mail->ErrorInfo."Your message was not sent successfully. Please try again later.";

} else {
  echo "Your message was sent successfully.";
}

?>
