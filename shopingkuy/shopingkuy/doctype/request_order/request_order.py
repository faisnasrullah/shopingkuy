# -*- coding: utf-8 -*-
# Copyright (c) 2019, AmpasDev and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RequestOrder(Document):
	pass
	
	def on_submit(self):
		self.on_action1()

	def on_cancel(self):
		self.on_action2()

	def on_action1(self):
		
		# Action = Rejected By Penjual (Tidak ada Penambahan Poin, dan Pengurangan Persediaan Produk)
		if (self.docstatus == 1 and self.workflow_state == 'Rejected By Penjual'):
			order = frappe.new_doc("Order")
			order.id_user = self.id_user
			order.nama_lengkap = self.nama_lengkap
			order.level_user = self.level_user
			order.tanggal_pemesanan = self.tanggal_pemesanan
			order.total_pembayaran = self.total_pembayaran
			order.poin_pembeli = 0
			order.status_order = self.workflow_state
			
			for i in self.request_order_line:
				order.append('data_pembelian', {
					'id_user' : i.id_user,
					'nama_penjual' : i.nama_penjual,
					'level_user' : i.level_user,
					'poin_penjual' : 0,
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
				'Pesanan dengan No "{}" Selesai Diproses'.format(new_order.name)
			)

		# Action = Approved By Penjual (Tambah Poin, Kurangi Persediaan Produk)
		elif (self.docstatus == 1 and self.workflow_state == 'Approved By Penjual'):
			order = frappe.new_doc("Order")
			order.id_user = self.id_user
			order.nama_lengkap = self.nama_lengkap
			order.level_user = self.level_user
			order.tanggal_pemesanan = self.tanggal_pemesanan
			order.total_pembayaran = self.total_pembayaran
			order.poin_pembeli = self.poin_pembeli
			order.status_order = self.workflow_state

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

				# Get Value Poin sekarang dari Master User (sebelum menambahkan poin baru)
				poin = frappe.db.get_value("Master User", i.id_user, 'poin')
				poin_penjual = poin + i.poin_penjual # simpan poin baru pada variable poin_penjual
				frappe.db.set_value("Master User", i.id_user, 'poin', poin_penjual) # Set Value Poin

				# Get Value Persediaan Produk dari Master Produk (sebelum melakukan pengurangan persediaan produk)
				stock = frappe.db.get_value('Master Product', i.id_produk, 'persediaan_produk')
				persediaan_produk = stock - i.jumlah_pembelian
				frappe.db.set_value("Master Product", i.id_produk, 'persediaan_produk', persediaan_produk) # Set Value Persediaan Produk
				
				frappe.db.commit()
				

			# Get Value Poin sekarang dari Master User (sebelum menambahkan poin baru)
			poin = frappe.db.get_value("Master User", self.id_user, 'poin')
			poin_pembeli = poin + self.poin_pembeli # simpan poin baru pada variable poin_pembeli

			# Set Value Poin
			frappe.db.set_value("Master User", self.id_user, 'poin', poin_pembeli)
			frappe.db.commit()

			order.save()

			new_order = frappe.get_doc('Order', order.name)
			frappe.msgprint(
				'Pesanan dengan No "{}" Selesai Diproses'.format(new_order.name)
			)


	# Action = Canceled By Penjual (Kembalikan Poin dan Persediaan Produk)
	def on_action2(self):
		if (self.docstatus == 2 and self.workflow_state == 'Canceled By Penjual'):
			order = frappe.new_doc("Order")
			order.id_user = self.id_user
			order.nama_lengkap = self.nama_lengkap
			order.level_user = self.level_user
			order.tanggal_pemesanan = self.tanggal_pemesanan
			order.total_pembayaran = self.total_pembayaran
			order.poin_pembeli = 0
			order.status_order = self.workflow_state
			
			for i in self.request_order_line:
				order.append('data_pembelian', {
					'id_user' : i.id_user,
					'nama_penjual' : i.nama_penjual,
					'level_user' : i.level_user,
					'poin_penjual' : 0,
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
				'Pesanan dengan No "{}" Selesai Diproses'.format(new_order.name)
			)