from fastapi import APIRouter, Response, Query, Depends, HTTPException
from passlib.context import CryptContext
from app.models.User import User
from app.services.redis import get_redis
from app.schemas.auth import UserSignIn, UserSignUp, GoogleAuth, EmailVerification, AuthProvider
from jose import jwt
import logging
from pydantic import EmailStr
from datetime import datetime, timedelta
import redis.asyncio as redis
from app.core.settings import SECRET_KEY, ALGORITHM
import random
from app.services.oauth import verify_google_token
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/sign-in")
async def signin(data:UserSignIn, response:Response):
    try:
        user = await User.find_one({"email":data.email})
        if not user:
            raise HTTPException(status_code=404, detail={"success":False, "msg":"No users found"})
        verify = pwd_context.verify(data.password, user.password)
        if not verify:
            raise HTTPException(status_code=401, detail={"success":False, "msg":"Incorrect password"})
        
        token = jwt.encode({"id":str(user.id), "name":user.name, "exp":datetime.utcnow()+timedelta(minutes=60)}, SECRET_KEY, algorithm=ALGORITHM)
        response.set_cookie(
            key="auth_token",
            value=token,
            secure=True,
            httponly=True,
            samesite="none",
            path="/",
            max_age=3600
        )
        return {"success":True, "msg":"Login successfull", "user_data":{"name":user.name}}        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An eror occured in Signin route, Error:\n{str(e)}")
        raise HTTPException(status_code=500, detail={"success":False, "msg":"Server error"})
    
@router.get('/generate-otp')
async def generate_otp(email:EmailStr = Query(...), redis:redis.Redis = Depends(get_redis)):
    try:
        user = await User.find_one({"email":email})
        if user:
            raise HTTPException(status_code=403, detail="Email taken")
        
        otp = str(random.randint(100000, 999999))
        print(otp)
        # optional render service can be added here if you have domain
        await redis.set(f"otp.{email}", otp, ex=500)        
        return {"success":True, "msg":"Otp generated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occured while generating otp, Error:\n{str(e)}")
        raise HTTPException(status_code=500, detail={"success":False, "msg":"Server error"})
    
@router.post("/validate-otp")
async def validate_otp(data:EmailVerification, redis:redis.Redis = Depends(get_redis)):
    try:
        user = await User.find_one({"email":data.email})
        if user:
            raise HTTPException(status_code=403, detail={"success":False, "msg":"Email Taken"})
        
        otp = await redis.get(f"otp.{data.email}")
        if not otp:
            raise HTTPException(status_code=410, detail={"success":False, "msg":"Otp expired"})
        
        if otp != data.otp:
            raise HTTPException(status_code=401, detail = {"success":False, "msg":"Incorrect otp"})
        
        return {"success":True, "msg":"Email verified successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occured while validating otp, Error:\n{str(e)}")
        raise HTTPException(status_code=500, detail={"success":False, "msg":"Server Error"})
    
@router.post("/sign-up")
async def sign_up(data:UserSignUp):
    try:
        user = await User.find_one({"email":data.email})
        if user:
            raise HTTPException(status_code=403, detail={"success":False, "msg":"Email taken"} )
        
        hashed_pass = pwd_context.hash(data.password)
        user = User(
            name=data.name,
            email=data.email,
            password=hashed_pass,
            google_id=None,
            auth_provider=data.auth_provider
        )
        await user.insert()
        
        return {"success":True, "msg":"Account created"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occured in signup route, Error:\n{str(e)}")
        raise HTTPException(status_code=500, detail={"success":False, "msg":"Server Error"})
    
@router.post("/google-auth")
async def google_auth(data:GoogleAuth, response:Response):
    try:
        payload = verify_google_token(data.google_token)
        if not payload:
            raise HTTPException(status_code=400, detail ={"success":False, "msg":"Invalid Google Token"})

        if not payload.get("email_verified"):
            raise HTTPException(400, detail={"success":False, "msg":"Email not verified"})

        email = payload["email"]
        google_id = payload["google_id"]
        name = payload.get("name")
        
        user = await User.find_one({"email":email})
        if not user:
            user = User(
                name=name,
                google_id=google_id,
                auth_provider=AuthProvider.GOOGLE,
                password=None,
                email = email,
            )
            await user.insert()
        token = jwt.encode({"id":str(user.id), "name":user.name, "exp":datetime.utcnow()+timedelta(minutes=60)}, SECRET_KEY, algorithm=ALGORITHM)
        response.set_cookie(
            name="auth_token",
            value=token,
            secure=True,
            httponly=True,
            samesite="none",
            path = "/",
            max_age=3600
        )
        
        return {"success":True,"msg":"Login successfully", "user_data":{"name":user.name}}
                    
    except HTTPException:
        raise 
    except Exception as e:
        logger.error(f"An error occured in Google Auth route, Error:\n{str(e)}")
        raise HTTPException(status_code=500, detail={"success":False, "msg":"Server Error"})