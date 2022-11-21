<?php
defined('BASEPATH') or exit('No direct script access allowed');

class User extends MY_Controller
{

	public function __construct()
	{
		parent::__construct();
	}

	public function index_get()
	{
		// print_r($this->auth());
		// die;
		if ($this->auth()) {
			$this->response([
				'status' => true,
				'message' => 'ok',
				'data' => null
			], 200);
		} else {
			$this->response([
				'status' => false,
				'message' => 'unauthorized'
			], 401);
		}
	}
}
