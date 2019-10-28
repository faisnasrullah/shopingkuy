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
	}
});

// frappe.ui.form.on("Request Order", "request_order_line", function(frm, cdt, cdn) {
	// var child = locals[cdt][cdn];
	// frm.refresh_field("sub_total");

	// id_product_on_form_rendered: function(frm) {
    //     frappe.model.with_doc("Request Order Line", frm.doc.form_render, function() {
	// 		var tabletransfer = frappe.model.get_doc("Request Order Line", frm.doc.id_product_add)
	// 		console.log(tabletransfer);
			
    //         $.each(tabletransfer.total_pembayaran, function(index, row){
    //             var d = frm.add_child("Request Order");
    //             d.price = row.total_pembayaran;
    //             frm.refresh_field("total_pembayaran");
    //         });
    //     });
	// }
// });

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