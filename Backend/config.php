<?php

// $host="localhost";
// $username="jyothilanduser";
// $pass="BTds{%L+H^Gd";
// $db="jyothilanddb";
		
$host="localhost:3307";
$username="root";
$pass="";
// $db="accountingappv3";
$db="sadashri";
		
		$conn=new mysqli($host,$username,$pass,$db);
		
		if($conn->connect_error)
		{
			die("connection failed:" . $conn->connect_error);
		}
		?>