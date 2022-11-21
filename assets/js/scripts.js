/*!
 * Start Bootstrap - SB Admin v7.0.5 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */
//
// Scripts
//

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

function preview(el) {
	console.log('json data:', $(el).data('item_token_id'));

	$.ajax({
		url: "/api/getnftbytokenid/" + $(el).data('item_token_id'),
		method: "GET",
		dataType: "json",
		success: function (res) {
			console.log(res);
			var data = res.data;

			$('#modal-nft-img-preview').attr('src', data.url);
			$('#modal-nft-qty').html(data.qty);
			$('#modal-nft-name').html(data.name);
			$('#modal-nft-price').html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.price));
			$('#modal-nft-description').html(data.description);

			$('#modalItemDetail').modal('show');
		},
		error: function (err) {
			console.log(err);
		}
	});

}

function discountPreview(el) {
	console.log(el);
	var img = $(el).find('img').attr('src');
	var amount = $(el).find('button').html();
	var name = $(el).find('#storeName').html();
	var desc = $(el).find('#storeDescription').val();
	var address = $(el).find('#storeAddress').val();
	var location = $(el).find('#location').val();

	$('#modal-discount-img').attr('src', img);
	$('#modal-discount-amount').html(amount);
	$('#modal-discount-name').html(name);
	$('#modal-discount-address').val(address);
	$('#modal-discount-description').html(desc);
	$('#modal-discount-map').attr('href', location);

	$('#modalDiscount').modal('show');
}

function redirect(url) {
	window.location.href = url;
}

function showModalDynamic(title, body) {
	$('#modalDynamicTitle').html(title);
	$('#modalDynamicDescription').html(body);

	$('#modalDynamic').modal({ backdrop: "static", keyboard: false })
	$('#modalDynamic').modal('show');
}

function hideDynamicModal() {
	$('#modalDynamic').modal('hide');
}

function hideModal(id) {
	console.log(id);
	$(id).modal('hide');
}

function enableBtn() {
	$('.btn-choose-wallet').prop('disabled', false);
	$('.btn-choose-wallet').addClass('text-white');
}

function disableBtn() {
	$('.btn-choose-wallet').prop('disabled', true);
	$('.btn-choose-wallet').removeClass('text-white');
}

