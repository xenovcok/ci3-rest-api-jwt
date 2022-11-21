window.addEventListener("DOMContentLoaded", (event) => {
	// Toggle the side navigation
	const sidebarToggle = document.body.querySelector("#sidebarToggle");
	if (sidebarToggle) {
		// Uncomment Below to persist sidebar toggle between refreshes
		// if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
		//     document.body.classList.toggle('sb-sidenav-toggled');
		// }
		sidebarToggle.addEventListener("click", (event) => {
			event.preventDefault();
			document.body.classList.toggle("sb-sidenav-toggled");
			localStorage.setItem(
				"sb|sidebar-toggle",
				document.body.classList.contains("sb-sidenav-toggled")
			);
		});
	}
});

function resendNft(tokenId, invoice) {
	$('#modalConfirmation').css('z-index', '1066');
	$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
	$('#modalConfirmation').modal('show');

	$('#btn-modal-ok').click((e) => {
		$('#modalConfirmation').modal('hide');

		setTimeout(function (e) {
			$('#modalLoading').css('z-index', '1067');
			$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
			$('#modalLoading').modal('show');
		}, 2000);

		$.ajax({
			url: "/api/transferNftWithToken",
			method: "POST",
			data: { invoice: invoice, token_id: tokenId },
			success: function (res) {
				setTimeout(function (e) {
					$('#modalLoading').modal({ backdrop: "static", keyboard: false });
					$('#modalLoading').modal('hide');
				}, 3000);
				console.log(res);
			},
			error: function (err) {
				console.log(err);
			}
		});
	});
}

function getTransaction(invoice) {
	$.ajax({
		url: "/api/get-transaction/" + invoice,
		method: "GET",
		dataType: "json",
		success: function (res) {
			var data = res.data;
			var nft = '';

			$('#mdl-transaction__invoice').html(data.transaction.code);
			$('#mdl-transaction__email').html(data.transaction.email);
			$('#mdl-transaction__name').html(data.transaction.name);

			var jsonStr = res.data.transaction.description?.slice(1, -1);
			var i = 0;
			var status;

			res.data.nfts.forEach(element => {
				status = jsonStr?.split(',')[i].split(': ')[1];
				token_id = jsonStr?.split(',')[i].split(': ')[0];
				if (status === 'success') {
					nft = nft + '<div class="row px-4 mt-3"><div class="col-lg-6 col-md-6">' + element.name + '</div><div class="col-lg-2 col-md-2"><span class="text-success">' + jsonStr.split(',')[i].split(': ')[1] + '</span></div><div class="col-lg-4 col-md-4 text-end">-</div></div>';
				} else {
					nft = nft + '<div class="row px-4 mt-3"><div class="col-lg-6 col-md-6">' + element.name + '</div><div class="col-lg-2 col-md-2"><span class="text-danger">' + jsonStr.split(',')[i].split(': ')[1] + '</span></div><div class="col-lg-4 col-md-4 text-end"><a href="#!" onclick="resendNft(' + token_id.trim() + ',' + '\'' + data.transaction.code + '\'' + ')" class="btn btn-primary">resend</a></div></div>';
				}

				i++;
			});

			$('#mdl-detail-container').html(nft)

			console.log(res.data);
		},
		error: function (err) {
			console.log("error", err);
		},
	});
	$('#modalDetails').modal({ backdrop: "static", keyboard: false });
	$('#modalDetails').modal('show');
}

function editDiscount(el) {
	$('#modalEditDiscount').modal('show');
	var id = $(el).data('discount_id');

	$.ajax({
		url: "/api/getDiscountById/" + id,
		method: "GET",
		dataType: "json",
		success: async function (res) {
			var discount = res.data;

			$('#modalEditDiscount input#name').val(discount.name);
			$('#modalEditDiscount input#code').val(discount.code);
			$('#modalEditDiscount select#discount_type option[value=' + discount.discount_type + ']').attr('selected', 'selected');
			$('#modalEditDiscount input#expired').val(discount.expired);
			$('#modalEditDiscount input#amount').val(discount.amount);
			$('#modalEditDiscount input#discountId').val(id);
		},
		error: function (err) {
			console.log("error", err);
		},
	});
}

