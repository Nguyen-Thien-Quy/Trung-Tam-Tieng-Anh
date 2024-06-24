import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import payment from './vnpay_nodejs/routes/order.js';
import path from "path";
import { fileURLToPath } from 'url';
// Ngân hàng: NCB
// Số thẻ: 9704198526191432198
// Tên chủ thẻ:NGUYEN VAN A
// Ngày phát hành:07/15
// Mật khẩu OTP:123456
const app = express();
const port = 3000;
let login = false;
let currentUserId = -1;
let role;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', [
  path.join(__dirname, '/vnpay_nodejs/views'),
  path.join(__dirname, 'views')
]);
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Phục vụ các tệp tĩnh từ thư mục 'assets'
app.use(express.static(path.join(__dirname, 'assets')));

// Phục vụ các tệp tĩnh từ thư mục '/vnpay_nodejs/public'
app.use(express.static(path.join(__dirname, 'vnpay_nodejs/public')));
app.use('/order', payment);

app.get("/", async (req, res) => {
  const featuredCourses = await axios.get('http://localhost:4000/featuredCourses');
  const feedbacks = await axios.get('http://localhost:4000/feedbacks');
  res.render("index.ejs", {
    login: login,
    role: role,
    currentUserId: currentUserId,
    featuredCourses: featuredCourses.data,
    feedbacks: feedbacks.data
  });
  //res.render("qlhs.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post('http://localhost:4000/login', req.body);
    if(response.data.role === "student"){
      login = true;
      currentUserId = response.data.student_id;
      role = 'student';
      res.redirect("/");
    }else if(response.data.role === "teacher"){
      login = true;
      currentUserId = response.data.teacher_id;
      role = 'teacher';
      res.redirect("/");
    }else if(response.data.role === "admin"){
      login = true;
      currentUserId = response.data.admin_id;
      role = 'admin';
      res.redirect("/");
    }
    else{
      res.render("login.ejs", {
        err: 'error',
      })
    }
  } catch (error) {
    console.log(error);
  }
})

app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post("/register", async(req, res) => {
  //console.log(req.body);
  if(req.body.password !== req.body.password2){
    res.render("register.ejs", {
      err: 'sai'
    })
  }else{
    try {
    const response = await axios.post('http://localhost:4000/register', req.body);
    if(role === 'admin'){
      res.redirect("/");
    }else{
    //currentUserId = response.data.student_id;
      role = response.data.role;
      if(role === "teacher"){
        currentUserId = response.data.teacher_id;
        login = true;
        res.redirect("/");
      }else if(role === 'student'){
        currentUserId = response.data.student_id;
        login = true;
        res.redirect("/");
      }
    }
    } catch (error) {
      res.render("register.ejs", {
        err: 'trung'
      })
    }
  }
})

