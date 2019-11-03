// Copyright (c) 2019, AmpasDev and contributors
// For license information, please see license.txt

frappe.ui.form.on('Master Product', {
	onload(frm) {
		frm.set_query('id_user', function() {
			return{
				filters: [
					['Master User', 'status_user', '=', 'Penjual']
				]
			}
		});

		if (frm.doc.persediaan_produk >= 1) {
			frm.set_value('status_produk', 'Tersedia');
		} else {
			frm.set_value('status_produk', 'Habis');
		}
	},

	persediaan_produk(frm) {
		if (frm.doc.persediaan_produk >= 1) {
			frm.set_value('status_produk', 'Tersedia');
		} else if (frm.doc.persediaan_produk < 0) {
			frm.set_value('persediaan_produk', '1');
			frappe.throw('Persediaan Produk Tidak Boleh Kurang Dari 0');
		} else {
			frm.set_value('status_produk', 'Habis');
		}
	}
});