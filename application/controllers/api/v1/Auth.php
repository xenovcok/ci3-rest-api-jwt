<?php
defined('BASEPATH') or exit('No direct script access allowed');

use \Firebase\JWT\JWT;

class Auth extends MY_Controller
{

	public function __construct()
	{
		parent::__construct();
	}

	public function getToken_get()
	{

		$exp = time() + 3600;
		$token = array(
			'iss' => 'macitorestservice',
			'aud' => 'client',
			'iat' => time(),
			'nbf' => time() + 10,
			'exp' => $exp,
			'data' => array(
				"phone" => $this->post('phone')
			)
		);

		$jwt = JWT::encode($token, $this->configToken()['secretKey'], 'HS256');

		$this->response([
			'status' => 201,
			'message' => 'ok',
			'data' => $jwt
		], 201);
	}
}
