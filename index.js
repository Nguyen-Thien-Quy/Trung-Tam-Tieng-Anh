import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'
import bcrypt from "bcrypt";

//
const app = express();
const port = 4000;
const saltRounds = 10;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "CDCS",
  password: "Quyquy2003#",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use(bodyParser.json());


async function getALlStudent(){
  const allStudent = await db.query("select *from students order by student_id");
  return allStudent.rows;
}
async function getAllTeacher(){
  const allTeacher = await db.query("select *from teachers order by teacher_id");
  return allTeacher.rows;
}

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;
  try {
    const checkStudent = await db.query("SELECT * FROM students WHERE email = $1", [email]);
    const checkTeacher = await db.query("SELECT * FROM teachers WHERE email = $1", [email]);
    const checkAdmin = await db.query("SELECT * FROM admin WHERE email = $1", [email]);
    if (checkStudent.rows.length > 0) {
      const user = checkStudent.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.json(user);
          } else {
            res.json("error");
          }
        }
      });
    } else if(checkTeacher.rows.length > 0){
      const user = checkTeacher.rows[0];
      const storedHashedPassword = user.password;
      //verifying the password
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.json(user);
          } else {
            res.json("error");
          }
        }
      });
    } else if(checkAdmin.rows.length > 0){
      const user = checkAdmin.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.json(user);
          } else {
            res.json("error");
          }
        }
      });
    }
    else {
      res.json("error");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async(req, res) => {
  var allUser;
  var id;
  var name= req.body.name;
  var email= req.body.email;
  var password = req.body.password;
  var phone= req.body.phone;
  var address= req.body.address;
  var gender=req.body.gender;
  var role = req.body.role;
  var findStudent = await db.query("select *from students where email = $1", [req.body.email]);
  var findTeacher = await db.query("select *from teachers where email = $1", [req.body.email]);
  if(req.body.role === 'student'){
    allUser = await getALlStudent();
    id = allUser.length;
  }
  else{
    allUser = await getAllTeacher();
    id = allUser.length;
  }
  if(findStudent.rows.length > 0 || findTeacher.rows.length > 0){
    res.status(409).json("trung email");
  }else{
  bcrypt.hash(password, saltRounds, async (err, hash) => {
  if(req.body.role === 'student'){
    db.query("INSERT INTO students (name, email, password, phone, address, gender, role) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
    [name, email, hash, phone, address, gender, role]);
    const addStudent = await db.query("select *from students where email = $1", [email]);
    res.status(201).json(addStudent.rows[0]);
  }
  if(req.body.role === 'teacher'){
    db.query("INSERT INTO teachers (name, email, password, phone, address, gender, role) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
    [name, email, hash, phone, address, gender, role]);
    const addTeacher = await db.query("select *from teachers where email = $1", [email]);
    res.status(201).json(addTeacher.rows[0]);
  }
  });
}
});
//teacher
app.get("/allTeacher",async (req, res) => {
  const allTeacher = await getAllTeacher();
  res.status(200).json(allTeacher);
})
app.get("/teacher/:id", async (req, res) => {
  // console.log(req.params.id);
  const teacher = await db.query("select *from teachers where teacher_id = $1", [req.params.id]);
  res.status(200).json(teacher.rows[0]);
})
app.patch("/teacher/:id", async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const result = await db.query("select *from teachers where teacher_id = $1", [id]);
  const teacher = result.rows[0];
  var name= req.body.name  || teacher.name;
  var email= req.body.email || teacher.email;
  var phone= req.body.phone || teacher.phone;
  var address= req.body.address || teacher.address;
  var gender=req.body.gender || teacher.gender;
  var description = req.body.description || teacher.description_teacher;
  var experience = req.body.experience || teacher.experience;

  if(email !== teacher.email){
    var findTeacher = await db.query("select *from teachers where email = $1", [email]);
    if(findTeacher.rows.length > 0){
      res.status(400).json("error");
    }else{
      db.query("update teachers set name = $1, email = $2, phone = $3, address = $4, gender = $5, description_teacher = $6, experience = $7 where teacher_id = $8;", [name, email, phone, address, gender, description, experience, id]);
      const newTeacher = await db.query("select *from teachers where teacher_id = $1", [id]);
      res.json(newTeacher.rows[0]);
    }
  }else{
    db.query("update teachers set name = $1, email = $2, phone = $3, address = $4, gender = $5, description_teacher = $6, experience = $7 where teacher_id = $8;", [name, email, phone, address, gender, description, experience, id]);
      const newTeacher = await db.query("select *from teachers where teacher_id = $1", [id]);
      res.json(newTeacher.rows[0]);
  }
})
app.delete("/deleteTeacher/:id", async (req, res) => {
  await db.query("delete from teachers where teacher_id = $1", [req.params.id]);
  const check = await db.query("delete from teachers where teacher_id = $1", [req.params.id]);
  if(check.rows.length > 0){
    res.status(400).json("error");
  }else{
    res.status(200).json("success");
  }
})
//student
app.get("/allStudent",async (req, res) => {
  const allStudent = await getALlStudent();
  res.status(200).json(allStudent);
})
app.get("/student/:id", async (req, res) => {
  const student = await db.query("select *from students where student_id = $1 order by student_id", [req.params.id]);
  res.status(200).json(student.rows[0]);
})
app.get("/studentCourse/:id", async (req, res) => {
  const id = req.params.id;
  const students = await db.query("select s.name, s.email, s.phone, s.address, s.gender,s.student_id from courses c join student_course sc ON sc.course_id = c.course_id join students s on s.student_id = sc.student_id where c.course_id = $1 order by student_id", [id]);
  res.status(200).json(students.rows);
})
app.patch("/student/:id", async (req, res) => {
  //console.log(req.body);
  const id = req.params.id;
  const result = await db.query("select *from students where student_id = $1", [id]);
  const student = result.rows[0];
  var name= req.body.name  || student.name;
  var email= req.body.email || student.email;
  var phone= req.body.phone || student.phone;
  var address= req.body.address || student.address;
  var gender=req.body.gender || student.gender;

  if(email !== student.email){
    var findStudent = await db.query("select *from students where email = $1", [email]);
    if(findStudent.rows.length > 0){
      res.status(400).json("error");
    }else{
      db.query("update students set name = $1, email = $2, phone = $3, address = $4, gender = $5 where student_id = $6;", [name, email, phone, address, gender, id]);
      const newStudent = await db.query("select *from students where student_id = $1", [id]);
      res.json(newStudent.rows[0]);
    }
  }else{
      db.query("update students set name = $1, email = $2, phone = $3, address = $4, gender = $5 where student_id = $6;", [name, email, phone, address, gender, id]);
      const newStudent = await db.query("select *from students where student_id = $1", [id]);
      res.json(newStudent.rows[0]);
  }
})
app.delete("/studentCourse", async (req, res) => {
  const student_id = req.query.student_id;
  const course_id = req. query.course_id;
  await db.query("delete from student_course where student_id = $1 and course_id = $2", [student_id, course_id]);
  res.json("success");
})
app.delete("/student/:id", async (req, res) => {
  const student_id = req.params.id;
  await db.query("delete from students where student_id = $1", [student_id]);
  res.json("success");
})
//course
app.get("/allCourse", async(req, res) => {
  const allCourse = await db.query("select c.course_id, c.title, c.description, c.cost, c.teacher_id, t.name from courses c join teachers t on c.teacher_id = t.teacher_id order by course_id");
  res.status(200).json(allCourse.rows);
})
app.post("/addStudent/:id", async(req, res) => {
  const course_id = req.params.id;
  const email = req.body.email;
  const student = await db.query("select student_id from students where email = $1", [email]);
  if(student.rows.length > 0){
  const student_id = student.rows[0].student_id;
  const check = await db.query("select *from student_course where course_id = $1 and student_id = $2", [course_id, student_id]);
  if(check.rows.length > 0){
    res.json("error");
  }else{
    const response = await db.query("insert into student_course(student_id, course_id) values ($1, $2)", [student_id, course_id]);
    res.json("success");
  }
  }else{
    res.json("error");
  }
})
app.get("/course/:id", async(req, res) => {
  const course = await db.query("select *from courses where course_id = $1", [req.params.id]);
  res.status(200).json(course.rows[0]);
})
app.get("/course", async(req, res) => {
  const course = req.query.course;
  console.log(course);
  const listCourse = await db.query("select c.course_id, c.title, c.description, c.cost, c.teacher_id, t.name from courses c join teachers t on c.teacher_id = t.teacher_id where title ilike $1", [`%${course}%`]);
  res.json(listCourse.rows);
})
// test SQL Injection
// app.get("/course", async(req,res) => {
//   const course_id = req.query.id;
//   console.log(course_id);
//   const query =  `select *from courses where course_id = ${course_id}`;
//   const listCourse = await db.query(query);
//   //const listCourse = await db.query("select *from courses where course_id = $1", [course_id]);
//   res.json(listCourse.rows);
// });
app.get("/myCourse/:student_id", async(req, res) =>{
  const student_id = req.params.student_id;
  //console.log(student_id);
  const listCourse = await db.query("select c.course_id, c.title, c.cost, c.description, c.teacher_id, t.name from courses c join student_course sc on sc.course_id = c.course_id join students s on s.student_id = sc.student_id join teachers t on c.teacher_id = t.teacher_id where s.student_id = $1", [student_id]);
  res.json(listCourse.rows);
})
app.get("/teacherCourse/:id", async(req, res) =>{
  const teacher_id = req.params.id;
  //console.log(student_id);
  const listCourse = await db.query("select c.course_id, c.title, c.cost, c.description, c.teacher_id, t.name from courses c join teachers t on c.teacher_id = t.teacher_id where t.teacher_id = $1", [teacher_id]);
  res.json(listCourse.rows);
})
app.get("/coursedetail/:id", async(req, res) => {
  const course_id = req.params.id;
  const coursedetail = await db.query("select c.course_id, c.title, c.description, c.cost, t.name, t.description_teacher from courses c join teachers t on t.teacher_id = c.teacher_id where c.course_id = $1", [course_id]);
  res.json(coursedetail.rows[0]);
})
app.get("/featuredCourses", async(req, res) => {
  const featuredCourses = await db.query("select * from courses where featured = true order by description");
  res.json(featuredCourses.rows);
})
app.delete("/deleteCourse/:id", async(req, res) => {
  const course_id = req.params.id;  
  const result = await db.query("delete from courses where course_id = $1", [course_id]);
  res.json(result.rows);
  //console.log(course_id);
})
app.post("/createCourse/:id", async(req, res) => {
  const teacher_id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const cost = req.body.cost;
  await db.query("insert into courses(title, description, cost, teacher_id) values ($1, $2, $3, $4)", [title, description, cost, teacher_id]);
  res.json("success");
})
app.put("/editCourse", async(req, res) => {
  const course_id = req.body.id;
  const title = req.body.title ;
  const description = req.body.description;
  const cost = req.body.cost;
  await db.query("update courses set title = $1, description = $2, cost = $3 where course_id = $4", [title, description, cost, course_id]);
  res.json("success");
})
//payment
app.get("/allPayment", async(req, res) => {
  const allPayment = await db.query("select s.student_id, s.name, p.cost, c.title, p.payment_date from payments p join courses c on c.course_id = p.course_id join students s on s.student_id = p.student_id");
  res.status(200).json(allPayment.rows);
})
app.get("/payment/:id", async(req, res) => {
  const course = await db.query("select s.student_id, s.name, p.cost, c.title, p.payment_date from payments p join courses c on c.course_id = p.course_id join students s on s.student_id = p.student_id where p.payment_id = $1", [req.params.id]);
  res.status(200).json(course.rows[0]);
})
//feedback
app.get("/feedback/:id", async(req, res) => {
  const course_id = req.params.id;
  const feedbacks = await db.query("select s.name, f.created_at, f.feedback_text from feedbacks f join students s on s.student_id = f.student_id where course_id = $1", [course_id]);
  res.json(feedbacks.rows);
})
app.get("/feedbacks", async(req, res) => {
  const feedbacks = await db.query("select DISTINCT on (f.course_id) f.student_id, f.course_id, f.feedback_text, s.name, c.title from feedbacks f join students s on s.student_id = f.student_id join courses c ON c.course_id = f.course_id");
  res.json(feedbacks.rows);
})
app.post("/feedback", async(req, res) => {
  const course_id = req.body.course_id;
  const student_id = req.body.student_id;
  const feedback_text = req.body.feedback_text;
  const created_at = req.body.created_at;
  await db.query("insert into feedbacks(student_id, course_id, feedback_text, created_at) values ($1, $2, $3, $4)", [student_id, course_id, feedback_text, created_at]);
  res.json('success');
})
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
