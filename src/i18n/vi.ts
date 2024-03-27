export const initial = {
  'Đăng nhập thành công': '',
  'Đăng nhập thất bại': '',
  'Làm ơn liên hệ với quản trị viên': '',
  'Đăng nhập': '',
  'Trường này là bắt buộc': '',
  'Tên đăng nhập hoặc email': '',
  'Nhập mật khẩu': '',
  'Bạn chưa có tài khoản': '',
  'Đăng ký ngay': '',
  'Đăng ký': '',
  'Quay lại': '',
  'Địa chỉ email': '',
  'Họ tên': '',
  'Tên đăng nhập': '',
  'Số điện thoại': '',
  'Email không hợp lệ': '',
  'Số điện thoại không hợp lệ': '',
};

export type TObj = typeof initial;

const mappedObj = Object.entries(initial).reduce(
  (prev, [key, value]) => ({ ...prev, [key]: value || key }),
  {} as TObj,
);

export const vi = mappedObj;
