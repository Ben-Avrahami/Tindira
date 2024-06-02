import os
import glob

# Root directory where the subdirectories are located
root_dir = 'C:\\Users\\galbenar\\OneDrive - Intel Corporation\\Desktop\\Work\\clones\\CloudNetWorkshopUni\\Tindira-Server\\datebase\\Images\\Listings'

# Iterate over each subdirectory
for subdir in range(1, 101):  # From listing1 to listing100
    dir_name = os.path.join(root_dir, f'listing{subdir}')
    
    # Get all image files in the current directory
    image_files = glob.glob(os.path.join(dir_name, '*'))
    
    # Sort image files (optional, depending on desired order)
    image_files.sort()
    
    # Rename each image file
    for idx, image_path in enumerate(image_files, start=1):
        # Get the file extension
        _, ext = os.path.splitext(image_path)
        
        # Define the new file name
        new_name = os.path.join(dir_name, f'image{idx}{ext}')
        
        # Rename the file
        os.rename(image_path, new_name)
        print(f'Renamed {image_path} to {new_name}')