app.get("/qlhs", async (req, res) => {
  // console.log(role + currentUserId)
  try {
    if(role === 'student'){
      const user = await axios.get(`http://localhost:4000/student/${currentUserId}`);
      const data = user.data;
      res.render("qlhs.ejs", {
        data: data
      });
      console.log(user.data);
    }else{
      const user = await axios.get(`http://localhost:4000/teacher/${currentUserId}`);
      const data = user.data;
      res.render("qlhs.ejs", {
        data: data
      });
      console.log(user.data);
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/logout", (req, res) => {
  login = false;
  res.redirect("/");
});

//đổi mật khẩu
app.get("/changePass", (req, res) => {
  res.render("changePass.ejs");
})
app.post("/change-password", (req, res) => {
  console.log(req.body);
})
//-------------
app.post("/editInformation", async (req, res) => {
  try {
    console.log(req.body);
    if(role === "student"){
    const response = await axios.patch(`http://localhost:4000/student/${currentUserId}`, req.body);
    const data = response.data;
    res.render("qlhs.ejs", {
      data: data
    })
    }else{
      const response = await axios.patch(`http://localhost:4000/teacher/${currentUserId}`, req.body);
      const data = response.data;
      res.render("qlhs.ejs", {
      data: data
      })
    }
  } catch (error) {
    console.log(error);
  }
})
// tìm kiếm xong hiển thị ra chi tiết khoá học
app.post("/findCourse", async (req, res) => {
  console.log(req.body.course);
  try {
    const title = req.body.course;
    const response = await axios.get(`http://localhost:4000/course?course=${title}`);
    res.render("listcourse.ejs", {
      findCourse: true,
      element: "course",
      title: "Các khoá học về "+ title ,
      data: response.data
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/coursedetail/:id", async(req, res) => {
  const course_id = req.params.id;
  try {
    const coursedetail = await axios.get(`http://localhost:4000/coursedetail/${course_id}`);
    const feedbacks = await axios.get(`http://localhost:4000/feedback/${course_id}`);
    res.render("coursedetail.ejs", {
      course: coursedetail.data,
      feedbacks: feedbacks.data
    })
  } catch (error) {
    console.log(error);
  }
})
app.get("/myCourses", async(req, res) => {
  try {
    const response = await axios.get(`http://localhost:4000/myCourse/${currentUserId}`);
    res.render("listcourse.ejs", {
    role: role,
    element: "course",
    title: "Các khoá học của bạn",
    data: response.data,
    })
  } catch (error) {
    console.log(error);
  }
});
app.get("/allCourse", async(req, res) => {
  try {
    const response = await axios.get(`http://localhost:4000/allCourse`);
    res.render("listcourse.ejs", {
      role: role,
      element: "course",
      title: "Tất cả khoá học của trung tâm",
      data: response.data
    })
  } catch (error) {
    console.log(error);
  }
})
app.get("/teacherCourse/:id", async(req, res) => {
  const teacher_id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4000/teacherCourse/${teacher_id}`);
    res.render("listcourse.ejs", {
    role: role,
    qlhs: true,
    element: "course",
    teacher_id: teacher_id,
    title: "Các khoá học của giáo viên này",
    data: response.data,
    })
  } catch (error) {
    console.log(error);
  }
})

app.get("/editCourse/:id", async(req, res) => {
  const course_id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4000/course/${course_id}`);
    res.render("editCourse.ejs", {
      element: 'course',
      item: response.data
    });
  } catch (error) {
    console.log(error);
  }
})
app.get("/deleteCourse/:id", async(req, res) => {
  const course_id = req.params.id;
  try {
    const response = await axios.delete(`http://localhost:4000/deleteCourse/${course_id}`);
    if (role === 'teacher') {
      res.redirect(`/teacherCourse/${currentUserId}`);
    }else if(role === 'admin'){
      res.redirect("/allCourse");
    }
  } catch (error) {
    console.log(error);
  }
})
app.post("/submitCourse", async(req, res) => {
  try {
    const response = await axios.put(`http://localhost:4000/editCourse`, req.body);
    if(response.data === 'success' && role === 'admin'){
      res.redirect("/allCourse");
    }
    if(response.data === 'success' && role === 'teacher'){
      res.redirect(`/teacherCourse/${req.body.teacher_id}`);
    }
  } catch (error) {
    console.log(error)
  }
})
app.get("/createCourse/:id", async(req, res) => {
  res.render("editCourse.ejs", {
    role: role,
    element: 'course',
    teacher_id: req.params.id
  });
})
app.post("/createCourse/:id", async(req, res) => {
  const teacher_id = req.params.id;
  try {
    const response = await axios.post(`http://localhost:4000/createCourse/${teacher_id}`, req.body);
    if(response.data === 'success' && role ==='teacher'){
      res.redirect(`/teacherCourse/${teacher_id}`);
    }else if(response.data === 'success' && role ==='admin'){
      res.redirect("/allCourse");
    }
  } catch (error) {
    console.log(error);
  }
})
//teacher
app.get("/allTeacher",async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:4000/allTeacher`);
    res.render("listcourse.ejs", {
      role: role,
      element: "teacher",
      title: "Tất cả giáo viên",
      data: response.data,
    })
  } catch (error) {
    console.log(error);
  }
})
app.get("/editTeacher/:id", async(req, res) => {
  const teacher_id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4000/teacher/${teacher_id}`);
    res.render("editCourse.ejs", {
      element: 'teacher',
      item: response.data
    });
  } catch (error) {
    console.log(error);
  }
})
app.post("/submitTeacher", async (req, res) => {
  const teacher_id = req.body.id;
  try {
    const response = await axios.patch(`http://localhost:4000/teacher/${teacher_id}`, req.body);
    if(response.data !== 'error'){
    res.redirect("/allTeacher");
    }
  } catch (error) {
    console.log(error)
  }
})
app.get("/deleteTeacher/:id", async (req, res) => {
  const teacher_id = req.params.id;
  try {
    const response = await axios.delete(`http://localhost:4000/deleteTeacher/${teacher_id}`);
    if (response.data === 'success') {
      res.redirect("/allTeacher");
    } 
  } catch (error) {
    console.log(error);
  }
})
//student 
app.get("/addStudent/:id", async (req, res) => {
  const course_id = req.params.id;
  res.render("addStudent.ejs",{
    element: 'student',
    course_id: course_id
  })
})
app.post("/addStudent/:id", async (req, res) => {
  //console.log(req.body.email);
  const course_id = req.params.id;
  try {
    const response = await axios.post(`http://localhost:4000/addStudent/${course_id}`, req.body);
    if (response.data === 'success') {
      res.redirect(`/studentCourse/${course_id}`);
    }else{
      res.render("addStudent.ejs",{
        element: 'student',
        course_id: course_id,
        error: 'error'
      })
    } 
  } catch (error) {
    console.log(error);
  }
})
app.get("/editStudent", async (req, res) => {
  const student_id = req.query.student_id;
  try {
    if(role === 'teacher'){
      const course_id = req.query.course_id;
      const response = await axios.get(`http://localhost:4000/student/${student_id}`);
      res.render("editCourse.ejs", {
        element: 'student',
        role: role,
        course_id: course_id,
        item: response.data
      });
    }else{
      const response = await axios.get(`http://localhost:4000/student/${student_id}`);
      res.render("editCourse.ejs", {
        element: 'student',
        role: role,
        item: response.data
      });
    }
  } catch (error) {
    console.log(error);
  }
})
app.post("/submitStudent", async(req, res) => {
  const student_id = req.body.id;
  try {
    if(role === 'teacher'){
      const course_id = req.query.course_id;
      const response = await axios.patch(`http://localhost:4000/student/${student_id}`, req.body);
      if(response.data !== 'error'){
        res.redirect(`/studentCourse/${course_id}`);
      }
    }else{
      const response = await axios.patch(`http://localhost:4000/student/${student_id}`, req.body);
      if(response.data !== 'error'){
        res.redirect(`/allStudent`);
      }
    }
  } catch (error) {
    console.log(error)
  }
})
app.get("/deleteStudent", async (req, res) => {
  try {
    if(role === 'teacher'){
      const student_id = req.query.student_id;
      const course_id = req.query.course_id;
      const response = await axios.delete(`http://localhost:4000/studentCourse?student_id=${student_id}&course_id=${course_id}`);
      if (response.data === 'success') {
        res.redirect(`/studentCourse/${course_id}`);
      } 
    }else{
      const student_id = req.query.student_id;
      const response = await axios.delete(`http://localhost:4000/student/${student_id}`);
      if (response.data === 'success') {
        res.redirect("/allStudent");
      }  
    }  
  } catch (error) {
    console.log(error);
  }
})
app.get("/studentCourse/:id", async(req, res) => {
  const course_id = req.params.id;
  try {
    const response = await axios.get(`http://localhost:4000/studentCourse/${course_id}`);
    res.render("listStudent.ejs", {
      role: role,
      course_id: course_id,
      title: "Các học sinh của khoá học này",
      data: response.data
    })
  } catch (error) {
    console.log(error);
  }
})
app.get("/allStudent", async(req, res) => {
  try {
    const response = await axios.get(`http://localhost:4000/allStudent`);
    res.render("listStudent.ejs", {
      role: role,
      action: 'create',
      title: "Tất cả sinh viên",
      data: response.data
    })
  } catch (error) {
    console.log(error);
  }
})
//feedback
app.post("/feedback/:id", async(req, res) => {
  console.log(req.body);
  const course_id = req.params.id;
  const body = {
    student_id: currentUserId,
    course_id: course_id,
    feedback_text: req.body.feedback,
    created_at: new Date()
  }
  try {
    const response = await axios.post(`http://localhost:4000/feedback`, body);
    if(response.data === 'success'){
      res.redirect(`/coursedetail/${course_id}`);
    }
  } catch (error) {
    console.log(error);
  }
})
//payment
app.get("/payment/:id", async(req, res) => {
  const course_id = req.params.id;
  try {
    const coursedetail = await axios.get(`http://localhost:4000/coursedetail/${course_id}`);
    res.render("payment.ejs", {
      role: role,
      student_id: currentUserId,
      data: coursedetail.data
    });
  }catch (error) {
    console.log(error);
  }
})
//lession
app.get("/lesson", async(req, res) =>{
  res.render("lesson.ejs");
})
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