function gotoPage() {
	url = "/dokupay?payment_code=" + $(".paymentMethod:checked").val() + '&coupon_code=' + $('#input-code').val().trim();

	if (!$(".paymentMethod:checked").val()) {
		alert("Please Choose your payment method");

		return false;
	}

	if (!$("#checkAgreement").is(":checked")) {
		alert("Please Agree Our Terms & Condition");

		return false;
	}
	$("#modalPurchaseConfirmation").modal("hide");

	if ($(".paymentMethod:checked").val() == 'USDT') {
		$("#modalLoading").modal({ backdrop: "static", keyboard: false });
		$('#modalLoading').modal('show');

		sendTransaction('USDT').then((res) => {
			console.log('usdt res', res);
			if (res === false) {
				$('.modal-changenetwork-text').html('Please change your network to Ethereum Mainnet');
				setTimeout(function () { $("#modalChangeNetwork").modal("show") }, 2500);

				setTimeout(function () { $('#modalLoading').modal('hide') }, 2000);
			} else {
				if (res === 'denied') {
					$('#modalLoading').modal('hide');
					$('.modal-changenetwork-text').html('Transaction Failed. Rejected by User');
					$("#modalChangeNetwork").modal("show");
				} else if (res === 'error') {
					$('#modalLoading').modal('hide');
					$('.modal-changenetwork-text').html('Something went wrong');
					$("#modalChangeNetwork").modal("show");
				} else {
					$.ajax({
						url: "/api/insert_transaction",
						method: "POST",
						dataType: "json",
						data: { hash: res.transactionHash, token: 'USDT' },
						success: function (res) {
							$.ajax({
								url: "/api/transfer/" + res.data.invoice,
								method: "GET",
								success: function (rest) {
									console.log('success transfer', res);
									// $('#modalLoading').modal('hide');
									// $('.modal-changenetwork-text').html('Transaction Success');
									// $("#modalChangeNetwork").modal("show");
									window.location.replace('/transaction_history/details/' + res.data.invoice);
								},
								error: function (err) {
									console.log('error transfer', err);
								}
							});
						},
						error: function (err) {
							console.log('error insert', err);
						}
					});
				}
			}
		});
	} else if ($(".paymentMethod:checked").val() == 'KPG') {
		// sendTransaction('KPG').then((x) => console.log('promise res', x.blockHash));
		$("#modalLoading").modal({ backdrop: "static", keyboard: false });
		$('#modalLoading').modal('show');

		sendTransaction('KPG').then((res) => {
			console.log('kpg res', res);
			if (res === false) {
				$('.modal-changenetwork-text').html('Please change your network to Avalance C Chain Mainnet');
				setTimeout(function () { $("#modalChangeNetwork").modal("show") }, 2500);

				setTimeout(function () { $('#modalLoading').modal('hide') }, 2000);
			} else {
				if (res === 'denied') {
					$('#modalLoading').modal('hide');
					$('.modal-changenetwork-text').html('Transaction Failed. Rejected by User');
					$("#modalChangeNetwork").modal("show");
				} else if (res === 'error') {
					$('#modalLoading').modal('hide');
					$('.modal-changenetwork-text').html('Something went wrong');
					$("#modalChangeNetwork").modal("show");
				} else {
					$.ajax({
						url: "/api/insert_transaction",
						method: "POST",
						dataType: "json",
						data: { hash: res.transactionHash, token: 'KPG', coupon_code: $('#input-code').val().trim() },
						success: function (res) {
							$.ajax({
								url: "/api/transfer/" + res.data.invoice,
								method: "GET",
								success: function (rest) {
									// console.log('success transfer ', res);
									// console.log('success transfer rest', rest);
									// $('#modalLoading').modal('hide');
									// $('.modal-changenetwork-text').html('Transaction Success');
									// $("#modalChangeNetwork").modal("show");
									window.location.replace('/transaction_history/details/' + res.data.invoice);
								},
								error: function (err) {
									console.log('error transfer', err);
								}
							});
						},
						error: function (err) {
							console.log('error insert', err);
						}
					});
				}
			}

		});
	} else {
		$("#modalLoading").modal({ backdrop: "static", keyboard: false });
		$("#modalLoading").modal("show");

		window.location.replace(url);
	}

}

function minusBtn(e, el) {
	e.stopPropagation();
	let input = $(el).closest("div").find("input[type=number]");
	if (input.val() > 0) {
		input.val(input.val() - 1);
		if (
			("parent",
				$(el).closest("div").parent().attr("class").search("quantity") < 0)
		) {
			$(el)
				.parent()
				.parent()
				.parent()
				.parent()
				.find(".nft-list.btn-addcart")
				.data("nft_qty", input.val());
		} else {
			$(el).closest("div").parent().find("button").data("nft_qty", input.val());
		}
	}
}
// lol ?
function plusBtn(e, el) {
	e.stopPropagation();
	let input = $(el).closest("div").find("input[type=number]");
	var vall = parseInt(input.val());
	input.val(vall + 1);
	if (
		("parent",
			$(el).closest("div").parent().attr("class").search("quantity") < 0)
	) {
		$(el)
			.parent()
			.parent()
			.parent()
			.parent()
			.find(".nft-list.btn-addcart")
			.data("nft_qty", vall + 1);
	} else {
		$(el)
			.closest("div")
			.parent()
			.find("button")
			.data("nft_qty", vall + 1);
	}
}

function checkNegative(el) {
	let input = $(el).val();

	if (input < 0) {
		$(el).val(0);
	}
}

function loadCart() {
	$.ajax({
		url: "/page/show_cart",
		method: "GET",
		success: function (res) {
			data = JSON.parse(res).data;
			if (data.itemCount > 0) {
				data.itemCount > 1
					? $(".btn-cart > span").html(data.itemCount + " Items")
					: $(".btn-cart > span").html(data.itemCount + " Item");
				$(".btn-cart").removeClass("btn-icon-primary");
				$(".btn-cart").addClass("btn-primary");
				$(".btn-cart").attr("disabled", false);
				$(".btn-cart > svg > path").attr("fill", "#fff");
			} else {
				data.itemCount > 1
					? $(".btn-cart > span").html(data.itemCount + " Item")
					: $(".btn-cart > span").html(data.itemCount + " Item");
				$(".btn-cart").addClass("btn-icon-primary");
				$(".btn-cart").removeClass("btn-primary");
				$(".btn-cart").attr("disabled", true);
				$(".btn-cart > svg > path").attr("fill", "#CACACA");
			}
		},
	});
}

