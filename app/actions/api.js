import { BaseConfig } from "@config";
import { store } from "@store"
import * as actionTypes from "./actionTypes";
import base64 from 'react-native-base64'
import { Platform } from 'react-native';

const _REQUEST2SERVER = (url, params = null, type = null, is_file = null) => {
	const isGet = (params == null);
	return new Promise(function (resolve, reject) {
		fetch(`${BaseConfig.SERVER_HOST}${url}`, {
			method: type ? type : isGet ? 'get' : 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${base64.encode(BaseConfig.AUTH_USERNAME + ':' + BaseConfig.AUTH_PASSWORD)}`,
			},
			...(!isGet && { body: is_file ? params : JSON.stringify(params) })
		})
			.then(res => res.json())
			.then(res => {
				if (res?.Response_Status == 'Success' || res?.Success_Response?.Response_Status == "Success") resolve(res);
				else reject(res);
			})
			.catch(err => {
				reject(err)
			});
	});
}
export const registration = (params) => {
	return _REQUEST2SERVER(`User/SignUp`, params);
}
export const login = (params) => {
	return _REQUEST2SERVER(`User/Login`, params);
}
export const reset_password = (params) => {
	return _REQUEST2SERVER(`User/Reset_Password`, params);
}
export const email_verification = (params) => {
	return _REQUEST2SERVER(`User/Email_Verification`, params);
}
export const mobile_otp = (params) => {
	return _REQUEST2SERVER(`User/Mobile_OTP`, params);
}
export const mobile_verification = (params) => {
	return _REQUEST2SERVER(`User/OTP_Verification`, params);
}
export const email_exist = (params) => {
	return _REQUEST2SERVER(`User/Name_Existence`, params);
}
export const create_profile = (params) => {
	return _REQUEST2SERVER(`User/Profile_Create`, params);
}
export const update_profile = (params) => {
	return _REQUEST2SERVER(`User/Profile_Update`, params, 'put');
}
export const upload_image = (data, email_id) => {
	let file_type = data.type.split('/')[1] == 'jpeg' ? 'jpg' : data.type.split('/')[1];
	return _REQUEST2SERVER(`User/Image?filename=test&file_extension=${file_type}&filetype=image&user_details_id=${email_id}`, data, null, true);
}
export const get_user_details = (params, page_no = 0, page_size = 500, order_by = 'ASC', sort_by = 'EMAIL_ID') => {
	return _REQUEST2SERVER(`User/Profile_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_banner = (params, page_no = 0, page_size = 10, order_by = 'ASC', sort_by = 'TITLE') => {
	return _REQUEST2SERVER(`Banner/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_all_categories = (page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'CATEGORY_NAME') => {
	return _REQUEST2SERVER(`Categories/AllCategoryGet?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, "");
}
export const get_categories = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'CATEGORY_NAME') => {
	return _REQUEST2SERVER(`Categories/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_sub_categories = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'SUB_CATEGORY_NAME') => {
	return _REQUEST2SERVER(`Categories/Sub_Category_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_products = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'PRODUCT_NAME') => {
	return _REQUEST2SERVER(`Products/Product_LatestVersion_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_product_images = (params) => {
	return _REQUEST2SERVER(`Products/Product_Image_Get`, params);
}
export const get_related_products = (params) => {
	return _REQUEST2SERVER(`Products/Related_Product_Get`, params);
}
export const get_product_reviews = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'Reviews') => {
	return _REQUEST2SERVER(`Reviews/Product_Review_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_orders = (params) => {
	return _REQUEST2SERVER(`Order/Get`, params);
}
export const delete_order = (params) => {
	return _REQUEST2SERVER(`Order/Delete`, params);
}
export const get_brands = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'BRAND_NAME') => {
	return _REQUEST2SERVER(`Brand/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_deals = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'CATEGORY_NAME') => {
	return _REQUEST2SERVER(`Deals/Deal_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_coupons = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'NAME') => {
	return _REQUEST2SERVER(`Coupons/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_wish_list = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'USER_EMAIL_ID') => {
	return _REQUEST2SERVER(`User_Wishlist/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const create_wish_list = (params) => {
	return _REQUEST2SERVER(`User_Wishlist/Create`, params);
}
export const update_wish_list = (params) => {
	return _REQUEST2SERVER(`User_Wishlist/Update`, params);
}
export const delete_wish_list = (params) => {
	return _REQUEST2SERVER(`User_Wishlist/Delete`, params);
}
export const create_address = (params) => {
	return _REQUEST2SERVER(`User/Address_Create`, params);
}
export const update_address = (params) => {
	return _REQUEST2SERVER(`User/Address_Update`, params, 'put');
}
export const delete_address = (params) => {
	return _REQUEST2SERVER(`User/Address_Delete`, params);
}
export const get_address = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'EMAIL_ID') => {
	return _REQUEST2SERVER(`User/Address_Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const create_offer_visitor = (params) => {
	return _REQUEST2SERVER(`Offers_Visitor/Create`, params);
}
export const get_gift_voucher = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Get`, params);
}
export const create_gift_voucher = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Create`, params);
}
export const get_gift_voucher_image = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Image_Get`, params);
}
export const get_ordered_gifts = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Ordered_Gifts_Get`, params);
}
export const get_received_gifts = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Received_Gifts_get`, params);
}
export const get_gift_vender = (params) => {
	return _REQUEST2SERVER(`Gift_Voucher/Vendor_Get`, params);
}
export const get_user_wallet = (params) => {
	return _REQUEST2SERVER(`User_Wallet/User_Wallet_Get`, params);
}
export const user_wallet_withdraw = (params) => {
	return _REQUEST2SERVER(`User_Wallet/User_Withdraw_Request`, params);
}
export const user_wallet_history = (params) => {
	return _REQUEST2SERVER(`User_Wallet/User_Wallet_History_Get`, params);
}
export const create_transactions = (params) => {
	return _REQUEST2SERVER(`Transactions/Create`, params);
}
export const get_transactions = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'NAME') => {
	return _REQUEST2SERVER(`Transactions/Get?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_partner_products = (params, page_no = 0, page_size = 200, order_by = 'ASC', sort_by = 'NAME') => {
	return _REQUEST2SERVER(`Partners/Partner_Product_Online_Physical?PageNo=${page_no}&PageSize=${page_size}&SortBy=${sort_by}&SortOrder=${order_by}`, params);
}
export const get_partner_details = (params) => {
	return _REQUEST2SERVER(`Partners/Online_Profile_Get`, params);
}
export const create_refer = (params) => {
	return _REQUEST2SERVER(`Refer_Earn/Create`, params);
}
export const get_refer = (params) => {
	return _REQUEST2SERVER(`Refer_Earn/Get`, params);
}
export const search_products = (params) => {
	return _REQUEST2SERVER(`Products/Product_Name_Search`, params);
}
export const create_order = (params) => {
	return _REQUEST2SERVER(`Order/Create`, params);
}