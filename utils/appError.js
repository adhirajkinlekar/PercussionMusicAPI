class AppError extends Error {
   constructor(message,err){
    super(message);
    this.statusCode = err.statusCode;
    this.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
   }

}
module.exports = AppError;