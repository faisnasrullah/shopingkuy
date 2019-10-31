// Copyright (c) 2019, AmpasDev and contributors
// For license information, please see license.txt

frappe.ui.form.on('Request Order', {
	onload(frm) {
		frm.set_value('tanggal_pemesanan', tanggal_pemesanan());

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
	},

	level_user: function(frm) {
		hitung_poin(frm);
	},
	total_pembayaran: function(frm) {
		hitung_poin(frm);
	}
});

frappe.ui.form.on("Request Order Line", {
	harga_produk: function(frm, cdt, cdn) {
		sub_total(frm, cdt, cdn);
	},
	jumlah_pembelian: function(frm, cdt, cdn) {
		sub_total(frm, cdt, cdn);
	}
});

let sub_total = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn]
	frappe.model.set_value(cdt, cdn, "sub_total", child.harga_produk * child.jumlah_pembelian);
}

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

let hitung_poin = function(frm) {
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