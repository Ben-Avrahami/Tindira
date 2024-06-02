import boto3
import os

# Initialize S3 client
s3 = boto3.client('s3')

# Local directory containing listing images
local_directory = 'C:\\Users\\galbenar\\OneDrive - Intel Corporation\\Desktop\\Work\\clones\\CloudNetWorkshopUni\\Tindira-Server\\datebase\\Images\\Listings'

# S3 bucket name
bucket_name = 'tindira'

# Upload images to S3
for directory_name in os.listdir(local_directory):
    # Construct the S3 key
    s3_key_prefix = f'listings/{directory_name}/'
    
    # Iterate over image files in the directory
    for file_name in os.listdir(os.path.join(local_directory, directory_name)):
        local_file_path = os.path.join(local_directory, directory_name, file_name)
        s3_key = f'{s3_key_prefix}{file_name}' 
        # Construct S3 key with the desired structure
        
        # Upload the image file to S3
        s3.upload_file(local_file_path, bucket_name, s3_key)

print("Images uploaded to S3 successfully.")
