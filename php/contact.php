<?php
require_once('../PHPMailer/class.phpmailer.php');
$data = json_decode(file_get_contents("php://input"));
$email = "budgetapp@gmail.com";
$body = $data->report;

$mail = new PHPMailer(); // defaults to using php "mail()"
$mail->IsSMTP(); // telling the class to use SMTP
$mail->Host       = "mail.yourdomain.com"; // SMTP server
$mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
                                           // 1 = errors and messages
                                           // 2 = messages only
$mail->SMTPAuth   = true;                  // enable SMTP authentication
$mail->SMTPSecure = "tls";                 // sets the prefix to the servier
$mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
$mail->Port       = 587;
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
