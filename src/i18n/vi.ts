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
  'Đăng ký thành công': '',
  'Đăng ký thất bại': '',
  'Xác nhận': '',
  'Tạo mới thành công': '',
  'Chỉnh sửa thành công': '',
  'Tạo mới': '',
  'Chỉnh sửa': '',
  'Ngữ pháp': '',
  Đóng: '',
  'Tiêu đề': '',
  'Nội dung': '',
  Loại: '',
  'Cơ bản': '',
  'Nâng cao': '',
  'Xoá thành công': '',
  'Xoá thất bại': '',
  'Xác nhận xoá': '',
  'Bạn có chắc chắn muốn xoá không?': '',
  'Xoá đã chọn': '',
  Huỷ: '',
  'Tìm kiếm': '',
  STT: '',
  Xem: '',
  Xoá: '',
  'Hành động': '',
  'Chi tiết': '',
  'Người tạo': '',
  'chủ đề': '',
  'Trường này không được bỏ trống!': '',
  'mẹo làm bài': '',
  Part: '',
  'Câu đơn': '',
  'Câu nhóm': '',
  'Tip làm bài': '',
  'Tổng hợp đề thi': '',
  'Tổng hợp câu hỏi': '',
  'Quản lý người dùng': '',
  'Câu hỏi': '',
  'Phần thi': '',
  'Dạng bài': '',
  'File nghe': '',
  'Hình ảnh': '',
  'STT câu': '',
  'Thuộc đề': '',
  'Giải thích': '',
  'Đáp án': '',
  'Đáp án đúng': '',
  'Thêm câu trả lời': '',
  'Nghĩa đáp án': '',
  'Phải có đáp án đúng': '',
  'Nên có từ 3 hoặc 4 đáp án': '',
  'Nhóm câu hỏi': '',
  'Thêm câu hỏi': '',
  'Câu hỏi nhóm chỉ nên từ 2-5 câu': '',
  'Câu trả lời': '',
  'Dạng câu': '',
  Ảnh: '',
  'đề thi': '',
  'Tên đề thi': '',
  'Câu hỏi part 1': '',
  'Câu hỏi part 2': '',
  'Câu hỏi part 3': '',
  'Câu hỏi part 4': '',
  'Câu hỏi part 5': '',
  'Câu hỏi part 6': '',
  'Câu hỏi part 7': '',
  'Câu hỏi part': '',
  'Part 1 có 6 câu hỏi': '',
  'Part 2 có 25 câu hỏi': '',
  'Part 3 có 39 câu hỏi': '',
  'Part 4 có 30 câu hỏi': '',
  'Part 5 có 30 câu hỏi': '',
  'Part 6 có 16 câu hỏi': '',
  'Part 7 có 54 câu hỏi': '',
  'Quên mật khẩu?': '',
  'Thông tin': '',
  'Nhập excel': '',
  'Nhập dữ liệu': '',
  'Tải về template excel tại đây': '',
  'Tải về': '',
  'Nhập excel thành công': '',
  'Đã có lỗi xảy ra': '',
  ID: '',
  'Người dùng': '',
  'Giới tính': '',
  'Ngày sinh': '',
  Quyền: '',
  'Thời gian tạo': '',
  'Họ và tên': '',
  Email: '',
  'Thông tin cá nhân': '',
  Nam: '',
  Nữ: '',
  Khác: '',
  Lọc: '',
  'Bỏ lọc': '',
  Lưu: '',
  'Tạo đề ngẫu nhiên': '',
  'Thống kê': '',
  'Thống kê người dùng': '',
  'Tổng số tài khoản người dùng': '',
  'Tổng số bài viết đã đăng': '',
  'Thống kê câu hỏi': '',
  'Số câu hỏi được thêm': '',
  Tháng: '',
  'Thống kê tỷ lệ câu hỏi': '',
  'Câu nghe': '',
  'Câu đọc': '',
  'Tỷ lệ đúng': '',
  'Tỷ lệ sai': '',
  'Phần trăm sai': '',
  'Phần trăm đúng': '',
  Listening: '',
  Reading: '',
  'Tỷ lệ làm bài': '',
  'Số câu hỏi': '',
};

export type TObj = typeof initial;

const mappedObj = Object.entries(initial).reduce(
  (prev, [key, value]) => ({ ...prev, [key]: value || key }),
  {} as TObj,
);

export const vi = mappedObj;
