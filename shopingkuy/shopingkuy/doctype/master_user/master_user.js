// Copyright (c) 2019, AmpasDev and contributors
// For license information, please see license.txt

frappe.ui.form.on('Master User', {
	// setup(frm) {
	// 	let d = new Date(frappe.datetime.now_datetime());

	// 	let dd = d.getDate();
	// 	if (dd < 10){
	// 		dd = '0'+dd;
	// 	}

	// 	let mm = d.getMonth()+1;
	// 	if (mm < 10){
	// 		mm = '0'+mm;
	// 	}

	// 	let yyyy = d.getFullYear();

	// 	let h = d.getHours();
	// 	if (h < 10){
	// 		h = '0'+h;
	// 	}

	// 	let m = d.getMinutes();
	// 	if (m < 10){
	// 		m = '0'+m;
	// 	}

	// 	let s = d.getSeconds();
	// 	if (s < 10){
	// 		s = '0'+s;
	// 	}
	
	// 	let custom_datetime = dd +'-'+ mm +'-'+ yyyy + ' ' + h + ':' + m + ':' + s;
		
	// 	frm.set_value('tanggal_bergabung', custom_datetime);
	// },

	level_user(frm) {
		if (frm.doc.level_user == 'Bronze') {
			frm.set_value('poin', '0');
		} else if (frm.doc.level_user == 'Silver') {
			frm.set_value('poin', '500');
		} else {
			frm.set_value('poin', '1000');
		}
	}
});