function cartClick() {
	sessionStorage.removeItem("badges");
}

function nftClick(el) {
	var id;
	if (el) {
		id = $(el).data("nft_id");
	} else {
		id = "CAU01";
	}

	$("#nft-preview-preloader").removeClass("d-none fade");

	$.ajax({
		url: "/page/get_nft_by_id/" + id,
		method: "GET",
		success: function (res) {
			resData = JSON.parse(res).data;

			$(".nft-item .card").removeClass("selected");
			$(el).addClass("selected");

			$('html, body').animate({ scrollTop: 0 }, 'fast');

			$("#nft-preview .btn-addcart").data("nft_id", resData[0].id);
			$("#nft-preview .btn-addcart").data("nft_name", resData[0].name);
			$("#nft-preview .btn-addcart").data("nft_price", resData[0].price);

			$("#nft-img-preview").attr("src", resData[0].url);
			$(".nft-header #nft-name").html(resData[0].name);
			$(".nft-header #nft-price").html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(resData[0].price));
			$(".nft-header #nft-qty").html(resData[0].qty);
			// $('p#nft-description').html(resData[0].description.length > 453 ? resData[0].description.substring(0, 453) + ' ...' : resData[0].description);
			$("p#nft-description").html(resData[0].description);

			$("#nft-preview-preloader").addClass("fade");
			$("#nft-preview-preloader").addClass("d-none");
		},
	});
}

function removeItem(el) {
	var id = $(el).data("nft_id");
	var qty = 0;
	var sub_total = 0;

	$.ajax({
		url: "/page/add_to_cart",
		method: "POST",
		data: {
			nft_id: id,
			nft_name: "",
			nft_price: "",
			nft_quantity: qty,
			sub_total: sub_total,
		},
		success: function (res) {
			data = JSON.parse(res).data;
			// console.log('item removed');
			// console.log('imte count after remove: ', data.itemCount);

			// console.log('cart content', content);
			$(el).parent().parent().parent().remove();
			$(".summary-item[data-nft_id=" + id + "]").remove();
			if (data.itemCount > 0) {
				data.itemCount > 1
					? $(".btn-cart > span").html(data.itemCount + " Item")
					: $(".btn-cart > span").html(data.itemCount + " Items");
				$(".btn-cart").removeClass("btn-icon-primary");
				$(".btn-cart").addClass("btn-primary");
				$(".btn-cart").attr("disabled", false);
				$(".btn-cart > svg > path").attr("fill", "#fff");
			} else {
				data.itemCount > 1
					? $(".btn-cart > span").html(data.itemCount + " Item")
					: $(".btn-cart > span").html(data.itemCount + " Items");
				$(".btn-cart").addClass("btn-icon-primary");
				$(".btn-cart").removeClass("btn-primary");
				$(".btn-cart").attr("disabled", true);
				$(".btn-cart > svg > path").attr("fill", "#CACACA");
			}

			window.location.reload();
		},
	});
}

var uuid;

var checkUUIDPoll;
var stopCheck;
var counter = 0;
var baseUrl = '';

