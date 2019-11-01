# -*- coding: utf-8 -*-
# Copyright (c) 2019, AmpasDev and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RequestOrder(Document):
	pass
	
	def on_submit(self):
		self.on_approve()

	def on_approve(self):
		if (self.docstatus == 1):
			order = frappe.new_doc("Order")
			order.id_user = self.id_user
			order.nama_lengkap = self.nama_lengkap
			order.level_user = self.level_user
			order.tanggal_pemesanan = self.tanggal_pemesanan
			order.total_pembayaran = self.total_pembayaran
			order.poin_pembeli = self.poin_pembeli
			
			for i in self.request_order_line:
				order.append('data_pembelian', {
					'id_user' : i.id_user,
					'nama_penjual' : i.nama_penjual,
					'level_user' : i.level_user,
					'poin_penjual' : i.poin_penjual,
					'id_produk' : i.id_produk,
					'nama_produk' : i.nama_produk,
					'harga_produk' : i.harga_produk,
					'diskon' : i.diskon,
					'persediaan_produk' : i.persediaan_produk,
					'jumlah_pembelian' : i.jumlah_pembelian,
					'sub_total' : i.sub_total
				})
			
			order.save()

			new_order = frappe.get_doc('Order', order.name)
			frappe.msgprint(
				'Request Order Dengan No "{}" Akan Segera Diproses'.format(new_order.name)
			)