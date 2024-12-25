const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandle = require('./controllers/errorController');

// const customerRouter = require('./routes/customerRouter');
// const adminRouter = require('./routes/adminRouter');\

const deviceRouter = require('./routes/deviceRoutes');
const userRouter = require('./routes/userRoutes');

const cors = require('cors');

const app = express();

// MIDDLEWARES

// CORS để làm gì nhỉ? Nhớ search nha. Mình chỉ nhớ lúc đó mình cần nó nên mình thêm nó vào
app.use(cors());  

// Mình cũng quên mất morgan để làm gì, cũng phải search, nhưng giờ thì làm cái sản phẩm chạy được đã
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware này, "express.json()" là để đưa phần body của request vào biến "req"
// sau đó có thể truy cập bằng "req.body"
// Nếu không có cái này thì "req.body" rỗng
app.use(express.json()); // middleware to get the body of the request

// Thêm middleware này vào để Serving static files
// app.use(express.static(`${__dirname}/public`)); // set "public" folder is where to get the static files

// Cái này thì dễ rồi, để tính requestTime. À mà không dễ lắm, mình vẫn chưa thật sự hiểu nó làm gì
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
// app.use('/api/v1/customer', customerRouter);
// app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/devices', deviceRouter)

// Cái này là để xử lí những cái route không được xử lí
// Ý là cũng dùng 127.0.0.1:3000 nhưng phần đuôi đằng sau nó không tồn tại ấy
// Thì dùng cái này, và báo là "url này không tồn tại trên server này"
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Khi lỗi xảy ra, thay vì route dừng ở end-point, thì sẽ next() để tới middleware này
// Phần xử lí lỗi để trong errorController
// với code này: const globalErrorHandle = require('./controllers/errorController');
app.use(globalErrorHandle);

module.exports = app;