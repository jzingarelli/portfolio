<?php

if (isset($_POST['submit'])) {
  $fullName = $_POST['fullName'];
  $subject = $_POST['subject'];
  $mailFrom = $_POST['email'];
  $message = $_POST['message'];

  $mailTo = "joey.zing@hotmail.com";
  $headers = "From: ".$mailFrom;
  $txt = "You have revieved an email from ".$fullName".\n\n".$message;

  mail($mailTo, $subject, $txt,$headers);
  header("Location: index.php?mailsent");
}