function getUUID() {
	if (window.location.origin == 'https://nftcoklat.baliola.com') {
		baseUrl = 'https://rust-api.betamax.co/Betamax_connect_request/';
	} else {
		baseUrl = 'https://rust-api-staging.betamax.co/Betamax_connect_request/';
	}

	$.ajax({
		url: baseUrl,
		method: "POST",
		dataType: "json",
		success: function (res) {
			let options = {
				render: "image",
				eclevel: "L",
				text: "https://nftcoklat.baliola.com?uuid=" + res.data.uuid,
				size: 298,
			};

			$("#qrcode").empty().qrcode(options);
			$("#scanQrCodeModal").modal("show");

			uuid = res.data.uuid;
			console.log(uuid);
		},
		error: function (err) {
			console.log(err);
		},
	});

	checkUUIDPoll = window.setInterval(() => {
		counter++;
		var html = "";
		$.ajax({
			url: "/page/check_connection_uuid/" + uuid,
			method: "POST",
			dataType: "json",
			data: { uuid: uuid },
			success: function (res) {
				console.log('res', res);
				if (res.message == "ACCEPTED") {
					$("#scanQrCodeModal").modal("hide");
					$("#modalChooseWallet").modal("show");

					if (res && res.data) {
						sessionStorage.setItem("addresses", JSON.stringify(res.data));
						sessionStorage.setItem("isBetamax", 'true');

						res.data.forEach((d) => {
							html +=
								"<div class='wallet-container'><input onclick='enableBtn()' class='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault1' value='" +
								d.public_address +
								"'><div class='wallet-detail'><div class='wallet-name cau__text-base-100'>" +
								d.wallet_name +
								"</div><div class='wallet-address cau__text-base-60'>" +
								d.public_address.substring(0, 10) +
								"..." +
								d.public_address.substring(24, d.public_address.length) +
								"</div></div></div>";
						});

						$.ajax({
							url: "/page/btxConnectionCounter",
							method: "GET",
							dataType: "json",
							success: function (ress) {
								console.log(ress);
							},
							error: function (err) {
								console.log("error", err);
							},
						});
					} else {
						html = "<h3>no wallet address found</h3>";
					}

					$(".form-check").append(html);

					stopCheck();
				} else if (res.message == "INVALID") {
					stopCheck();
				}

				//console.log('response ' + counter, res);
			},
			error: function (err) {
				console.log("error", err);
			},
		});

		if (counter > 29) {
			stopCheck();
			getUUID();
		}
	}, 2000);
}

stopCheck = () => {
	counter = 0;
	window.clearInterval(checkUUIDPoll);
};

function checkUUID(uuid) {
	$.ajax({
		url: "/page/check_connection_uuid/" + uuid,
		method: "POST",
		dataType: "json",
		data: { uuid: uuid },
		success: function (res) {
			//console.log('response', res);
		},
		error: function (err) {
			console.log("error", err);
		},
	});

	return true;
}