function deleteDiscount(el) {
	// $.ajax({
	// 	url: '/api/deleteDiscount/' + $(el).data('discount_id'),
	// 	method: 'GET',
	// 	dataType: 'json',
	// 	success: function (res) {

	// 	}
	// });
	$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
	$('#modalConfirmation').modal('show');

	$('#btn-modal-ok').click((e) => {
		window.location.replace('/admin/coupons/master/delete/' + $(el).data('id'));
	});
}

function editUserCoupon(el) {
	$('#modalEditUserCoupon').modal('show');
	var id = $(el).data('discount_id');


	$.ajax({
		url: "/api/getUserCouponById/" + id,
		method: "GET",
		dataType: "json",
		success: async function (res) {
			var coupon = res.data;

			console.log(res);

			$('#modalEditUserCoupon select#discount option:selected').removeAttr('selected');

			$('#modalEditUserCoupon input#user').val(coupon.user_id);
			$('#modalEditUserCoupon input#code').val(coupon.coupon_code);
			$('#modalEditUserCoupon select#discount option[value=' + coupon.discount_id + ']').attr('selected', 'selected');
			$('#modalEditUserCoupon input#expired').val(coupon.expired);
			$('#modalEditUserCoupon input#amount').val(coupon.nft_amount);
			$('#modalEditUserCoupon input#coupon_id').val(id);
		},
		error: function (err) {
			console.log("error", err);
		},
	});
}

function deleteUserCoupon(el) {
	$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
	$('#modalConfirmation').modal('show');

	$('#btn-modal-ok').click((e) => {
		window.location.replace('/admin/coupons/user-coupon/delete/' + $(el).data('id'));
	});
}

function editMailingGroup(el) {
	$('#modalEditMailingGroup').modal('show');
	var id = $(el).data('group_id');
	console.log(id)

	$.ajax({
		url: "/api/getMailingGroupById/" + id,
		method: "GET",
		dataType: "json",
		success: async function (res) {
			var group = res.data;
			console.log(group)

			$('#modalEditMailingGroup input#name').val(group.name);
			$('#modalEditMailingGroup input#slug').val(group.slug);
			$('#modalEditMailingGroup input#groupId').val(id);
		},
		error: function (err) {
			console.log("error", err);
		},
	});
}

function viewMailingGroup(el) {
	$('#modalViewMailingGroup').modal('show');
	var id = $(el).data('group_id');

	$.ajax({
		url: "/api/getMailingGroupMemberByGroupIdApi/" + id,
		method: "GET",
		dataType: "json",
		success: async function (res) {
			var dt;
			if (res.data.length > 0) {
				dt = $('#mailing-group-view-table').dataTable({
					'retrieve': true,
					'data': res.data,
					'columnDefs': [{
						'targets': 3,
						'data': null,
						'render': function (data, type, row, meta) {
							return '<a class="btn btn-danger cau__text-sm" id="btn-delete-group" data-id="' + data.id + '" onclick="deleteMailingGroupMemberById(this)">remove</a>';
						}
					}],
					'columns': [
						{ "data": "id" },
						{ "data": "name" },
						{ "data": "email" },
					],
				});

				dt.fnClearTable();
				dt.fnAddData(res.data);

			} else {
				dt = $('#mailing-group-view-table').dataTable();
				dt.fnClearTable();
			}


		},
		error: function (err) {
			console.log("error", err);
		},
	});
}

function deleteMailingGroup(el) {
	$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
	$('#modalConfirmation').modal('show');

	$('#btn-modal-ok').click((e) => {
		window.location.replace('/admin/mailing/group/delete/' + $(el).data('id'));
	});
}

function deleteMailingGroupMemberById(el) {
	var id = $(el).data('id');
	console.log(id);

	$.ajax({
		url: "/api/deleteMailingGroupMemberById/" + id,
		method: "GET",
		dataType: "json",
		success: async function (res) {
			console.log(res)

			window.location.replace('/admin/mailing/group');
		},
		error: function (err) {
			console.log("error", err);
		},
	});
}

function sendMail(el) {
	var elem = $(el);

	var name = elem.data('name');
	var email = elem.data('email');
	var code = elem.data('code');

	$('#modalLoading').modal({ backdrop: "static", keyboard: false });
	$('#modalLoading').modal('show');

	$.ajax({
		url: '/admin/mailing/coupon/sendApi/?email=' + email + '&name=' + name + '&coupon_code=' + code,
		method: 'GET',
		success: (res) => {
			$('#modalLoading').modal('hide');

			if (res) {
				setTimeout(alert('email sent'), 1000);
			}
		},
		error: (err) => {
			$('#modalLoading').modal('hide');
			alert('error', err);

		}
	})
}

