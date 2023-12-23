
export const errorHandler=(statusCode,Message)=>{
  let newError=new Error();
  newError.message=Message;
  newError.statusCode=statusCode;
  return newError;
}