$(document).ready(function () {
	console.log(window.location.hostname)

	nftClick();
	$('.txt-address').click((e) => {
		var addresses = sessionStorage.getItem('addresses');
		var html = '';

		console.log('txt address');

		if (addresses) {
			console.log("address found: ", JSON.parse(addresses));
			var ad = JSON.parse(addresses);
			ad.forEach((d) => {
				html += "<div class='wallet-container'><input onclick='enableBtn()' class='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault1' value='" + d.public_address + "'><div class='wallet-detail'><div class='wallet-name cau__text-base-100'>" + d.wallet_name + "</div><div class='wallet-address cau__text-base-60'>" + d.public_address.substring(0, 10) + "..." + d.public_address.substring(24, d.public_address.length) + "</div></div></div>";
			});

			$(".form-check").empty().append(html);

			$("#modalChooseWallet").modal("show");
		} else {
			$('#modalWeb3').modal('show');
		}
	});

	$('#btn-connect-wallet-sidenav').click((e) => {
		var addresses = sessionStorage.getItem('addresses');
		var html = '';

		console.log('txt address');

		if (addresses) {
			console.log("address found: ", JSON.parse(addresses));
			var ad = JSON.parse(addresses);
			ad.forEach((d) => {
				html += "<div class='wallet-container'><input onclick='enableBtn()' class='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault1' value='" + d.public_address + "'><div class='wallet-detail'><div class='wallet-name cau__text-base-100'>" + d.wallet_name + "</div><div class='wallet-address cau__text-base-60'>" + d.public_address.substring(0, 10) + "..." + d.public_address.substring(24, d.public_address.length) + "</div></div></div>";
			});

			$(".form-check").empty().append(html);

			$("#modalChooseWallet").modal("show");
		} else {
			$('#modalWeb3').modal('show');
		}
	});

	$('#modalChooseWallet').on('hidden.bs.modal', function () {
		disableBtn();
	});

	$('#cau__btn-edit-receiver').click((e) => {
		$('#modalEditReceiverInformation').modal('show');
	});

	$('#cau__btn-receiver-update').click((e) => {
		e.preventDefault();
		$('#form_receiver_information').submit();
	});

	$('#btn-connect-btx').click((e) => {
		var addresses = sessionStorage.getItem('addresses');
		var html = '';

		if (addresses) {
			console.log("address found: ", JSON.parse(addresses));
			var ad = JSON.parse(addresses);
			ad.forEach((d) => {
				html += "<div class='wallet-container'><input onclick='enableBtn()' class='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault1' value='" + d.public_address + "'><div class='wallet-detail'><div class='wallet-name cau__text-base-100'>" + d.wallet_name + "</div><div class='wallet-address cau__text-base-60'>" + d.public_address.substring(0, 10) + "..." + d.public_address.substring(24, d.public_address.length) + "</div></div></div>";
			});

			$(".form-check").empty().append(html);

			$("#modalChooseWallet").modal("show");
		} else {
			$("#newConnectModal").modal("show");
			$('#modalWeb3').modal('hide');
			console.log("address not found");
		}
	});

	$('#btn-use-current-location').click((e) => {
		e.preventDefault();
		if (navigator.geolocation) {
			console.log(navigator.geolocation.getCurrentPosition((position) => {
				$('input#location').val('https://maps.google.com/?q=' + position.coords.latitude + ',' + position.coords.longitude + '&z=16&output=embed');
			}));

		} else {
			alert("Geolocation is not supported by this browser.");
		}
	})

	$(".btn-hide-table > svg").click((e) => {
		$("#wd-table-container").addClass("hidden-width");
		$("#wd-form-container").addClass("pe-5");
		$("#wd-description").removeClass("hidden-width d-none");
		$(".btn-show-table").removeClass("d-none");
		console.log("ke klik");
	});

	$(".btn-show-table > svg").click((e) => {
		$("#wd-table-container").removeClass("hidden-width");
		$("#wd-form-container").removeClass("pe-5");
		$("#wd-description").addClass("hidden-width d-none");
		$(".btn-show-table").addClass("d-none");
		console.log("ke klik");
	});

	$(".btn-resync-wallet").click((e) => {
		$("#modalChooseWallet").modal("hide");

		$.ajax({
			url: "/home/clear_address",
			method: "GET",
			dataType: "json",
			success: async function (res) {
				//console.log('response', res);
				onDisconnect();
			},
			error: function (err) {
				console.log("error", err);
			},
		});
	});

	$("#scanQrCodeModal").modal({ backdrop: "static", keyboard: false });

	let selectedNft = sessionStorage.getItem("selectedNft");
	if (!selectedNft) {
		$(".nft-item > .col:first-child > .card").addClass("selected");
	}

	$("#new-connect-wallet").click((e) => {
		$("#newConnectModal").modal("hide");
		getUUID();
	});

	$(".photo>img").click((e) => {
		$(".under-header").toggleClass("show-popup");
		stopCheck();
	});

	$("#btn-back").click((e) => {
		$("#scanQrCodeModal").modal("hide");
		stopCheck();
	});

	$("#btn-back-home").click((e) => {
		window.location.href = "/home";
	});

	$(".btn-hide-table > svg").click((e) => {
		$("#wd-table-container").addClass("hidden-width");
		$("#wd-form-container").addClass("pe-5");
		$("#wd-description").removeClass("hidden-width d-none");
		$(".btn-show-table").removeClass("d-none");
	});

	$(".btn-show-table > svg").click((e) => {
		$("#wd-table-container").removeClass("hidden-width");
		$("#wd-form-container").removeClass("pe-5");
		$("#wd-description").addClass("hidden-width d-none");
		$(".btn-show-table").addClass("d-none");
	});

	var tooltipTriggerList = [].slice.call(
		document.querySelectorAll('[data-bs-toggle="tooltip"]')
	);

	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});

	loadCart();

	$(".btn-addcart").click(function (e) {
		e.stopPropagation();
		var id = $(this).data("nft_id");
		var name = $(this).data("nft_name");
		var price = $(this).data("nft_price");
		var qty = $(this).data("nft_qty");
		var sub_total = price * qty;

		console.log("qty: ", qty);

		$.ajax({
			url: "/page/add_to_cart",
			method: "POST",
			data: {
				nft_id: id,
				nft_name: name,
				nft_price: price,
				nft_quantity: qty,
				sub_total: sub_total,
			},
			success: function (res) {
				data = JSON.parse(res).data;
				if (data.itemCount > 0) {
					data.itemCount > 1
						? $(".btn-cart > span").html(data.itemCount + " Items")
						: $(".btn-cart > span").html(data.itemCount + " Item");
					$(".btn-cart").removeClass("btn-icon-primary");
					$(".btn-cart").addClass("btn-primary");
					$(".btn-cart").attr("disabled", false);
					$(".btn-cart > svg > path").attr("fill", "#fff");
				} else {
					data.itemCount > 1
						? $(".btn-cart > span").html(data.itemCount + " Item")
						: $(".btn-cart > span").html(data.itemCount + " Item");
					$(".btn-cart").addClass("btn-icon-primary");
					$(".btn-cart").removeClass("btn-primary");
					$(".btn-cart").attr("disabled", true);
					$(".btn-cart > svg > path").attr("fill", "#CACACA");
				}

				if (qty > 0) {
					badgesCounter = 1;
					sessionStorage.setItem("badges", badgesCounter);
					$("#badges").removeClass("d-none");
					$("#badges").addClass("d-inline");
				}
			},
		});
	});

	$(".btn-cart").click((e) => {
		window.location.href = $(".btn-cart").attr("href");
	});

	$("#transaction-history-table").DataTable({
		responsive: true,
	});

	$("#referral-list-table").DataTable({
		responsive: true,
	});

	$("#withdraw-revenue").DataTable({
		responsive: true,
	});

	function setTooltip(btn, message) {
		btn
			.attr("data-bs-original-title", "copied")
			.tooltip("show")
			.attr("data-bs-original-title", "copy");
	}

	function hideTooltip(btn) {
		setTimeout(function () {
			btn.tooltip("hide");
		}, 1000);
	}

	let copyRefButton = document.getElementById("btn-ref-copy");
	if (copyRefButton !== null) {
		copyRefButton.addEventListener("click", function () {
			navigator.clipboard
				.writeText(document.getElementById("ref-code").value)
				.then(
					(success) => {
						setTooltip($("#btn-ref-copy"), "copied");
						hideTooltip($("#btn-ref-copy"));
					},
					(err) => console.log("error copying text")
				);
		});
	}

	let copyButton = document.getElementById("btn-copy");
	if (copyButton !== null) {
		copyButton.addEventListener("click", function () {
			navigator.clipboard
				.writeText(document.getElementById("va-number").value)
				.then(
					(success) => {
						setTooltip($("#btn-copy"), "copied");
						hideTooltip($("#btn-copy"));
					},
					(err) => console.log("error copying text")
				);
		});
	}

	let copyLinkButton = document.getElementById("btn-copy-url");
	if (copyLinkButton !== null) {
		copyLinkButton.addEventListener("click", function () {
			navigator.clipboard
				.writeText(document.getElementById("ref-url").value)
				.then(
					(success) => {
						setTooltip($("#btn-copy-url"), "copied");
						hideTooltip($("#btn-copy-url"));
					},
					(err) => console.log("error copying text")
				);
		});
	}

	$("#connect-wallet").click(() => {
		$(".modal-page1").addClass("d-none");
		$(".modal-page2").removeClass("d-none");
	});

	$(".btn-connect-wallet").click(function (e) {
		e.preventDefault();
		var loadingModal = new bootstrap.Modal($("#modalLoading"), {
			backdrop: "static",
			keyboard: false,
		});

		var email = $("#btx_email").val();
		var res;
		var mailPattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
		if (email == "") {
			res = "Email cannot be empty";
		} else if (!mailPattern.test(email)) {
			res = "Invalid email format";
		} else {
			res = "submiting ...";
			$("#connectModal").modal("hide");
			loadingModal.show();

			setTimeout(() => {
				loadingModal.hide();
				$("#modalChooseWallet").modal("show");
			}, 2000);
		}

		console.log("res", res);
	});

	$(".btn-choose-wallet").click((e) => {
		e.preventDefault();
		var address = $(".form-check-input[name=flexRadioDefault]:checked").val();

		var datas = { address: address };
		console.log("datas", datas);
		$.ajax({
			url: "/home/select_address",
			method: "POST",
			data: datas,
			success: function (res) {
				var respo = JSON.parse(res);
				if (respo.status == 200) {
					// console.log("address selected");
				} else {
					// console.log("no address selected");
				}
			},
		});

		$("#modalChooseWallet").modal("hide");
		$("#modalSuccess").modal({ backdrop: "static", keyboard: false });
		$("#modalSuccess").modal("show");
	});

	$(".btn-success-homepage").click(() => {
		window.location.reload();
	});

	$("#btn-logout").click((e) => {
		sessionStorage.clear();
	});

	$(".btn-choose-cancel").click((e) => {
		e.preventDefault();

		$("#modalChooseWallet").modal("hide");
	});

	$("#btn-ok-noaddress").click((e) => {
		e.preventDefault();

		$("#modalNoAddress").modal("hide");
	});

	$("#btn-process-payment").click((e) => {
		e.preventDefault();

		var coupon = $('#input-code').val();

		$.ajax({
			url: "/api/check-coupon/" + coupon,
			method: "GET",
			success: function (res) {
				var respo = JSON.parse(res);
				var total_pay = $('.total-payment-text').html();
				var total_qty = $('#total_item_qty').val();
				var discount;
				// var discount = $('#total_item_price').val() - total_qty * 500000;
				console.log('res', res);

				if (respo.status == true) {
					if (respo.data?.msg !== 'pass') {
						if (respo.data?.coupon_type == 'percentage') {
							if (respo.data?.coupon_value == '100') {
								discount = $('#total_item_price').val() - ($('#total_item_price').val() * (respo.data?.coupon_value / 100));
							} else {
								discount = ($('#total_item_price').val() - 15000) - (($('#total_item_price').val() - 15000) * (respo.data?.coupon_value / 100)) + 15000;
							}

						} else {
							discount = $('#total_item_price').val() - total_qty * respo.data?.coupon_value;
						}
						console.log('available coupon:', respo.data?.available_coupon);
						console.log('order qty:', total_qty);

						if (respo.data?.available_coupon < total_qty) {
							$('.coupon-warning .text-end').html('this coupon is only for ' + respo.data?.available_coupon + (respo.data?.available_coupon > 1 ? ' items' : ' item'));
							$('.coupon-warning').removeClass('d-none');

							return;
						} else {
							$('.total-payment-text').html('<del>' + total_pay + '</del>');
							$('.total-discount-text').html(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(discount));
							$('#crypo_currency_value').html(discount / 15000);
							$('.special-price').removeClass('d-none');
						}


					}

					$.ajax({
						url: "/home/check_address",
						method: "GET",
						success: function (res) {
							var respo = JSON.parse(res);
							if (respo.status == 200) {
								$("#modalPurchaseConfirmation").modal("show");
							} else {
								$("#modalNoAddress").modal("show");
							}
						},
					});

					$('.coupon-warning').addClass('d-none');
				} else {
					$('.coupon-warning').removeClass('d-none');
				}
			},
		});

	});

	$("#btn-cancel-payment").click((e) => {
		e.preventDefault();
		$("#modalPurchaseConfirmation").modal("hide");
	});

	$(".paymentMethod").change((e) => {
		let selectedPayment = $(".paymentMethod:checked").val();
		var payment;
		switch (selectedPayment) {
			case "BRIVA":
				payment = "BRI Virtual Account";
				break;
			case "BNIVA":
				payment = "BNI Virtual Account";
				break;
			case "PERMATAVA":
				payment = "Permata Virtual Account";
				break;
			case "MANDIRIVA":
				payment = "Mandiri Virtual Account";
				break;
			case "BCAVA":
				payment = "BCA Virtual Account";
				break;
			case "INDOMARET":
				payment = "Indomaret";
				break;
			case "ALFAMART":
				payment = "Alfamart";
				break;
			case "QRIS":
				payment = "QRIS";
				break;
			case "DOKUVA":
				payment = "DOKU Virtual Account";
				break;
			case "CC":
				payment = "Credit Card";
				break;
			case "USDT":
				payment = "Tether";
				break;
			case "KPG":
				payment = "Kepeng";
				break;
			default:
				payment = "-";
		}
		$(".summary-payment-method").html(payment);

		if (selectedPayment == "USDT" || selectedPayment == "KPG") {
			$("#crypto-type").html(selectedPayment);
			$(".usdt-row").css('display', 'flex');
		} else {
			$(".usdt-row").css('display', 'none');
		}
	});

	if (sessionStorage.getItem("badges") == 1) {
		$("#badges").removeClass("d-none");
		$("#badges").addClass("d-inline");
	} else {
		$("#badges").removeClass("d-inline");
		$("#badges").addClass("d-none");
	}


});
