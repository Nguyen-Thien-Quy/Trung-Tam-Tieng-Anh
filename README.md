# Web Courses
- Đồ án môn học - Phát triển ứng dụng website

- Thông tin liên hệ: quythiennguyen.cv@gmail.com

## Mô tả đề tài
- Mục tiêu đề tài: Một ứng dụng website giúp người sử dụng có thể mua và học các khóa học trực tuyến. Cùng với đó làn những giảng viên có thể tạo và quản lý khóa học của mình
- 4 actors chính: Guest, Student, Teacher, Admin
- Chức năng của Guest:
    - Đăng ký tài khoản
    - Hệ thống menu
    - Trang chủ
    - Xem danh sách khóa học
    - Tìm kiếm khóa học
    - Xem chi tiết khóa học
    - Xem tất cả các giảng viên và các khoá học của giảng viên 
- Chức năng của Người dùng:
    - Toàn bộ chức năng của Guest
    - Quản lý hồ sơ cá nhân
    - Mua khóa học
    - Đánh giá & phản hồi khóa học
    - Xem nội dung bài giảng
- Chức năng của Giảng viên:
    - Toàn bộ chức năng của Guest
    - Bổ sung thông tin, bài giảng cho khóa học
    - Quản lý hồ sơ cá nhân
- Chức năng của Admin
    - Quản lý khóa học
    - Quản lý danh sách học viên, giảng viên
- Các tính năng chung cho phân hệ Người dùng, Giảng viên, Admin
    - Đăng nhập/đăng xuất
    - Cập nhật thông tin cá nhân
    - Đổi mật khẩu

## Công nghệ được sử dụng trong đồ án
- Phía font-end
    - Sử dụng HTML/CSS/JS/JQuery để code giao diện(Các mẫu giao diện được tham khảo từ [https://bootsnipp.com/](https://bootsnipp.com
    "bootsnipp")
    - Sử dụng view-engine ejs và jade(Cho phép người dùng thêm code JS vào đoạn code HTML) 
- Phía backend
    - Quản lý server: `NodeJS express`
    - Quản lý database: `PostgreSQL`
    - Xử lý thanh toán: `VNPay` 

## **Demo**
### Phân hệ người dùng
- **Giao diện trang chủ**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/ETbH65p4pHFMnER2KckjJgkBwKPKM-LIhIf2trolRk4sUg?e=zoxgb1]


- **Giao diện danh sách khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EYmFS14h3bJJrWwDAMOjoj0BRplZxYYTtUak1myBu2M7jg?e=XXKez0]

- **Giao diện chi tiết khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EdNoRrgqKIJGsjhyeH_ka-kBldYoDHbrSFVudX7FYqU2hQ?e=SJ2Pnp]

- **Giao diện thanh toán khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EcpNNKDdpORHv6o3AEuMT-EBkAevhaNlw5kASrdXgGhIlw?e=t5tytV]

- **Giao diện đăng nhập**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EUE-j9GRuOJHhIpFSwTo8sIBoSfRy8B4dum_0i1Mt1ADTA?e=oHckEp]

- **Giao diện đăng ki**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EfO-deTESL9Io8CTkm4nzwABCr-LMEwKptiih-a5HBeiww?e=TF4Ptu]

- **Giao diện hồ sơ cá nhân**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EQ8fQS6X_uZEtCY6yW7kk0EB8d7GTYDix59Pd6wBmPgKUQ?e=hY1VJX]

### Phân hệ admin, giảng viên
- **Giao diện quản lý danh sách khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/Ee1O3Bakrf9JiJEo14soikIBFd1jEFiXUTgSFAs4T3AsYw?e=SyRJND]

- **Giao diện tạo khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EStmJXdseqdJvVX7JUWEtuMBqEfTlX8WAKBLHQyK2naXhg?e=l2wPca]

- **Giao diện chỉnh sửa khóa học**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/ERFBEEf9BbpOpfr1KUbv0ngBy6nw1elr7XyE49AlyOS4oQ?e=GmJzOR]

- **Giao diện quản lý danh sách học viên**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EcAylL2gcfhHlcRud4qlgZsBgCW5OzzY0EnvY-lhPioz5w?e=huVkyZ]

- **Giao diện quản lý giao viên**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/EfzIXqI6-KJKupZ0EwfWGeABTNWrMN4YwX4HwTbP-5i9Eg?e=8bif7d]

- **Giao diện chỉnh sửa người dùng**
    [https://actvneduvn-my.sharepoint.com/:i:/g/personal/at180440_actvn_edu_vn/ETwJ5ft8Y69Bnom2oXPKYWsBoCUY15sMmd98vohF2_dhMA?e=DA0cbu]


**END**
