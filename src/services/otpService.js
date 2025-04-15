const OtpModel = require("../models/user/otpModel")

exports.sendOtp = async (obj) => {
  try {
    let otpRecord = await OtpModel.findOne(obj);

    if (otpRecord) {
      if (otpRecord.resendCount >= 20) {
        return { success: false, message: "Retry limit exceeded. Please try after 5 minutes." };
      }

      
      otpRecord.otp = Math.floor(100000 + Math.random() * 900000); 
      otpRecord.resendCount += 1;
      otpRecord.createdAt = new Date();
      await otpRecord.save();
      
    } else {

      let createType;
      if(obj.phone){
       createType={phone:obj.phone,type:"phone"}
      }else{
        createType={email:obj.email,  type:"email"}
      
      }

      otpRecord = await OtpModel.create({
        ...createType,
        otp: Math.floor(100000 + Math.random() * 900000),
        resendCount: 1,
        createdAt : new Date()
      });
    }

    return { success: true, message: "OTP sent successfully.", otp: otpRecord.otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Error sending OTP." };
  }
};

exports.verfiyOtp= async(obj)=>{
  try {

    let checkObj;

  if(obj.phone){
    checkObj={phone:obj.phone,type:"phone"}
  }else {
    checkObj={email:obj.email,  type:"email"}
  }

  const check= await OtpModel.findOne(checkObj).lean()

     if(!check){
      return {success:false,message:"your otp expired, please resend otp"}
     }

     if(obj.otp!=check.otp){
      return {success:false ,message:"Incorrect otp"}
     }else{
      return {success:true,message:"otp verified successfully"}
     }

    
  } catch (error) {
    return {success:false ,message:"your otp expired,please resend the otp"}
  }
}

