import os

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

load_dotenv()


cloud_name = os.getenv("cloud_name")
api_key = os.getenv("api_key")
api_secret = os.getenv("api_secret_key")


print("Cloud:", cloud_name)
print("API Key exists:", bool(api_key))
print("API Secret exists:", bool(api_secret))


if not cloud_name or not api_key or not api_secret:
    raise RuntimeError(
        "Cloudinary configuration is missing. "
        "Check cloud_name, api_key and api_secret_key in .env"
    )


cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
    secure=True,
)