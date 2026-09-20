import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv
import os
load_dotenv()
cloud_name = os.getenv('cloud_name')
api_key = os.getenv('api_key')
api_secret = os.getenv('api_secret')
# Configuration       
cloudinary.config( 
    cloud_name = cloud_name, 
    api_key = api_key, 
    api_secret = api_secret,
    secure=True
)
