// Copyright (c) 2019, AmpasDev and contributors
// For license information, please see license.txt

frappe.ui.form.on('Request Order', {
	setup(frm) {
		frm.set_value('tanggal_pemesanan', tanggal_pemesanan());
	},

	refresh(frm) {
		frm.set_query('id_user', function() {
			return {
				filters: [
					['Master User', 'status_user', '=', 'Pembeli']
				]
			}
		});
		
		frm.set_query('id_produk', 'request_order_line', function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			console.log(d);
			return {
				filters: [
					['Master Product', 'status_produk', '=', 'Tersedia']
				]
			}
		});

		console.log("State Sekarang adalah : " + frm.doc.workflow_state);
	},

	validate(frm) {
		console.log("State Selanjutnya adalah : " + frm.doc.next_workflow_state);
	},

	level_user: function(frm) {
		hitung_poin_pembeli(frm);
	},
	total_pembayaran: function(frm) {
		hitung_poin_pembeli(frm);
	}
});

frappe.ui.form.on("Request Order Line", {
	harga_produk: function(frm, cdt, cdn) {
		hitung_diskon_dan_sub_total(frm, cdt, cdn);
	},
	jumlah_pembelian: function(frm, cdt, cdn) {
		hitung_diskon_dan_sub_total(frm, cdt, cdn);
		validasi_jumlah_pembelian(frm, cdt, cdn);
	},
	level_user: function(frm, cdt, cdn) {
		hitung_poin_penjual(frm, cdt, cdn);
	},
	sub_total: function(frm, cdt, cdn) {
		hitung_poin_penjual(frm, cdt, cdn);
	}
});

frappe.ui.form.on("Request Order Line", "sub_total", function(frm, cdt, cdn) {
	let sub_total = frm.doc.request_order_line;
	let total = 0;
	
	for (let i in sub_total) {
		total = total + sub_total[i].sub_total;
	}
	
	frm.set_value("total_pembayaran", total);
});

function tanggal_pemesanan() {
	let d = new Date(frappe.datetime.now_datetime());

	let dd = d.getDate();
	if (dd < 10){
		dd = '0'+dd;
	}

	let mm = d.getMonth()+1;
	if (mm < 10){
		mm = '0'+mm;
	}

	let yyyy = d.getFullYear();

	let h = d.getHours();
	if (h < 10){
		h = '0'+h;
	}

	let m = d.getMinutes();
	if (m < 10){
		m = '0'+m;
	}

	let s = d.getSeconds();
	if (s < 10){
		s = '0'+s;
	}

	let custom_datetime = dd +'-'+ mm +'-'+ yyyy + ' ' + h + ':' + m + ':' + s;
	return custom_datetime;
}

let validasi_jumlah_pembelian = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];
	let persediaan_produk = child.persediaan_produk;
	let jumlah_pembelian = child.jumlah_pembelian;

	if (jumlah_pembelian > persediaan_produk) {
		frappe.model.set_value(cdt, cdn, 'jumlah_pembelian', 1);
		frappe.msgprint('Jumlah Pembelian Produk Tidak Boleh Lebih Dari Persediaan Produk');
	}
}

let hitung_poin_pembeli = function(frm) {
	let total_pembayaran = frm.doc.total_pembayaran;
	let level_user = frm.doc.level_user;
	let poin = 0;

	if (total_pembayaran <= 100000) {
		if (level_user == 'Bronze') {
			poin = poin + 10;
		} else if (level_user == 'Silver') {
			poin = poin + 15;
		} else {
			poin = poin + 20;
		}
	} else if (total_pembayaran <= 500000) {
		if (level_user == 'Bronze') {
			poin = poin + 15;
		} else if (level_user == 'Silver') {
			poin = poin + 20;
		} else {
			poin = poin + 25;
		}
	} else {
		if (level_user == 'Bronze') {
			poin = poin + 20;
		} else if (level_user == 'Silver') {
			poin = poin + 25;
		} else {
			poin = poin + 30;
		}
	}

	frm.set_value('poin_pembeli', poin);
}

let hitung_poin_penjual = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];
	let level_user = child.level_user;
	let sub_total = child.sub_total;
	let poin = 0;

	if (sub_total <= 100000) {
		if (level_user == 'Bronze') {
			poin = poin + 10;
		} else if (level_user == 'Silver') {
			poin = poin + 15;
		} else {
			poin = poin + 20;
		}
	} else if (sub_total <= 500000) {
		if (level_user == 'Bronze') {
			poin = poin + 15;
		} else if (level_user == 'Silver') {
			poin = poin + 20;
		} else {
			poin = poin + 25;
		}
	} else {
		if (level_user == 'Bronze') {
			poin = poin + 20;
		} else if (level_user == 'Silver') {
			poin = poin + 25;
		} else {
			poin = poin + 30;
		}
	}

	frappe.model.set_value(cdt, cdn, 'poin_penjual', poin);
}

let hitung_diskon_dan_sub_total = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];
	let harga_awal = child.harga_produk;
	let diskon = child.diskon;
	let jumlah_pembelian = child.jumlah_pembelian;

	let harga_diskon = harga_awal * diskon / 100;
	let harga_akhir = harga_awal - harga_diskon;

	let sub_total = harga_akhir * jumlah_pembelian;

	frappe.model.set_value(cdt, cdn, "sub_total", sub_total);
}