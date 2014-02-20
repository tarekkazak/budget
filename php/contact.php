<?php
require_once('../PHPMailer/class.phpmailer.php');
$data = json_decode(file_get_contents("php://input"));
$name = $data->name;
$subject = $data->subject;
$email = $data->email;
$body = $data->message;
$lang = $data->lang;

$mail = new PHPMailer(); // defaults to using php "mail()"

$mail->SetFrom($email, $name);

$address = "info@pharmacopeiadz.com";
$mail->AddAddress($address, "Pharmacopeiadz site");

$mail->Subject = $subject;
$mail->Body = $body;


if(!$mail->Send()) {
  echo ($lang == "en" ? "Your message was not sent successfully. Please try again later." : "Votre message n'a pas été transmis. Veuillez ressayer plus tard.");

} else {
  echo ($lang == "en" ? "Your message was sent successfully." : "Votre message a été transmis.");
}

?>