function sendAll(el) {
	$('#modalLoading').modal({ backdrop: "static", keyboard: false });
	$('#modalLoading').modal('show');

	$.ajax({
		url: '/admin/mailing/coupon/sendAll',
		method: 'GET',
		success: (res) => {

			if (res) {
				console.log('sendAll response', res);
				$('#modalLoading').modal('hide');

				$('#modalMailReport #modalMailContent').html(res);
				$('#modalMailReport').modal({ backdrop: "static", keyboard: false });
				$('#modalMailReport').modal('show');
			}
		},
		error: (err) => {
			$('#modalMailReport').modal('hide');
			alert(err);
			console.log(err);
		}
	})
}

function sendToGroup(el) {
	$('#modalLoading').modal({ backdrop: "static", keyboard: false });
	$('#modalLoading').modal('show');

	var group_id = $('#form-send-group select#group').val();
	console.log('group_id', group_id);
	if (!group_id) {
		setInterval(() => $('#modalLoading').modal('hide'), 2000);
		console.log('choose group');
	} else {
		$.ajax({
			url: '/admin/mailing/coupon/sendToGroup/' + group_id,
			method: 'GET',
			success: (res) => {
				if (res) {
					console.log('sendToGroup response', res);
					setInterval(() => {
						$('#modalLoading').modal('hide');

						$('#modalMailReport #modalMailContent').html(res);
						$('#modalMailReport').modal({ backdrop: "static", keyboard: false });
						$('#modalMailReport').modal('show');
					}, 2000);
				}
			},
			error: (err) => {
				$('#modalMailReport').modal('hide');
				alert(err);
				console.log(err);
			}
		})
	}

}

function addToGroup(el) {
	$('#modalAddUserToGroup').modal('show');
	var id = $(el).data('user_coupon_id');

	$('#modalAddUserToGroup input#user_coupon_id').val(id);
	console.log(id)

	// $.ajax({
	// 	url: "/api/getMailingGroupMemberByGroupIdApi/" + id,
	// 	method: "GET",
	// 	dataType: "json",
	// 	success: async function (res) {
	// 		var group = res.data;
	// 		console.log(group)

	// 		var dt = $('#mailing-group-view-table').dataTable({
	// 			'retrieve': true,
	// 			'data': res.data,
	// 			'columnDefs': [{
	// 				'targets': 3,
	// 				'data': null,
	// 				'render': function (data, type, row, meta) {
	// 					return '<a class="btn btn-danger cau__text-sm" id="btn-delete-group" data-id="' + data.id + '" onclick="deleteMailingGroupMemberById(this)">remove</a>';
	// 				}
	// 			}],
	// 			'columns': [
	// 				{ "data": "id" },
	// 				{ "data": "name" },
	// 				{ "data": "email" },
	// 			],
	// 		});
	// 	},
	// 	error: function (err) {
	// 		console.log("error", err);
	// 	},
	// });
}

$(document).ready(function () {
	$('#btn-modal-cancel').click((e) => {
		$('#modalConfirmation').modal('hide');

		return false;
	});

	$('#modalDetails').on('shown.bs.modal', function () {
		$(document).off('focusin.modal');
	});

	$('#btn-delete-store').click((e) => {
		$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
		$('#modalConfirmation').modal('show');
	});

	$('#btn-delete-coupon').click((e) => {
		$('#modalConfirmation').modal({ backdrop: "static", keyboard: false });
		$('#modalConfirmation').modal('show');
	});

	$('#modalAddUserCoupon select#user').select2({
		dropdownParent: $('#modalAddUserCoupon'),
		ajax: {
			url: function (params) {
				return '/api/getUserByStr/' + params.term;
			},
			processResults: function (data) {
				// Transforms the top-level key of the response object from 'items' to 'results'
				var res = JSON.parse(data);
				var select2Data = [];

				res.data.map(function (d) {
					select2Data.push({ 'id': d.id, 'text': d.name });
				});

				console.log(select2Data);
				return {
					results: select2Data
				};
			}
		},

	})

})
